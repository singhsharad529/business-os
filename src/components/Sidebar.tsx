import { NavLink } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { Logo } from "./Logo";

interface NavItem {
  label: string;
  icon: LucideIcon;
  to: string; // required for routing
}

interface SidebarProps {
  navItems: NavItem[];
  collapsed: boolean
}
export function Sidebar({ navItems, collapsed }: SidebarProps) {
  return (
    <aside
      className={`bg-bg min-h-screen fixed top-0 left-0 flex flex-col transition-all duration-300 border-r border-border 
      overflow-hidden ${collapsed ? "w-0" : "w-56"}`}
    >
      {!collapsed && (
        <div className="px-4 py-3">
          <Logo size="sm" />
        </div>
      )}

      <nav className="flex-1 p-3">
        <ul className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.label}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-all 
                      ${isActive
                      ? "bg-surface text-primary shadow-sm"
                      : "text-text-muted hover:bg-surface hover:text-text-main hover:shadow-sm"
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />

                  {/* Label hides gracefully when collapsed */}
                  <span
                    className={`whitespace-nowrap transition-all duration-200 
                      ${collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"}`}
                  >
                    {item.label}
                  </span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
