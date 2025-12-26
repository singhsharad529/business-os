import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import {
  Plus,
  FileText,
  DollarSign,
  Briefcase,
  Users,
  ClipboardList,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  Info,
  Sparkles,
  Upload,
  MessageSquare,
  Package,
  ChevronRight,
  Eye,
  Settings,
  UserPlus,
  BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import BarChart from "@/components/chart/BarChart";
import { callData, callSeries } from '@/lib/calls';
import { metricsSeries, metricsToChartData } from '@/lib/metrics';


type TimeContext = 'today' | 'week' | 'month';

export function CompanyDashboard() {
  const { user } = useAuth();
  const {
    getCompany,
    getEntitiesByCompany,
    getAlertsByCompany,
    activities,
    entities,
  } = useData();
  const navigate = useNavigate();
  const [timeContext, setTimeContext] = useState<TimeContext>('today');

  const company = user?.companyId ? getCompany(user.companyId) : getCompany("c-1");
  const allEntities = user?.companyId ? getEntitiesByCompany(user.companyId) : [];
  const alerts = user?.companyId ? getAlertsByCompany(user.companyId) : [];
  const companyActivities = useMemo(() => {
    if (!user?.companyId) return [];
    const companyEntityIds = allEntities.map((e) => e.id);
    return activities
      .filter((a) => companyEntityIds.includes(a.entityId))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);
  }, [activities, allEntities, user?.companyId]);

  if (!company) return null;

  const moduleIcons: Record<string, any> = {
    vendors: Package,
    quotes: FileText,
    invoices: DollarSign,
    borrowers: Users,
    loans: Briefcase,
    customers: Users,
    jobs: ClipboardList,
    contacts: Users,
    policies: ClipboardList,
  };

  // Calculate metrics based on time context
  const getMetrics = () => {
    const now = new Date();
    const today = new Date(now.setHours(0, 0, 0, 0));
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    const getDateFilter = () => {
      switch (timeContext) {
        case 'today':
          return (date: string) => new Date(date) >= today;
        case 'week':
          return (date: string) => new Date(date) >= weekAgo;
        case 'month':
          return (date: string) => new Date(date) >= monthAgo;
        default:
          return () => true;
      }
    };

    const dateFilter = getDateFilter();

    const metrics = company.enabledModules.map((module) => {
      const templateName = module.charAt(0).toUpperCase() + module.slice(1);
      const moduleEntities = allEntities.filter((e) => e.templateName === templateName);
      const totalCount = moduleEntities.length;
      const contextCount = moduleEntities.filter((e) => dateFilter(e.createdAt)).length;

      // Calculate specific metrics based on module type
      let actionableCount = 0;
      let actionableLabel = '';

      if (module === 'quotes') {
        actionableCount = moduleEntities.filter(
          (e) => e.status === 'sent' && e.data?.validUntil
        ).length;
        actionableLabel = 'Need Action';
      } else if (module === 'invoices') {
        actionableCount = moduleEntities.filter(
          (e) => e.status === 'pending' || (e.data?.dueDate && new Date(e.data.dueDate) < now)
        ).length;
        actionableLabel = 'Overdue';
      } else if (module === 'loans') {
        actionableCount = moduleEntities.filter((e) => {
          if (!e.data?.maturityDate) return false;
          const maturityDate = new Date(e.data.maturityDate);
          const daysUntilMaturity = Math.ceil((maturityDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          return daysUntilMaturity <= 90 && daysUntilMaturity > 0;
        }).length;
        actionableLabel = 'Nearing Maturity';
      } else if (module === 'jobs') {
        actionableCount = moduleEntities.filter(
          (e) => e.status === 'scheduled' && e.data?.scheduledDate
        ).length;
        actionableLabel = 'Scheduled Today';
      }

      return {
        module,
        templateName,
        totalCount,
        contextCount,
        actionableCount,
        actionableLabel,
        icon: moduleIcons[module] || FileText,
        trend: contextCount > 0 ? ('up' as const) : ('neutral' as const),
      };
    });

    return metrics;
  };

  const metrics = getMetrics();

  // Get priority alerts (high signal only)
  const priorityAlerts = useMemo(() => {
    return alerts
      .filter((alert) => alert.type === 'error' || alert.type === 'warning')
      .slice(0, 5);
  }, [alerts]);

  // Generate contextual greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

    // Find actionable items for greeting
    const quotesNeedingAction = metrics.find((m) => m.module === 'quotes')?.actionableCount || 0;
    const overdueInvoices = metrics.find((m) => m.module === 'invoices')?.actionableCount || 0;
    const loansMaturity = metrics.find((m) => m.module === 'loans')?.actionableCount || 0;

    if (quotesNeedingAction > 0) {
      return `${greeting}, ${user?.name}. ${quotesNeedingAction} ${quotesNeedingAction === 1 ? 'quote needs' : 'quotes need'} action ${timeContext === 'today' ? 'today' : `this ${timeContext}`}.`;
    }
    if (overdueInvoices > 0) {
      return `${greeting}, ${user?.name}. ${overdueInvoices} ${overdueInvoices === 1 ? 'invoice is' : 'invoices are'} overdue.`;
    }
    if (loansMaturity > 0) {
      return `${greeting}, ${user?.name}. ${loansMaturity} ${loansMaturity === 1 ? 'loan is' : 'loans are'} approaching maturity.`;
    }

    return `${greeting}, ${user?.name}.`;
  };

  // Mock AI insights (in real app, these would come from an AI service)
  const aiInsights = useMemo(() => {
    const insights = [];
    const overdueInvoices = metrics.find((m) => m.module === 'invoices')?.actionableCount || 0;
    if (overdueInvoices > 0) {
      insights.push({
        id: 'insight-1',
        type: 'prediction',
        message: `These ${overdueInvoices} invoices are likely to remain overdue based on payment history patterns.`,
        action: 'Review Payment Terms',
        entityType: 'invoices',
      });
    }

    const quotes = allEntities.filter((e) => e.templateName === 'Quotes');
    if (quotes.length > 0) {
      const avgResponseTime = 3; // Mock data
      insights.push({
        id: 'insight-2',
        type: 'trend',
        message: `Average quote response time has increased by ${avgResponseTime} days this month. Consider following up on pending quotes.`,
        action: 'View Pending Quotes',
        entityType: 'quotes',
      });
    }

    return insights.slice(0, 3);
  }, [metrics, allEntities]);

  const handleMetricClick = (module: string) => {
    navigate(`/app/apps/entities/${module}`);
  };

  const handleAlertClick = (alert: typeof alerts[0]) => {
    if (alert.entityId) {
      const entity = entities.find((e) => e.id === alert.entityId);
      if (entity) {
        navigate(`/app/apps/entities/${entity.templateName.toLowerCase()}/${entity.id}`);
      }
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <XCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'success':
        return <CheckCircle2 className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'border-danger/50 bg-danger-soft/20 text-danger';
      case 'warning':
        return 'border-warning/50 bg-warning-soft/20 text-warning';
      case 'success':
        return 'border-success/50 bg-success-soft/20 text-success';
      default:
        return 'border-primary/50 bg-primary-soft/20 text-primary';
    }
  };

  return (
    <div className="space-y-6 my-2">
      {/* Top Summary Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-main">{user?.name}</h1>
          <p className="text-text-muted mt-1">
            Here's what needs your attention {timeContext === 'today' ? 'today' : `this ${timeContext}`}
          </p>
        </div>
        <Select value={timeContext} onValueChange={(value) => setTimeContext(value as TimeContext)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.slice(0, 4).map((metric) => (
          <div key={metric.module} className="card flex items-center justify-between rounded-xl p-6 border border-border-subtle hover:shadow-glow hover:-translate-y-0.5 transition-all">
            <div>
              <div className="text-sm text-text-muted mb-2">{metric.templateName}</div>
              <div className="text-3xl font-bold text-text-main">{metric.totalCount}</div>
              {metric.actionableCount > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="destructive" className="text-xs">
                    {metric.actionableCount} {metric.actionableLabel}
                  </Badge>
                </div>
              )}
              <div className="flex items-center gap-1 mt-2 text-xs text-text-muted">
                {metric.trend === 'up' && (
                  <TrendingUp className="h-3 w-3 text-success" />
                )}
                <span>
                  {metric.contextCount} {timeContext === 'today' ? 'today' : `this ${timeContext}`}
                </span>
              </div>
            </div>
            <div>
              <metric.icon className="h-8 w-8 text-primary opacity-80" />
            </div>

          </div>
        ))}
      </div>


      <Card className="glass-morphism">
        <CardContent className="space-y-4">
          <BarChart data={metricsToChartData(metrics)} series={metricsSeries} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Priority Alerts and Risks */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              Priority Alerts
            </CardTitle>
            <CardDescription>High-signal alerts requiring your attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {priorityAlerts.length === 0 ? (
              <div className="text-center py-8 text-text-muted">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-success opacity-50" />
                <p>No priority alerts at this time</p>
              </div>
            ) : (
              priorityAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={cn(
                    'p-4 rounded-lg border flex items-start justify-between gap-4 cursor-pointer hover:shadow-md transition-all',
                    getAlertColor(alert.type)
                  )}
                  onClick={() => handleAlertClick(alert)}
                >
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-0.5">{getAlertIcon(alert.type)}</div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{alert.message}</p>
                      {alert.entityName && (
                        <p className="text-xs opacity-75 mt-1">{alert.entityName}</p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAlertClick(alert);
                    }}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {company.enabledModules.slice(0, 3).map((module) => {
              const templateName = module.charAt(0).toUpperCase() + module.slice(1);
              return (
                <Button
                  key={module}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate(`/app/apps/entities/${module}/new`)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New {templateName.slice(0, -1)}
                </Button>
              );
            })}
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate('/app/apps/ai/extraction')}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Document
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate('/app/apps/ai/create')}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              AI Create Record
            </Button>
          </CardContent>
        </Card>
      </div>




      {/* AI Insights Panel */}
      {aiInsights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              AI Insights
            </CardTitle>
            <CardDescription>Contextual insights and recommendations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {aiInsights.map((insight) => (
              <div
                key={insight.id}
                className="p-4 rounded-lg border border-primary/20 bg-primary-soft/10 hover:bg-primary-soft/20 transition-colors cursor-pointer"
                onClick={() => handleMetricClick(insight.entityType)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm text-text-main mb-2">{insight.message}</p>
                    <Button
                      variant="link"
                      size="sm"
                      className="p-0 h-auto text-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMetricClick(insight.entityType);
                      }}
                    >
                      {insight.action}
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Feed */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-text-muted" />
              Recent Activity
            </CardTitle>
            <CardDescription>Human-readable audit trail</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {companyActivities.length === 0 ? (
                <div className="text-center py-8 text-text-muted">
                  <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No recent activity</p>
                </div>
              ) : (
                companyActivities.map((activity) => {
                  const entity = allEntities.find((e) => e.id === activity.entityId);
                  const timeAgo = new Date(activity.timestamp);
                  const now = new Date();
                  const diffMs = now.getTime() - timeAgo.getTime();
                  const diffMins = Math.floor(diffMs / 60000);
                  const diffHours = Math.floor(diffMs / 3600000);
                  const diffDays = Math.floor(diffMs / 86400000);

                  let timeText = '';
                  if (diffMins < 60) {
                    timeText = `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
                  } else if (diffHours < 24) {
                    timeText = `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
                  } else {
                    timeText = `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
                  }

                  return (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-border-muted/50 transition-colors cursor-pointer"
                      onClick={() => {
                        if (entity) {
                          navigate(`/app/apps/entities/${entity.templateName.toLowerCase()}/${entity.id}`);
                        }
                      }}
                    >
                      <div className="w-8 h-8 rounded-full bg-primary-soft flex items-center justify-center text-primary text-xs font-semibold shrink-0">
                        {activity.userName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-text-main">
                          <span className="font-semibold">{activity.userName}</span>{' '}
                          {activity.action}
                          {entity && (
                            <span className="text-text-muted"> on {entity.name}</span>
                          )}
                        </p>
                        <p className="text-xs text-text-muted mt-1">{timeText}</p>
                      </div>
                      {entity && (
                        <ChevronRight className="w-4 h-4 text-text-muted shrink-0" />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Optional Admin Section */}
        {user?.role === 'company_admin' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-text-muted" />
                Admin Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-text-muted">Modules Active</span>
                  <Badge variant="secondary">{company.enabledModules.length}</Badge>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-text-muted">Total Records</span>
                  <Badge variant="secondary">{company.recordCount}</Badge>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-text-muted">Team Members</span>
                  <Badge variant="secondary">{company.userCount}</Badge>
                </div>
              </div>
              <div className="pt-4 border-t border-border-subtle space-y-2">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Invite Users
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Usage
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
