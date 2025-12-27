import { NavLink, useNavigate } from "react-router-dom";
import { LogOut, CreditCard, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Logo } from "./Logo";
import { useAuth } from "../contexts/AuthContext";
import { navigationConfig, iconMap, filterNavigationByRole, NavigationItem } from "../config/navigationConfig";

import { Dispatch, SetStateAction } from "react";

interface SidebarProps {
  selectedMenuId: string | null;
  onMenuSelect: (menuId: string) => void;
  onCollapseChange?: (collapsed: boolean) => void;
  isCollapsed: boolean,
  setIsCollapsed: Dispatch<SetStateAction<boolean>>
}

export function Sidebar({ selectedMenuId, onMenuSelect, onCollapseChange, isCollapsed, setIsCollapsed }: SidebarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();


  const handleToggle = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    onCollapseChange?.(newState);
  };

  // Get navigation items based on user role
  const userRole = user?.role || "standard_user";
  const isSuperAdmin = userRole === "super_admin";

  const mainNavItems = isSuperAdmin
    ? navigationConfig.navigation.super_admin || []
    : filterNavigationByRole(navigationConfig.navigation.main, userRole);

  const handleMenuClick = (menuItem: NavigationItem) => {
    onMenuSelect(menuItem.id);

    // Navigate to first child route if no direct route, or to direct route
    if (menuItem.route) {
      navigate(menuItem.route);
    } else if (menuItem.children && menuItem.children.length > 0) {
      // Find first child with a route
      const findFirstRoute = (children: any[]): string | null => {
        for (const child of children) {
          if (child.route) return child.route;
          if (child.children) {
            const route = findFirstRoute(child.children);
            if (route) return route;
          }
        }
        return null;
      };
      const firstRoute = findFirstRoute(menuItem.children);
      if (firstRoute) {
        navigate(firstRoute);
      }
    }
  };

  const isMenuActive = (menuId: string) => selectedMenuId === menuId;

  return (
    <aside className={`fixed left-0 top-0 h-screen z-30 flex flex-col justify-between transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-60'}`}>
      {/* Top Section: Logo and Collapse Toggle */}
      <div className="px-4 py-6 flex items-center justify-between">
        {!isCollapsed && <Logo size="sm" />}
        <button
          onClick={handleToggle}
          className="p-2 rounded-lg hover:bg-white/50 transition-colors"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="w-5 h-5 text-primary" />
          ) : (
            <PanelLeftClose className="w-5 h-5 text-primary" />
          )}
        </button>
      </div>

      {/* Middle Section: Main Navigation - Vertically Centered */}
      <nav className={`flex-1 flex flex-col justify-center overflow-y-auto ${isCollapsed ? 'px-2 py-4' : 'px-3 py-4'}`}>
        <ul className="space-y-1.5">
          {mainNavItems.map((item) => {
            const Icon = iconMap[item.icon] || iconMap.home;
            const isActive = isMenuActive(item.id);

            return (
              <li key={item.id}>
                <button
                  onClick={() => handleMenuClick(item)}
                  className={`
                    w-full group flex items-center justify-center rounded-lg text-sm font-semibold transition-all duration-200 
                    ${isCollapsed
                      ? 'px-2 py-2.5'
                      : 'gap-3 px-3.5 py-2.5'
                    }
                    ${isActive
                      ? "bg-primary text-white shadow-glow border-primary"
                      : "text-text-muted hover:text-text-main hover:bg-white hover:border-border-subtle hover:shadow-soft"
                    }
                  `}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className={`w-4 h-4 transition-colors flex-shrink-0 ${isActive ? 'text-white' : 'group-hover:text-primary'}`} />
                  {!isCollapsed && <span className="flex-1 text-left">{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Section: Billing, Logout, User Profile */}
      <div className={` space-y-1 ${isCollapsed ? 'px-2 py-4 items-center' : 'px-3 py-4'}`}>
        <NavLink
          to="/app/billing"
          className={({ isActive }) =>
            `group flex items-center rounded-lg text-sm font-semibold transition-all duration-200 border border-transparent
            ${isCollapsed
              ? 'px-2 py-2.5 justify-center'
              : 'gap-3 px-3.5 py-2.5'
            }
            ${isActive
              ? "bg-primary text-white shadow-glow border-primary"
              : "text-text-muted hover:text-text-main hover:bg-white hover:border-border-subtle hover:shadow-soft"
            }`
          }
          title={isCollapsed ? "Billing / Credits" : undefined}
        >
          <CreditCard className={`w-4 h-4 transition-colors flex-shrink-0 ${isCollapsed ? '' : 'group-hover:text-primary'}`} />
          {!isCollapsed && <span className="">Billing / Credits</span>}
        </NavLink>

        <div className={`flex items-center ${isCollapsed ? 'justify-center px-2 py-2.5' : 'gap-3 px-3.5 py-2.5'}`}>
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg ring-2 ring-white/50 flex-shrink-0">
            {/* {user?.avatar || user?.name?.charAt(0).toUpperCase()} */}
            {"JD"}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white truncate">{user?.name ? user?.name : 'John Doe'}</div>
              <div className="text-xs text-white truncate capitalize">
                {user?.role ? user?.role.replace('_', ' ') : 'Company Admin'}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={logout}
          className={`w-full group flex items-center justify-center rounded-lg text-sm font-semibold transition-all duration-200 border border-transparent text-text-danger text-red-600 bg-danger-soft/60 hover:bg-danger-soft/50 border-danger/40
          ${isCollapsed
              ? 'px-2 py-2.5'
              : 'gap-3 px-3.5 py-2.5'
            }`}
          title={isCollapsed ? "Logout" : undefined}
        >
          <LogOut className="w-4 h-4 transition-colors flex-shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
