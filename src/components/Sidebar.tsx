import { LucideIcon } from 'lucide-react';
import { Logo } from './Logo';

interface NavItem {
  label: string;
  icon: LucideIcon;
  active?: boolean;
  onClick: () => void;
}

interface SidebarProps {
  navItems: NavItem[];
}

export function Sidebar({ navItems }: SidebarProps) {
  return (
    <aside className="w-56 bg-bg min-h-screen flex flex-col">
      <div className="px-4 py-3">
        <Logo size="sm" />
      </div>

      <nav className="flex-1 p-3">
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.label}>
                <button
                  onClick={item.onClick}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                    item.active
                      ? 'bg-surface text-primary shadow-sm'
                      : 'text-text-muted hover:bg-surface hover:text-text-main hover:shadow-sm'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
