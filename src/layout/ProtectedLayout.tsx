import { Outlet, Navigate, useNavigate, useLocation } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { Navbar, MainNavSection } from "../components/Navbar";
import { AIAssistant } from "../components/AIAssistant";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import { LayoutDashboard, Building2, Users, Package, FileText, DollarSign, Briefcase, ClipboardList, Settings, Plug } from "lucide-react";
import { useState, useEffect } from "react";
import { mockCompanies } from "../data/mockData";



export const ProtectedLayout = () => {
    const { user, isLoading } = useAuth();
    const [collapsed, setCollapsed] = useState<boolean>(false);
    const [activeSection, setActiveSection] = useState<MainNavSection>("voicebot");
    const { getCompany } = useData();
    const navigate = useNavigate();
    const location = useLocation();

    // Determine active section from current route
    useEffect(() => {
        const path = location.pathname;
        if (path.startsWith("/app/voicebot")) {
            setActiveSection("voicebot");
        } else if (path.startsWith("/app/apps") || path.startsWith("/app/company/entities") || path.startsWith("/app/company/dashboard") || path.startsWith("/app/super-admin")) {
            // Apps section includes entities, company dashboard, and super admin routes
            setActiveSection("apps");
        } else if (path.startsWith("/app/crm")) {
            setActiveSection("crm");
        } else {
            // Default to voicebot for any other route
            setActiveSection("voicebot");
        }
    }, [location.pathname, user]);


    // IMPORTANT FIX
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

    // THIS IS THE LINE CAUSING REDIRECT
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const company = user.companyId ? getCompany(user.companyId) : null;


    // Handle section change
    const handleSectionChange = (section: MainNavSection) => {
        setActiveSection(section);
        if (section === "voicebot") {
            navigate("/app/voicebot/dashboard");
        } else if (section === "apps") {
            if (user.role === "super_admin") {
                navigate("/app/super-admin/dashboard");
            } else {
                navigate("/app/company/dashboard");
            }
        } else if (section === "crm") {
            navigate("/app/crm/dashboard");
        }
    };

    const superAdminNavItems = [
        { label: "Dashboard", icon: LayoutDashboard, to: "/app/super-admin/dashboard" },
        { label: "Companies", icon: Building2, to: "/app/super-admin/companies" },
    ];

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

    // Voicebot sidebar items
    const getVoicebotNavItems = () => {
        return [
            { label: "Dashboard", icon: LayoutDashboard, to: "/app/voicebot/dashboard" },
            { label: "CRM", icon: Building2, to: "/app/voicebot/crm" },
            { label: "Integrations", icon: Plug, to: "/app/voicebot/integrations" },
            { label: "Settings", icon: Settings, to: "/app/voicebot/settings" },
        ];
    };

    // Apps sidebar items (entities)
    const getAppsNavItems = () => {
        if (!company) {
            if (user.role === "super_admin") {
                const allModules = Array.from(
                    new Set(
                        mockCompanies.flatMap((c) => c.enabledModules)
                    )
                );

                const entityItems = allModules.map((module) => ({
                    label: module.charAt(0).toUpperCase() + module.slice(1),
                    icon: moduleIcons[module] || FileText,
                    to: `/app/apps/entities/${module}`,
                }));

                return [...superAdminNavItems, ...entityItems];
            }

            return [
                { label: "Dashboard", icon: LayoutDashboard, to: "/app/company/dashboard" },
            ];
        }

        const entityItems = company.enabledModules.map((module) => ({
            label: module.charAt(0).toUpperCase() + module.slice(1),
            icon: moduleIcons[module] || FileText,
            to: `/app/apps/entities/${module}`,
        }));

        return [
            { label: "Dashboard", icon: LayoutDashboard, to: "/app/company/dashboard" },
            ...entityItems,
        ];
    };

    // CRM sidebar items
    const getCrmNavItems = () => {
        return [
            { label: "Dashboard", icon: LayoutDashboard, to: "/app/crm/dashboard" },
            { label: "Contacts", icon: Users, to: "/app/crm/contacts" },
            { label: "Deals", icon: Briefcase, to: "/app/crm/deals" },
        ];
    };

    // Get sidebar items based on active section
    const getSidebarNavItems = () => {
        switch (activeSection) {
            case "voicebot":
                return getVoicebotNavItems();
            case "apps":
                return getAppsNavItems();
            case "crm":
                return getCrmNavItems();
            default:
                return getVoicebotNavItems();
        }
    };

    const navItems = getSidebarNavItems();

    return (
        <div className="flex min-h-screen bg-bg">
            <Sidebar navItems={navItems} collapsed={collapsed} />

            <div
                className={`
                    flex-1
          transition-all duration-300
          ${collapsed ? "pl-0" : "pl-60"}
        `}
            >
                <Navbar
                    setCollapsed={setCollapsed}
                    activeSection={activeSection}
                    onSectionChange={handleSectionChange}
                />
                <main className="p-5">
                    <Outlet />
                </main>
            </div>

            {(user.role == "super_admin" || user.role == "company_admin") && <AIAssistant />}
        </div>
    );
};
