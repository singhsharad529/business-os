import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Plus, Package, FileText, DollarSign, Briefcase, Users, ClipboardList } from 'lucide-react';

export function CompanyDashboard() {
  const { user } = useAuth();
  const { getCompany, getEntitiesByCompany } = useData();

  const company = user?.companyId ? getCompany(user.companyId) : null;
  const entities = user?.companyId ? getEntitiesByCompany(user.companyId) : [];

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

  const getEntityCounts = () => {
    return company.enabledModules.map((module) => {
      const templateName = module.charAt(0).toUpperCase() + module.slice(1);
      const count = entities.filter((e) => e.templateName === templateName).length;
      return {
        module,
        templateName,
        count,
        icon: moduleIcons[module] || FileText,
      };
    });
  };

  const moduleCounts = getEntityCounts();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-main">Dashboard</h1>
        <p className="text-text-muted mt-1">
          Welcome back, {user?.name}
        </p>
      </div>

      {moduleCounts.length === 0 ? (
        <div className="card p-12 text-center">
          <Package size={48} className="mx-auto text-text-muted mb-4" />
          <h3 className="text-lg font-semibold text-text-main mb-2">
            No Modules Configured
          </h3>
          <p className="text-text-muted">
            Get started by adding your first entity
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {moduleCounts.map(({ module, templateName, count, icon: Icon }) => (
            <div
              key={module}
              className="card p-6 hover:shadow-glow hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-primary-soft rounded-lg flex items-center justify-center ring-1 ring-primary/10">
                  <Icon className="text-primary" size={24} />
                </div>
                <button
                  className="btn btn-secondary p-2"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Plus size={16} />
                </button>
              </div>
              <h3 className="text-lg font-semibold text-text-main mb-2">{templateName}</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-text-main">{count}</span>
                <span className="text-sm text-text-muted">
                  {count === 1 ? templateName.slice(0, -1) : templateName}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
