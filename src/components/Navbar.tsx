import { LogOut, PanelLeft, User, Settings, Bot, Grid3x3, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

export type MainNavSection = 'voicebot' | 'apps' | 'crm';

interface NavbarProps {
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  activeSection: MainNavSection;
  onSectionChange: (section: MainNavSection) => void;
}

export function Navbar({ setCollapsed, activeSection, onSectionChange }: NavbarProps) {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const mainNavItems: { id: MainNavSection; label: string; icon: typeof Bot }[] = [
    { id: 'voicebot', label: 'Voicebot', icon: Bot },
    { id: 'apps', label: 'Apps', icon: Grid3x3 },
  ];

  return (
    <div className="sticky top-0 z-20 px-4 pt-4 pb-2 bg-bg/80 backdrop-blur-sm ">
      <nav className="bg-white/90 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-xl shadow-black/5 h-14 flex items-center px-6 mx-auto max-w-[calc(100%-2rem)]">
        <div className="flex justify-between w-full items-center gap-4">
          {/* Left Section: Sidebar Toggle + Navigation */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCollapsed((prev) => !prev)}
              className="p-2 rounded-xl hover:bg-primary-soft/40 transition-all duration-200 hover:scale-105 active:scale-95"
              aria-label="Toggle sidebar"
            >
              <PanelLeft className="w-5 h-5 text-text-main" />
            </button>

            {/* Main Navigation Tabs - Modern Design */}
            <div className="flex items-center gap-2 bg-gradient-to-br from-bg/60 to-bg/40 backdrop-blur-sm rounded-md p-1 border border-white/30 shadow-inner">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSectionChange(item.id)}
                    className={`
                      relative flex items-center gap-2.5 px-5 py-1.5 rounded-md text-sm font-semibold transition-all duration-300
                      ${isActive
                        ? 'bg-white text-primary shadow-lg shadow-primary/10 scale-[1.02]'
                        : 'text-text-muted hover:text-text-main hover:bg-white/60'
                      }
                    `}
                  >
                    <Icon className={`w-4 h-4 transition-transform ${isActive ? 'scale-110' : ''}`} />
                    <span className="whitespace-nowrap">{item.label}</span>
                    {isActive && (
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Section: User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 hover:bg-primary-soft/30 px-3 py-1 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 group"
            >
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-primary via-primary to-accent rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-primary/30 ring-2 ring-white/50">
                  {user?.avatar || user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-white shadow-sm"></div>
              </div>
              <div className="text-left hidden md:block">
                <div className="text-xs font-semibold text-text-main leading-tight">{user?.name}</div>
                <div className="text-xs text-text-muted capitalize leading-tight">
                  {user?.role.replace('_', ' ')}
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-text-muted transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowDropdown(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-white/100 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/10 border border-white/20 py-2 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* User Info Header */}
                  <div className="px-4 py-3 bg-gradient-to-br from-primary-soft/20 to-accent-soft/20 border-b border-border-subtle/50">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                        {user?.avatar || user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-text-main truncate">{user?.name}</div>
                        <div className="text-xs text-text-muted truncate">{user?.email}</div>
                        <div className="text-[10px] text-text-muted capitalize mt-0.5">
                          {user?.role.replace('_', ' ')}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <button className="w-full px-4 py-2.5 text-left text-sm text-text-main hover:bg-primary-soft/30 flex items-center gap-3 transition-colors duration-150">
                      <User className="w-4 h-4 text-text-muted" />
                      <span>Profile Settings</span>
                    </button>
                    <button className="w-full px-4 py-2.5 text-left text-sm text-text-main hover:bg-primary-soft/30 flex items-center gap-3 transition-colors duration-150">
                      <Settings className="w-4 h-4 text-text-muted" />
                      <span>Preferences</span>
                    </button>
                    <div className="h-px bg-border-subtle/50 my-1 mx-2" />
                    <button
                      onClick={() => {
                        logout();
                        setShowDropdown(false);
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm text-danger hover:bg-danger-soft/30 flex items-center gap-3 transition-colors duration-150 rounded-b-2xl"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}