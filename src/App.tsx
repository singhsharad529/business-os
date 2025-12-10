import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { useData } from './contexts/DataContext';
import { Login } from './pages/Login';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { AIAssistant } from './components/AIAssistant';
import { SuperAdminDashboard } from './pages/super-admin/SuperAdminDashboard';
import { Companies } from './pages/super-admin/Companies';
import { CompanyDashboard } from './pages/company/CompanyDashboard';
import { EntityList } from './pages/company/EntityList';
import { LayoutDashboard, Building2, Users, Package, FileText, DollarSign, Briefcase, ClipboardList } from 'lucide-react';

type SuperAdminView = 'dashboard' | 'companies';
type CompanyView = 'dashboard' | 'entities';

function App() {
  const { user, isLoading } = useAuth();
  const { getCompany } = useData();
  const [superAdminView, setSuperAdminView] = useState<SuperAdminView>('dashboard');
  const [companyView, setCompanyView] = useState<CompanyView>('dashboard');
  const [selectedEntityType, setSelectedEntityType] = useState<string>('');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const company = user.companyId ? getCompany(user.companyId) : null;

  const superAdminNavItems = [
    { label: 'Dashboard', icon: LayoutDashboard, active: superAdminView === 'dashboard', onClick: () => setSuperAdminView('dashboard') },
    { label: 'Companies', icon: Building2, active: superAdminView === 'companies', onClick: () => setSuperAdminView('companies') },
  ];

  const getCompanyNavItems = () => {
    const baseItems = [
      { label: 'Dashboard', icon: LayoutDashboard, active: companyView === 'dashboard' && !selectedEntityType, onClick: () => { setCompanyView('dashboard'); setSelectedEntityType(''); } },
    ];

    if (!company) return baseItems;

    const moduleIcons: Record<string, any> = {
      contacts: Users,
      vendors: Package,
      borrowers: Users,
      customers: Users,
      quotes: FileText,
      invoices: DollarSign,
      loans: Briefcase,
      policies: ClipboardList,
      jobs: ClipboardList,
    };

    const entityItems = company.enabledModules.map((module) => ({
      label: module.charAt(0).toUpperCase() + module.slice(1),
      icon: moduleIcons[module] || FileText,
      active: selectedEntityType === module.charAt(0).toUpperCase() + module.slice(1),
      onClick: () => {
        setCompanyView('entities');
        setSelectedEntityType(module.charAt(0).toUpperCase() + module.slice(1));
      },
    }));

    return [...baseItems, ...entityItems];
  };

  const renderSuperAdminContent = () => {
    switch (superAdminView) {
      case 'dashboard':
        return <SuperAdminDashboard />;
      case 'companies':
        return <Companies />;
      default:
        return <SuperAdminDashboard />;
    }
  };

  const renderCompanyContent = () => {
    if (companyView === 'entities' && selectedEntityType) {
      return <EntityList templateName={selectedEntityType} />;
    }

    return <CompanyDashboard />;
  };

  return (
    <div className="flex min-h-screen bg-bg">
      {user.role === 'super_admin' ? (
        <Sidebar navItems={superAdminNavItems} />
      ) : (
        <Sidebar navItems={getCompanyNavItems()} />
      )}

      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-5">
          {user.role === 'super_admin' ? renderSuperAdminContent() : renderCompanyContent()}
        </main>
      </div>

      {user.role !== 'super_admin' && <AIAssistant />}
    </div>
  );
}

export default App;
