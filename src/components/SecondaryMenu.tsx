import { NavLink, useLocation } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { MainNavSection } from "./FloatingSidebar";

interface NavItem {
    label: string;
    icon: LucideIcon;
    to: string;
}

interface SecondaryMenuProps {
    activeSection: MainNavSection;
    navItems: NavItem[];
}

export function SecondaryMenu({ activeSection, navItems }: SecondaryMenuProps) {
    const location = useLocation();

    // Hide secondary menu when in apps launchpad view
    const isAppsLaunchpad = activeSection === 'apps' && (
        location.pathname === '/app/super-admin/dashboard' ||
        location.pathname === '/app/company/dashboard' ||
        location.pathname === '/app/apps'
    );

    if (isAppsLaunchpad) {
        return null;
    }

    return (
        <div className="absolute top-24 left-8 z-20 animate-blur-zoom-in">
            <nav className="glass-morphism p-2 rounded-xl shadow-lg border border-white/20 backdrop-blur-2xl">
                <ul className="flex flex-col gap-1 min-w-[200px]">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.to || location.pathname.startsWith(item.to + '/');
                        return (
                            <li key={item.label}>
                                <NavLink
                                    to={item.to}
                                    className={({ isActive: navIsActive }) =>
                                        `group relative flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold
                    transition-all duration-500 ease-out
                    ${navIsActive || isActive
                                            ? 'bg-white/30 text-primary shadow-lg shadow-primary/10 scale-[1.02]'
                                            : 'text-text-muted hover:text-text-main hover:bg-white/20 hover:scale-[1.01]'
                                        }
                    `
                                    }
                                >
                                    <Icon className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                                    <span className="whitespace-nowrap">{item.label}</span>

                                    {(location.pathname === item.to || location.pathname.startsWith(item.to + '/')) && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-1 h-6 bg-primary rounded-full shadow-lg shadow-primary/50" />
                                    )}
                                </NavLink>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </div>
    );
}

