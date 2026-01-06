import {
  Home,
  Mic,
  Grid3x3,
  Settings,
  LayoutDashboard,
  Activity,
  Workflow,
  PhoneCall,
  FileText,
  Building2,
  Users,
  Package,
  DollarSign,
  Briefcase,
  ClipboardList,
  FileSearch,
  Sparkles,
  Search,
  BarChart3,
  FileSpreadsheet,
  Download,
  ToggleLeft,
  Layers,
  Zap,
  UserCog,
  Shield,
  CreditCard,
  LucideIcon
} from "lucide-react";


export interface NavigationChild {
  id: string;
  label: string;
  route?: string;
  roles?: string[];
  children?: NavigationChild[];
}

export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  route?: string;
  roles?: string[];
  children?: NavigationChild[];
}

export interface NavigationConfig {
  navigation: {
    main: NavigationItem[];
    super_admin?: NavigationItem[];
  };
}

// Icon mapping
export const iconMap: Record<string, LucideIcon> = {
  home: Home,
  mic: Mic,
  grid: Grid3x3,
  settings: Settings,
  dashboard: LayoutDashboard,
  activity: Activity,
  workflow: Workflow,
  phone: PhoneCall,
  file: FileText,
  building: Building2,
  users: Users,
  package: Package,
  dollar: DollarSign,
  briefcase: Briefcase,
  clipboard: ClipboardList,
  search: FileSearch,
  sparkles: Sparkles,
  ai_search: Search,
  chart: BarChart3,
  spreadsheet: FileSpreadsheet,
  download: Download,
  toggle: ToggleLeft,
  layers: Layers,
  zap: Zap,
  user_cog: UserCog,
  shield: Shield,
  credit_card: CreditCard,
};

