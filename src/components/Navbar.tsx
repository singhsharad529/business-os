import { LogOut, User, Settings, ChevronDown, Link2, ChevronLeft, ChevronRight, CreditCard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useRef, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { navigationConfig, NavigationChild } from '../config/navigationConfig';

interface NavbarProps {
  selectedMenuId: string | null;
}

const SCROLL_AMOUNT = 200;
const NAV_ITEMS_LIMIT = 5;

export function Navbar({ selectedMenuId }: NavbarProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();

  // Get children menu items for selected parent
  const getChildrenMenuItems = (): NavigationChild[] => {
    if (!selectedMenuId) return [];

    const userRole = user?.role || "standard_user";
    const isSuperAdmin = userRole === "super_admin";

    const mainNavItems = isSuperAdmin
      ? navigationConfig.navigation.super_admin || []
      : navigationConfig.navigation.main;

    const selectedMenu = mainNavItems.find((item) => item.id === selectedMenuId);
    return selectedMenu?.children || [];
  };

  const childrenItems = getChildrenMenuItems();

  const renderChildItem = (child: NavigationChild): JSX.Element[] => {
    const items: JSX.Element[] = [];

    if (child.children && child.children.length > 0) {
      // This is a parent with children - render all children
      child.children.forEach((subChild) => {
        if (subChild.route) {
          const isActive = location.pathname === subChild.route || location.pathname.startsWith(subChild.route + '/');
          items.push(
            <NavLink
              key={subChild.id}
              to={subChild.route}
              className={({ isActive: navIsActive }) =>
                `flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap
                ${navIsActive || isActive
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-text-muted hover:text-text-main hover:bg-white/50"
                }
              `}
            >
              <Link2 className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{subChild.label}</span>
            </NavLink>
          );
        }
      });
    } else if (child.route) {
      // Direct child item
      const isActive = location.pathname === child.route || location.pathname.startsWith(child.route + '/');
      items.push(
        <NavLink
          key={child.id}
          to={child.route}
          className={({ isActive: navIsActive }) =>
            `flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap
            ${navIsActive || isActive
              ? "bg-primary/10 text-primary border border-primary/20"
              : "text-text-muted hover:text-text-main hover:bg-white/50"
            }
          `}
        >
          <Link2 className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{child.label}</span>
        </NavLink>
      );
    }

    return items;
  };


  const renderedItemsCount = childrenItems.reduce((count, child) => {
    const rendered = renderChildItem(child);
    return count + rendered.length;
  }, 0);

  const showNavButtons = renderedItemsCount > NAV_ITEMS_LIMIT;

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({
      left: -SCROLL_AMOUNT,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({
      left: SCROLL_AMOUNT,
      behavior: "smooth",
    });
  };

  return (
    <div className="w-full">
      <nav className="glass-morphism h-16 flex items-center px-6 rounded-2xl shadow-lg border border-white/20 backdrop-blur-2xl">
        <div className="flex justify-between w-full items-center gap-4">
          {/* Left Section: Children Menu Items */}
          <div>
            {
              showNavButtons && (
                <button
                  onClick={scrollLeft}
                  className="flex items-center justify-center h-8 w-8 rounded-md border border-slate-200 bg-white hover:bg-slate-50 transition"
                  aria-label="Scroll left"
                >
                  <ChevronLeft size={18} />
                </button>
              )
            }
          </div>

          {/* Scrollable Menu */}
          <div
            ref={scrollRef}
            className="flex items-center gap-2 flex-1 overflow-x-auto w-80 scrollbar-hide"
          >
            {childrenItems.flatMap((child) => renderChildItem(child))}
          </div>

          <div>
            {
              showNavButtons && (
                <button
                  onClick={scrollRight}
                  className="flex items-center justify-center h-8 w-8 rounded-md border border-slate-200 bg-white hover:bg-slate-50 transition"
                  aria-label="Scroll right"
                >
                  <ChevronRight size={18} />
                </button>

              )
            }
          </div>



          {/* Right Section: User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 hover:bg-white/20 px-3 py-1.5 rounded-xl transition-all duration-500 ease-out hover:scale-105 active:scale-95 group"
            >
              <div className="relative">
                <div className="w-9 h-9 bg-gradient-to-br from-primary-strong via-primary to-accent rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-primary/30 ring-2 ring-white/50">
                  {/* {user?.avatar || user?.name?.charAt(0).toUpperCase()} */}
                  {"JD"}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-white shadow-sm"></div>
              </div>
              <div className="text-left hidden md:block">
                <div className="text-xs font-semibold text-text-main leading-tight">{user?.name ? user?.name : 'John Doe'}</div>
                <div className="text-xs text-text-muted capitalize leading-tight">
                  {user?.role ? user?.role.replace('_', ' ') : 'Company Admin'}
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-text-muted transition-transform duration-500 ease-out ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <>
                <div
                  className="fixed inset-0 z-[100]"
                  onClick={() => setShowDropdown(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-white/20 py-2 z-[110] animate-in fade-in slide-in-from-top-2 duration-500">
                  {/* User Info Header */}
                  <div className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                        {/* {user?.avatar || user?.name?.charAt(0).toUpperCase()} */}
                        JD
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-text-main truncate">{user?.name ? user?.name : 'John Doe'}</div>
                        <div className="text-xs text-text-muted truncate">{user?.email}</div>
                        <div className="text-[10px] text-text-muted capitalize mt-0.5">
                          {user?.role ? user?.role.replace('_', ' ') : 'Company Admin'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <button className="group w-full px-4 py-2.5 text-left text-sm text-text-main hover:bg-white/20 flex items-center gap-3 transition-colors duration-300 hover:text-primary"
                      onClick={() => {
                        navigate(user?.role === 'super_admin' ? '/app/super-admin/profile' : '/app/voicebot/user-profile')
                        setShowDropdown(false);
                      }}
                    >
                      <User className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors duration-300" />
                      <span>Profile Settings</span>
                    </button>
                    {
                      user?.role !== 'super_admin' && (
                        <button className="group w-full px-4 py-2.5 text-left text-sm text-text-main hover:bg-white/20 flex items-center gap-3 transition-colors duration-300 hover:text-primary"
                          onClick={() => {
                            navigate('/app/voicebot/billing')
                            setShowDropdown(false);
                          }}>
                          <CreditCard className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors duration-300" />
                          <span>Billing / Credits</span>
                        </button>
                      )
                    }

                    <div className="h-px bg-border-subtle/50 my-1 mx-2" />
                    <button
                      onClick={() => {
                        logout();
                        setShowDropdown(false);
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm text-danger hover:bg-danger-soft/30 flex items-center gap-3 transition-colors duration-300 rounded-b-2xl"
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