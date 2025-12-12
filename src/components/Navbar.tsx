import { LogOut, PanelLeft, User, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

export function Navbar({ setCollapsed }: { setCollapsed: React.Dispatch<React.SetStateAction<boolean>> }) {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-border-subtle h-16 flex items-center px-5 sticky top-0 z-40 shadow-soft">


      <div className="flex justify-between w-full items-center gap-3">
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="p-2.5 rounded-lg hover:bg-primary-soft/60 transition-all shadow-sm hover:-translate-y-0.5"
        >
          <PanelLeft className="w-5 h-5" />
        </button>
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 hover:bg-primary-soft/50 px-2.5 py-1.5 rounded-lg transition-all shadow-sm"
          >
            <div className="w-9 h-9 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white font-semibold text-xs shadow-glow">
              {user?.avatar || user?.name?.charAt(0)}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-semibold text-text-main">{user?.name}</div>
              <div className="text-[10px] text-text-muted capitalize">
                {user?.role.replace('_', ' ')}
              </div>
            </div>
          </button>

          {showDropdown && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowDropdown(false)}
              />
              <div className="absolute right-0 w-52 bg-white/95 rounded-xl shadow-card border border-border-subtle py-1 z-20 backdrop-blur">
                <div className="px-3 py-3 bg-bg/80 rounded-t-xl border-b border-border-subtle">
                  <div className="text-sm font-semibold text-text-main">{user?.name}</div>
                  <div className="text-[11px] text-text-muted">{user?.email}</div>
                </div>
                <button className="w-full px-3 py-2 text-left text-xs text-text-main hover:bg-primary-soft/50 flex items-center gap-2 transition-colors">
                  <User className="w-3.5 h-3.5" />
                  Profile
                </button>
                <button className="w-full px-3 py-2 text-left text-xs text-text-main hover:bg-primary-soft/50 flex items-center gap-2 transition-colors">
                  <Settings className="w-3.5 h-3.5" />
                  Settings
                </button>
                <div className="h-px bg-bg my-1" />
                <button
                  onClick={logout}
                  className="w-full px-3 py-2 text-left text-xs text-danger hover:bg-danger-soft flex items-center gap-2 transition-colors rounded-b-xl"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
