import GenericBarChart from "@/components/chart/BarChart";
import CallsDashboard from "@/components/super-admin/voicebot/CallsDashboard";
import RevenueDashboard from "@/components/super-admin/voicebot/RevenueDashboard";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Target, Briefcase, PhoneCall } from "lucide-react";
import { useState } from "react";


export function SuperAdminDashboard() {


  const [activeTab, setActiveTab] = useState<"calls" | "revenue">("calls");
  const [view, setView] = useState<"calls" | "revenue">("calls");

  const [revenueDashboardData, setRevenueDashboardData] = useState<any>(null);
  const [callsDashboardData, setCallsDashboardData] = useState<any>(null);




  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-text-main">Admin Dashboard</h1>
          <p className="text-text-muted mt-1">Welcome to your admin control center</p>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center justify-between border-b border-border-subtle">
        <div className="flex gap-8">
          <button
            onClick={() => {
              setActiveTab("calls");
              setView("calls");

            }}
            className={`pb-2 text-sm font-bold transition-all relative ${activeTab === 'calls' ? 'text-primary' : 'text-text-muted hover:text-text-main'}`}
          >
            Calls Dashboard
            {activeTab === 'calls' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />
            )}
          </button>
          <button
            onClick={() => {
              setActiveTab("revenue");

            }}
            className={`pb-2 text-sm font-bold transition-all relative ${activeTab === 'revenue' ? 'text-primary' : 'text-text-muted hover:text-text-main'}`}
          >
            Revenue & Clients
            {activeTab === 'revenue' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />
            )}
          </button>
        </div>
      </div>

      {activeTab === 'calls' && (
        <CallsDashboard
          callsDashboardData={callsDashboardData}
          setCallsDashboardData={setCallsDashboardData}
        />
      )}
      {activeTab === 'revenue' && (
        <RevenueDashboard
          revenueDashboardData={revenueDashboardData}
          setRevenueDashboardData={setRevenueDashboardData}
        />
      )}
    </div>
  );
}
