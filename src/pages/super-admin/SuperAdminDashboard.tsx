import GenericBarChart from "@/components/chart/BarChart";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Target, Briefcase, PhoneCall } from "lucide-react";


export function SuperAdminDashboard() {



  const dummyData = [
    { label: "Jan", agents: 12, leads: 40, customers: 8 },
    { label: "Feb", agents: 15, leads: 35, customers: 12 },
    { label: "Mar", agents: 18, leads: 50, customers: 15 },
    { label: "Apr", agents: 22, leads: 65, customers: 20 },
    { label: "May", agents: 25, leads: 80, customers: 25 },
    { label: "Jun", agents: 30, leads: 95, customers: 32 },
  ];

  const dummySeries = [
    {
      key: "agents",
      label: "Agents",
      gradient: {
        start: "var(--chart-gradient-start)",
        end: "var(--chart-gradient-end)",
      },
    },
    {
      key: "leads",
      label: "Leads",
      gradient: {
        start: "var(--chart-gradient-success-start)",
        end: "var(--chart-gradient-success-end)",
      },
    },
    {
      key: "customers",
      label: "Customers",
      gradient: {
        start: "var(--chart-gradient-danger-start)",
        end: "var(--chart-gradient-danger-end)",
      },
    },
  ];

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-text-main">Admin Dashboard</h1>
          <p className="text-text-muted mt-1">Welcome to your admin control center</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card rounded-xl p-6 border border-border-subtle hover:shadow-glow hover:-translate-y-0.5 transition-all">
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm text-text-muted">Accounts Provisioned</div>
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-text-main">
            142
          </div>
          <div className="text-xs text-success mt-2 font-medium">
            +18 this week
          </div>
        </div>

        <div className="card rounded-xl p-6 border border-border-subtle hover:shadow-glow hover:-translate-y-0.5 transition-all">
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm text-text-muted">Onboarded Customers</div>
            <div className="p-2 bg-success/10 rounded-lg text-success">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-text-main">
            128
          </div>
          <div className="text-xs text-success mt-2 font-medium">
            90% completion rate
          </div>
        </div>

        <div className="card rounded-xl p-6 border border-border-subtle hover:shadow-glow hover:-translate-y-0.5 transition-all">
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm text-text-muted">Pending Activations</div>
            <div className="p-2 bg-warning/10 rounded-lg text-warning">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-text-main">
            14
          </div>
          <div className="text-xs text-text-muted mt-2 font-medium">
            Awaiting first login
          </div>
        </div>

        <div className="card rounded-xl p-6 border border-border-subtle hover:shadow-glow hover:-translate-y-0.5 transition-all">
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm text-text-muted">Total Platform Calls</div>
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <PhoneCall className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-text-main">
            45.2k
          </div>
          <div className="text-xs text-success mt-2 font-medium">
            Across all agents
          </div>
        </div>
      </div>

      <Card className="glass-morphism">
        <CardContent className="space-y-4 pt-6">
          <h4 className="text-xl font-semibold text-text-main mb-4">Growth Overview</h4>
          <GenericBarChart
            data={dummyData}
            series={dummySeries}
          />
        </CardContent>
      </Card>
    </div>
  );
}
