import adminAgentService from '@/api/adminAgentService'
import GenericBarChart from '@/components/chart/BarChart'
import DashboardLoader from '@/components/common/DashboardLoader'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from '@/hooks/useToast'
import { AxiosRequestConfig } from 'axios'
import { Bot, Clock, PhoneCall, Target } from 'lucide-react'
import { useEffect, useState } from 'react'

type TabType = "today" | "7day" | "30day";

function CallsDashboard({ callsDashboardData, setCallsDashboardData }: { callsDashboardData: any, setCallsDashboardData: (data: any) => void }) {
    const [activeTab, setActiveTab] = useState<TabType>("today");
    const [loading, setLoading] = useState(false);

    const chartSeries = [
        {
            key: "inbound",
            label: "Calls",
            gradient: {
                start: "var(--chart-gradient-start)",
                end: "var(--chart-gradient-end)",
            },
        },
    ];

    const tabs: { id: TabType; label: string; number: number }[] = [
        { id: "today", label: "Today", number: 0 },
        { id: "7day", label: "7 Day", number: 7 },
        { id: "30day", label: "30 Day", number: 30 },
    ];


    const getDateNDaysAgo = (days: number) => {
        const d = new Date();
        d.setDate(d.getDate() - days);
        return d.toISOString().split("T")[0];
    };

    const getTodayDate = () => {
        return new Date().toISOString().split("T")[0];
    };

    const fetchCallsDashboardData = async (startDate: string, n = 0) => {
        const endDate = getDateNDaysAgo(n);

        try {
            setLoading(true);
            const config: AxiosRequestConfig = {
                params: {
                    startDate: startDate,
                    endDate: endDate,
                }
            }
            const response = await adminAgentService.getCallsDashboardData(config);
            setCallsDashboardData(response);
        } catch (error) {
            console.error("Error fetching calls dashboard data:", error);
            toast.danger("Failed to fetch calls dashboard data");
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!callsDashboardData) {
            const today = getTodayDate();
            fetchCallsDashboardData(today, 0);
        }
    }, []);

    // Format number with commas
    const formatNumber = (num: number): string => {
        return num.toLocaleString();
    };

    // Get trend color based on change type
    const getTrendColor = (changeType: string): string => {
        switch (changeType) {
            case "positive":
                return "text-success";
            case "negative":
                return "text-danger";
            default:
                return "text-text-muted";
        }
    };

    // Transform chart data from API response
    const getChartData = () => {
        if (!callsDashboardData?.hourlyActivity?.data) {
            return [];
        }
        return callsDashboardData.hourlyActivity.data.map((item: any) => ({
            label: item.label,
            inbound: item.count
        }));
    };

    // Get KPI stats from API response
    const getKPIStats = () => {
        if (!callsDashboardData?.kpis) {
            return [];
        }

        const kpis = callsDashboardData.kpis;

        return [
            {
                label: "Total Calls",
                value: formatNumber(kpis.totalCalls?.value || 0),
                icon: PhoneCall,
                trend: kpis.totalCalls?.change || "",
                trendColor: getTrendColor(kpis.totalCalls?.changeType || "neutral"),
                iconColor: "bg-primary/10 text-primary"
            },
            {
                label: "Connected Rate",
                value: `${kpis.connectedRate?.value || 0}${kpis.connectedRate?.unit || "%"}`,
                icon: Target,
                trend: kpis.connectedRate?.change || kpis.connectedRate?.label || "",
                trendColor: getTrendColor(kpis.connectedRate?.changeType || "neutral"),
                iconColor: "bg-success/10 text-success"
            },
            {
                label: "Avg Duration",
                value: kpis.avgDuration?.value || "0m 0s",
                icon: Clock,
                trend: kpis.avgDuration?.status || "",
                trendColor: "text-text-muted",
                iconColor: "bg-warning/10 text-warning"
            },
            {
                label: "Active Agents",
                value: formatNumber(kpis.totalActiveAgents?.value || 0),
                icon: Bot,
                trend: kpis.totalActiveAgents?.change || "",
                trendColor: getTrendColor(kpis.totalActiveAgents?.changeType || "neutral"),
                iconColor: "bg-primary/10 text-primary"
            },
        ];
    };

    const kpiStats = getKPIStats();
    const chartData = getChartData();

    return (
        <div>
            <div className="flex items-center justify-end my-2">
                <div className="flex gap-1 bg-surface-main/50 p-1 rounded-xl border border-border-subtle">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id);
                                fetchCallsDashboardData(getTodayDate(), tab.number);
                            }}
                            className={`px-4 py-1 rounded-lg text-[12px] font-medium transition-all duration-300 ${activeTab === tab.id
                                ? "bg-primary text-white shadow-lg"
                                : "text-text-muted hover:text-text-main hover:bg-white/5"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>
            {
                loading ? <DashboardLoader /> : (
                    <div className='space-y-6'>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {kpiStats.map((stat, index) => (
                                <div key={index} className="card rounded-xl p-6 border border-border-subtle hover:shadow-glow hover:-translate-y-0.5 transition-all">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="text-sm text-text-muted">{stat.label}</div>
                                        <div className={`p-2 rounded-lg ${stat.iconColor}`}>
                                            <stat.icon className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <div className="text-3xl font-bold text-text-main">
                                        {stat.value}
                                    </div>
                                    {stat.trend && (
                                        <div className={`text-xs mt-2 font-medium ${stat.trendColor}`}>
                                            {stat.trend}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <Card className="glass-morphism">
                            <CardContent className="space-y-4 pt-6">
                                <h4 className="text-xl font-semibold text-text-main mb-4">Calls Activity Overview</h4>
                                {chartData.length > 0 ? (
                                    <GenericBarChart
                                        data={chartData}
                                        series={chartSeries}
                                    />
                                ) : (
                                    <div className="h-[300px] flex items-center justify-center text-text-muted">
                                        No data available
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )
            }
        </div>
    )
}

export default CallsDashboard