// Navigation configuration
export const navigationConfig: NavigationConfig = {
  navigation: {
    main: [
      {
        id: "home",
        label: "Home",
        icon: "home",
        route: "/app/company/dashboard",
        roles: ["company_admin", "standard_user"],
        children: [
          {
            id: "dashboard",
            label: "Dashboard",
            route: "/app/company/dashboard"
          }
        ]
      },
      {
        id: "voice_bot",
        label: "Voice Bot",
        icon: "mic",
        route: "/app/voicebot/dashboard",
        roles: ["company_admin", "standard_user"],
        children: [
          {
            id: "voice_overview",
            label: "Overview",
            route: "/app/voicebot/dashboard"
          },
          {
            id: "voice_calls",
            label: "Calls",
            route: "/app/voicebot/calls"
          },
          // {
          //   id: "voice_crm",
          //   label: "CRM",
          //   route: "/app/voicebot/crm"
          // },
          // {
          //   id: "insights",
          //   label: "Insights",
          //   route: "/app/voicebot/insights"
          // },
          {
            id: "leads_database",
            label: "Leads Database",
            route: "/app/voicebot/leads-database"
          },
          {
            id: "campaigns",
            label: "Campaigns",
            route: "/app/voicebot/campaigns"
          },
        ]
      },
      {
        id: "apps",
        label: "Apps",
        icon: "grid",
        route: "/app/apps/entities/contacts",
        roles: ["company_admin", "standard_user"],
        children: [

          {
            id: "contacts",
            label: "Contacts",
            route: "/app/apps/entities/contacts"
          },
          {
            id: "quotes",
            label: "Quotes",
            route: "/app/apps/entities/quotes"
          },
          {
            id: "loans",
            label: "Loans",
            route: "/app/apps/entities/loans"
          },
          {
            id: "invoices",
            label: "Invoices",
            route: "/app/apps/entities/invoices"
          },
          {
            id: "jobs",
            label: "Jobs / Work Orders",
            route: "/app/apps/entities/jobs"
          },
          {
            id: "ai_tools",
            label: "AI Tools",
            children: [
              {
                id: "ai_extraction",
                label: "Document Extraction",
                route: "/app/apps/ai/extraction"
              },
              {
                id: "ai_record_creation",
                label: "AI Record Creation",
                route: "/app/apps/ai/create"
              },
              {
                id: "ai_search",
                label: "AI Search",
                route: "/app/apps/ai/search"
              },
              {
                id: "ai_insights",
                label: "AI Insights",
                route: "/app/apps/ai/insights"
              }
            ]
          },
          {
            id: "reports",
            label: "Reports",
            children: [
              {
                id: "standard_reports",
                label: "Standard Reports",
                route: "/app/apps/reports"
              },
              {
                id: "exports",
                label: "Exports",
                route: "/app/apps/reports/exports"
              }
            ]
          },
          {
            id: "workflow",
            label: "Workflow Management",
            roles: ["company_admin"],
            children: [
              {
                id: "module_toggle",
                label: "Modules & Templates",
                route: "/app/apps/workflows/modules"
              },
              {
                id: "template_config",
                label: "Entity Templates",
                route: "/app/apps/workflows/templates"
              },
              {
                id: "rules",
                label: "Automation Rules",
                route: "/app/apps/workflows/rules"
              }
            ]
          }
        ]
      },
      {
        id: "company",
        label: "Company",
        icon: "building",
        route: "/app/my-company",
        roles: ["company_admin", "standard_user"],
        children: [
          {
            id: "company_overview",
            label: "Overview",
            route: "/app/my-company"
          },
        ]
      },
      // {
      //   id: "settings",
      //   label: "Settings",
      //   icon: "settings",
      //   route: "/app/voicebot/settings",
      //   roles: ["company_admin", "super_admin"],
      //   children: [
      //     {
      //       id: "company_settings",
      //       label: "Company Settings",
      //       roles: ["company_admin"],
      //       children: [
      //         {
      //           id: "company_profile",
      //           label: "Profile",
      //           route: "/app/voicebot/settings"
      //         },
      //         {
      //           id: "branding",
      //           label: "Branding",
      //           route: "/app/voicebot/settings"
      //         }
      //       ]
      //     },
      //     {
      //       id: "user_management",
      //       label: "User Management",
      //       children: [
      //         {
      //           id: "users",
      //           label: "Users",
      //           route: "/app/voicebot/settings"
      //         },
      //         {
      //           id: "roles",
      //           label: "Roles & Permissions",
      //           route: "/app/voicebot/settings"
      //         }
      //       ]
      //     },
      //     {
      //       id: "usage",
      //       label: "Usage & Billing",
      //       route: "/app/voicebot/settings"
      //     }
      //   ]
      // }
    ],
    super_admin: [
      {
        id: "admin_dashboard",
        label: "Admin Dashboard",
        icon: "dashboard",
        route: "/app/super-admin/dashboard"
      },
      {
        id: "companies",
        label: "Companies",
        icon: "building",
        route: "/app/super-admin/companies"
      },
      {
        id: "admin_modules",
        label: "Module Management",
        icon: "layers",
        route: "/app/super-admin/modules"
      },
      {
        id: "admin_ai",
        label: "AI Usage",
        icon: "sparkles",
        route: "/app/super-admin/ai-usage"
      },
      {
        id: "support",
        label: "Support Tools",
        icon: "zap",
        route: "/app/super-admin/support"
      }
    ]
  }
};

// Helper function to filter navigation by role
export function filterNavigationByRole(
  items: NavigationItem[],
  userRole: string
): NavigationItem[] {
  return items
    .filter((item) => !item.roles || item.roles.includes(userRole))
    .map((item) => {
      if (item.children) {
        return {
          ...item,
          children: filterChildrenByRole(item.children, userRole),
        };
      }
      return item;
    });
}

function filterChildrenByRole(
  children: NavigationChild[],
  userRole: string
): NavigationChild[] {
  return children
    .filter((child) => !child.roles || child.roles.includes(userRole))
    .map((child) => {
      if (child.children) {
        return {
          ...child,
          children: filterChildrenByRole(child.children, userRole),
        };
      }
      return child;
    });
}

