import { NavLink } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { Bot, Grid3x3 } from "lucide-react";

interface NavItem {
    label: string;
    icon: LucideIcon;
    to: string;
}

export type MainNavSection = 'voicebot' | 'apps' | 'crm';

interface FloatingSidebarProps {
    activeSection: MainNavSection;
    onSectionChange: (section: MainNavSection) => void;
}

export function FloatingSidebar({ activeSection, onSectionChange }: FloatingSidebarProps) {
    const mainNavItems: { id: MainNavSection; label: string; icon: typeof Bot }[] = [
        { id: 'voicebot', label: 'Voicebot', icon: Bot },
        { id: 'apps', label: 'Apps', icon: Grid3x3 },
    ];

    return (
        <div className="fixed left-8 top-1/2 -translate-y-1/2 z-30 animate-blur-zoom-in">
            <nav className="glass-morphism p-3 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-2xl">
                <ul className="flex flex-col gap-2">
                    {mainNavItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeSection === item.id;
                        return (
                            <li key={item.id}>
                                <button
                                    onClick={() => onSectionChange(item.id)}
                                    className={`
                    group relative flex items-center justify-center w-14 h-14 rounded-xl
                    transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)
                    ${isActive
                                            ? 'bg-white/30 text-primary shadow-lg shadow-primary/20 scale-110'
                                            : 'text-text-muted hover:text-text-main hover:bg-white/20 hover:scale-105'
                                        }
                  `}
                                    aria-label={item.label}
                                >
                                    <Icon className={`w-6 h-6 transition-all duration-500 ${isActive ? 'scale-110' : ''}`} />

                                    {/* Active indicator */}
                                    {isActive && (
                                        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-full shadow-lg shadow-primary/50 animate-fade-in" />
                                    )}

                                    {/* Tooltip */}
                                    <div className="absolute left-full ml-4 px-3 py-1.5 bg-black/80 backdrop-blur-sm text-white text-xs font-semibold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                                        {item.label}
                                        <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-black/80" />
                                    </div>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </div>
    );
}

