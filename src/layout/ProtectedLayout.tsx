import { Outlet, Navigate } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { Navbar } from "../components/Navbar";
import { AIAssistant } from "../components/AIAssistant";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import { LayoutDashboard, Building2, Users, Package, FileText, DollarSign, Briefcase, ClipboardList } from "lucide-react";
import { useState } from "react";

export const ProtectedLayout = () => {
    const { user, isLoading } = useAuth();
    const [collapsed, setCollapsed] = useState<boolean>(false);
    const { getCompany } = useData();

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

    const superAdminNavItems = [
        { label: "Dashboard", icon: LayoutDashboard, to: "/app/super-admin/dashboard" },
        { label: "Companies", icon: Building2, to: "/app/super-admin/companies" },
    ];

    const getCompanyNavItems = () => {
        if (!company) return [
            { label: "Dashboard", icon: LayoutDashboard, to: "/app/company/dashboard" },
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

        const entityItems = company.enabledModules.map((module) => ({
            label: module.charAt(0).toUpperCase() + module.slice(1),
            icon: moduleIcons[module] || FileText,
            to: `/app/company/entities/${module}`,
        }));

        return [
            { label: "Dashboard", icon: LayoutDashboard, to: "/app/company/dashboard" },
            ...entityItems,
        ];
    };

    const navItems = user.role === "super_admin" ? superAdminNavItems : getCompanyNavItems();

    return (
        <div className="flex min-h-screen bg-bg">

            <Sidebar navItems={navItems} collapsed={collapsed} />

            <div
                className={`
                    flex-1
          transition-all duration-300
          ${collapsed ? "pl-0" : "pl-56"}
        `}
            >
                <Navbar setCollapsed={setCollapsed} />
                <main className="p-5">
                    <Outlet />
                </main>
            </div>

            {user.role !== "super_admin" && <AIAssistant />}
        </div>
    );
};
