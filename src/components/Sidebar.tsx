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
      className={`bg-white/80 backdrop-blur-xl min-h-screen fixed top-0 left-0 flex flex-col transition-all duration-300 border-r border-border-subtle shadow-soft
      overflow-hidden ${collapsed ? "w-0" : "w-60"}`}
    >
      {!collapsed && (
        <div className="px-4 py-3">
          <Logo size="sm" />
        </div>
      )}

      <nav className="flex-1 p-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.label}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 px-3.5 py-2.5 my-1.5 rounded-lg text-sm font-semibold transition-all duration-200 border border-transparent
                      ${isActive
                      ? "bg-gradient-to-r from-primary/15 to-accent/10 text-primary shadow-glow border-primary/30"
                      : "text-text-muted hover:text-text-main hover:bg-white hover:border-border-subtle hover:shadow-soft"
                    }`
                  }
                >
                  <Icon className="w-4 h-4 transition-colors group-hover:text-primary" />

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
