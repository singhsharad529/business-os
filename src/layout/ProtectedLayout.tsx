import { Outlet, Navigate, useLocation } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { AppsLaunchpad } from "../components/AppsLaunchpad";
import { Navbar } from "../components/Navbar";
import { AIAssistant } from "../components/AIAssistant";
import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect } from "react";
import { navigationConfig } from "../config/navigationConfig";
import { Toaster } from "../components/ui/Toaster";


export const ProtectedLayout = () => {
    const { user, isLoading } = useAuth();
    const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
        const saved = localStorage.getItem('sidebarCollapsed');
        return saved ? JSON.parse(saved) : false;
    });
    // console.log('ProtectedLayout - user:', user);
    // console.log('ProtectedLayout - isLoading:', isLoading);


    useEffect(() => {
        localStorage.setItem('sidebarCollapsed', JSON.stringify(isCollapsed));
    }, [isCollapsed]);


    // Determine selected menu from current route
    useEffect(() => {
        const path = location.pathname;

        // Find matching menu item based on route
        const userRole = user?.role || "standard_user";
        const isSuperAdmin = userRole === "super_admin";
        const mainNavItems = isSuperAdmin
            ? navigationConfig.navigation.super_admin || []
            : navigationConfig.navigation.main;

        // Check each menu item and its children
        for (const menuItem of mainNavItems) {
            // Check if route matches menu item
            if (menuItem.route && path.startsWith(menuItem.route)) {
                setSelectedMenuId(menuItem.id);
                return;
            }

            // Check children
            if (menuItem.children) {
                for (const child of menuItem.children) {
                    if (child.route && path.startsWith(child.route)) {
                        setSelectedMenuId(menuItem.id);
                        return;
                    }

                    // Check nested children
                    if (child.children) {
                        for (const subChild of child.children) {
                            if (subChild.route && path.startsWith(subChild.route)) {
                                setSelectedMenuId(menuItem.id);
                                return;
                            }
                        }
                    }
                }
            }
        }

        // Default to home if no match
        if (!selectedMenuId) {
            setSelectedMenuId("home");
        }
    }, [location.pathname, user]);

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
        return <Navigate to="/login" replace />;
    }

    // Check if we're in apps launchpad view (dashboard pages only)
    const isAppsLaunchpad = selectedMenuId === "apps" && (
        location.pathname === "/app/super-admin/dashboard" ||
        location.pathname === "/app/company/dashboard" ||
        location.pathname === "/app/apps"
    );

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Background Container with bg.webp */}
            <div
                className="fixed inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: "linear-gradient(180deg,#FCE4EA 0%,#7132CA 100%)"
                }}
            >
                {/* Subtle overlay to enhance glass morphism effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-teal-50/30 via-pink-50/20 to-transparent" />
            </div>

            {/* Main Layout Container */}
            <div className="relative h-screen flex overflow-hidden">
                {/* Fixed Left Sidebar */}
                <Sidebar
                    selectedMenuId={selectedMenuId}
                    onMenuSelect={setSelectedMenuId}
                    isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed}
                />

                {/* Main Content Area - Properly spaced from sidebar (dynamic based on collapsed state) */}
                <div className="flex-1 relative h-screen transition-all duration-300 overflow-hidden" style={{ marginLeft: isCollapsed ? '80px' : '240px' }}>
                    {/* Content Container - Large rounded white container */}
                    <div className="relative z-10 h-full py-4 pr-4 overflow-hidden">
                        {/* Main Content Container - Sandan style */}
                        <div className={`
                            relative h-full
                            bg-white/45 backdrop-blur-xl
                            rounded-3xl shadow-2xl border border-white/30
                            transition-all duration-700 ease-out
                            flex flex-col overflow-hidden
                            ${isAppsLaunchpad ? 'opacity-0 pointer-events-none scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'}
                        `}>
                            {/* Top Navbar - Inside container */}
                            <div className="sticky top-0 z-30 px-6 pt-6 pb-4 bg-transparent">
                                <Navbar
                                    selectedMenuId={selectedMenuId}
                                />
                            </div>

                            {/* Apps Launchpad - Full Screen Overlay */}
                            {isAppsLaunchpad && <AppsLaunchpad />}

                            {/* Main Content Area */}
                            <main className="flex-1 overflow-y-auto px-6 pb-8 relative">
                                <Outlet />
                            </main>
                        </div>
                    </div>
                </div>

                {/* AI Assistant */}
                {/* {(user.role === "super_admin" || user.role === "company_admin") && <AIAssistant />} */}
                <AIAssistant />
                {/* Global Toaster */}
                <Toaster />
            </div>
        </div>
    );
};
