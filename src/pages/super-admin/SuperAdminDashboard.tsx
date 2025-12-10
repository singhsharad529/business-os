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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-main">Super Admin Dashboard</h1>
        <p className="text-text-muted mt-1">Overview of all companies and platform usage</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`${stat.bgColor} ${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <Icon size={24} />
                </div>
              </div>
              <div className="text-3xl font-bold text-text-main mb-1">{stat.value}</div>
              <div className="text-sm text-text-muted">{stat.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-text-main mb-4">Company Status</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-bg rounded-lg">
              <span className="text-text-main font-medium">Active Companies</span>
              <span className="badge badge-success">{activeCompanies.length}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-bg rounded-lg">
              <span className="text-text-main font-medium">Inactive Companies</span>
              <span className="badge">{companies.length - activeCompanies.length}</span>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-text-main mb-4">Recent Companies</h2>
          <div className="space-y-3">
            {recentCompanies.map((company) => (
              <div key={company.id} className="flex items-center justify-between p-3 bg-bg rounded-lg">
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
