import { useNavigate } from "react-router-dom";
import { LucideIcon, LayoutDashboard, Building2, Users, Package, FileText, DollarSign, Briefcase, ClipboardList } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import { mockCompanies } from "../data/mockData";

interface AppItem {
    label: string;
    icon: LucideIcon;
    to: string;
    color: string;
}

export function AppsLaunchpad() {
    const { user } = useAuth();
    const { getCompany } = useData();
    const navigate = useNavigate();

    const company = user?.companyId ? getCompany(user.companyId) : null;

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

    const getAppItems = (): AppItem[] => {
        const items: AppItem[] = [];

        // Dashboard item
        if (user?.role === "super_admin") {
            items.push({
                label: "Dashboard",
                icon: LayoutDashboard,
                to: "/app/super-admin/dashboard",
                color: "from-blue-500 to-cyan-500",
            });
            items.push({
                label: "Companies",
                icon: Building2,
                to: "/app/super-admin/companies",
                color: "from-purple-500 to-pink-500",
            });
        } else {
            items.push({
                label: "Dashboard",
                icon: LayoutDashboard,
                to: "/app/company/dashboard",
                color: "from-blue-500 to-cyan-500",
            });
        }

        // Entity items
        if (!company) {
            if (user?.role === "super_admin") {
                const allModules = Array.from(
                    new Set(mockCompanies.flatMap((c) => c.enabledModules))
                );

                allModules.forEach((module) => {
                    items.push({
                        label: module.charAt(0).toUpperCase() + module.slice(1),
                        icon: moduleIcons[module] || FileText,
                        to: `/app/apps/entities/${module}`,
                        color: "from-indigo-500 to-purple-500",
                    });
                });
            }
        } else {
            company.enabledModules.forEach((module) => {
                items.push({
                    label: module.charAt(0).toUpperCase() + module.slice(1),
                    icon: moduleIcons[module] || FileText,
                    to: `/app/apps/entities/${module}`,
                    color: "from-indigo-500 to-purple-500",
                });
            });
        }

        return items;
    };

    const appItems = getAppItems();

    const handleAppClick = (to: string) => {
        navigate(to);
    };

    return (
        <div className="absolute inset-0 left-0 top-0 flex items-center justify-center p-8 z-10 animate-blur-zoom-in" style={{ marginLeft: '256px', marginTop: '24px', marginRight: '24px' }}>
            <div className="glass-morphism rounded-3xl p-8 max-w-6xl w-full border border-white/20 backdrop-blur-2xl shadow-2xl">
                <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-6">
                    {appItems.map((app) => {
                        const Icon = app.icon;
                        return (
                            <button
                                key={app.label}
                                onClick={() => handleAppClick(app.to)}
                                className="group flex flex-col items-center gap-3 p-4 rounded-2xl
                  transition-all duration-500 ease-out
                  hover:scale-110 hover:bg-white/20
                  active:scale-95
                  focus:outline-none focus:ring-2 focus:ring-primary/50"
                            >
                                <div className={`
                  w-16 h-16 rounded-2xl bg-gradient-to-br ${app.color}
                  flex items-center justify-center
                  shadow-lg group-hover:shadow-xl
                  transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)
                  group-hover:scale-110 group-active:scale-95
                `}>
                                    <Icon className="w-8 h-8 text-white transition-transform duration-300 group-hover:scale-110" />
                                </div>
                                <span className="text-xs font-semibold text-text-main text-center max-w-[80px] truncate">
                                    {app.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

