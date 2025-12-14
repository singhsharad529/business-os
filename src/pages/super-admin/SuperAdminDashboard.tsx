import { Building2, Users, Database, Zap } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { mockUsers } from '../../data/mockData';

export function SuperAdminDashboard() {
  const { companies, entities } = useData();

  const stats = [
    {
      label: 'Total Companies',
      value: companies.length,
      icon: Building2,
      color: 'text-primary',
      bgColor: 'bg-primary-soft',
    },
    {
      label: 'Total Users',
      value: mockUsers.length,
      icon: Users,
      color: 'text-success',
      bgColor: 'bg-success-soft',
    },
    {
      label: 'Total Records',
      value: entities.length,
      icon: Database,
      color: 'text-warning',
      bgColor: 'bg-warning-soft',
    },
    {
      label: 'AI Calls (Month)',
      value: companies.reduce((sum, c) => sum + c.aiUsage, 0),
      icon: Zap,
      color: 'text-primary',
      bgColor: 'bg-primary-soft',
    },
  ];

  const activeCompanies = companies.filter((c) => c.status === 'active');
  const recentCompanies = [...companies].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-main">Super Admin Dashboard</h1>
        <p className="text-text-muted mt-1">Overview of all companies and platform usage</p>
      </div>

      {/* Top Section: Chart Area + Stats with Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Large Chart Area - Takes 2 columns */}
        <div className="lg:col-span-2 glass-morphism p-6 min-h-[400px] flex items-center justify-center rounded-2xl border border-white/20 backdrop-blur-xl shadow-lg">
          <div className="text-center text-text-muted">
            <p className="text-lg font-semibold mb-2">Bar Chart / Sankey Chart / Graphs</p>
            <p className="text-sm">Data Visualisations</p>
          </div>
        </div>

        {/* Stats with Actions - Right side, stacked */}
        <div className="flex flex-col gap-6">
          {stats.slice(0, 2).map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="glass-morphism p-6 bg-gradient-to-br from-primary/80 to-accent/80 text-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-2xl border border-white/20 backdrop-blur-xl"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <Icon size={24} className="text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-white/80">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Middle Section: Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.slice(2).map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="glass-morphism p-6 bg-gradient-to-br from-steel/90 to-steel-light/90 text-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-2xl border border-white/10 backdrop-blur-xl"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <Icon size={24} className="text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-white/80">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Bottom Section: Company Status and Recent Companies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-morphism p-6 rounded-2xl border border-white/20 backdrop-blur-xl shadow-lg">
          <h2 className="text-lg font-semibold text-text-main mb-4">Company Status</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-white/30 rounded-lg backdrop-blur-sm">
              <span className="text-text-main font-medium">Active Companies</span>
              <span className="badge badge-success">{activeCompanies.length}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-white/30 rounded-lg backdrop-blur-sm">
              <span className="text-text-main font-medium">Inactive Companies</span>
              <span className="badge">{companies.length - activeCompanies.length}</span>
            </div>
          </div>
        </div>

        <div className="glass-morphism p-6 rounded-2xl border border-white/20 backdrop-blur-xl shadow-lg">
          <h2 className="text-lg font-semibold text-text-main mb-4">Recent Companies</h2>
          <div className="space-y-3">
            {recentCompanies.map((company) => (
              <div key={company.id} className="flex items-center justify-between p-3 bg-white/30 rounded-lg backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-soft rounded-lg flex items-center justify-center text-primary font-semibold">
                    {company.logo}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-text-main">{company.name}</div>
                    <div className="text-xs text-text-muted capitalize">{company.industry.replace('_', ' ')}</div>
                  </div>
                </div>
                <span className={`badge ${company.status === 'active' ? 'badge-success' : ''}`}>
                  {company.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
