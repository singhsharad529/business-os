import { LogOut, User, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

export function Navbar() {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className="bg-surface h-12 flex items-center px-4 sticky top-0 z-40">
      <div className="flex-1" />

      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 hover:bg-bg px-2 py-1.5 rounded-md transition-colors"
          >
            <div className="w-7 h-7 bg-primary-soft rounded-full flex items-center justify-center text-primary font-medium text-xs">
              {user?.avatar || user?.name?.charAt(0)}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-medium text-text-main">{user?.name}</div>
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
              <div className="absolute right-0 mt-1 w-48 bg-surface rounded-lg shadow-xl py-1 z-20">
                <div className="px-3 py-2 bg-bg">
                  <div className="text-xs font-medium text-text-main">{user?.name}</div>
                  <div className="text-[10px] text-text-muted">{user?.email}</div>
                </div>
                <button className="w-full px-3 py-1.5 text-left text-xs text-text-main hover:bg-bg flex items-center gap-2 transition-colors">
                  <User className="w-3.5 h-3.5" />
                  Profile
                </button>
                <button className="w-full px-3 py-1.5 text-left text-xs text-text-main hover:bg-bg flex items-center gap-2 transition-colors">
                  <Settings className="w-3.5 h-3.5" />
                  Settings
                </button>
                <div className="h-px bg-bg my-1" />
                <button
                  onClick={logout}
                  className="w-full px-3 py-1.5 text-left text-xs text-danger hover:bg-danger-soft flex items-center gap-2 transition-colors"
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
