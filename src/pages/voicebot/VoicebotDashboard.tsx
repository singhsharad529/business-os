import { Card, CardContent } from "@/components/ui/card";
import BarChart from "@/components/chart/BarChart";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import voiceBotService from "@/api/voicebotService";
import DashboardLoader from "@/components/common/DashboardLoader";
import { useData } from "@/contexts/DataContext";

import axios from "axios";


export function VoicebotDashboard() {

  const { voiceBotDashboardData, setVoiceBotDashboardData } = useData();
  const [loading, setLoading] = useState<boolean>(false);

  const getDashboardData = async () => {
    if (voiceBotDashboardData && Object.keys(voiceBotDashboardData).length > 0) {
      return;
    }
    try {
      const baseURL = import.meta.env.VITE_SERVER_URL;
      setLoading(true);
      const response = await axios.get(`${baseURL}/dashboard`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("businessos_access_token")}`,
        },
      });
      setVoiceBotDashboardData(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }

  const chartSeries = [
    {
      key: "successful",
      label: "Successful",
      gradient: {
        start: "var(--chart-gradient-start)",
        end: "var(--chart-gradient-end)",
      },
    },
    {
      key: "appointment",
      label: "Appointment",
      gradient: {
        start: "var(--chart-gradient-success-start)",
        end: "var(--chart-gradient-success-end)",
      },
    },
    {
      key: "failed",
      label: "Failed",
      gradient: {
        start: "var(--chart-gradient-danger-start)",
        end: "var(--chart-gradient-danger-end)",
      },
    },
  ];

  useEffect(() => {
    getDashboardData();
  }, []);


  return (
    <div className="space-y-6 my-2">

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-text-main">Voicebot Dashboard</h1>
          <p className="text-text-muted mt-1">Welcome to your voicebot control center</p>
        </div>
        <div>
          <button
            // onClick={() => setShowCreateSheet(true)}
            className="btn btn-primary flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            New Call
          </button>
        </div>
      </div>
      {
        loading ? <DashboardLoader /> : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="card rounded-xl p-6 border border-border-subtle hover:shadow-glow hover:-translate-y-0.5 transition-all">
                <div className="text-sm text-text-muted mb-2">Total Conversations</div>
                <div className="text-3xl font-bold text-text-main">
                  {voiceBotDashboardData?.kpis?.total_conversations?.value || 0}
                </div>
                <div className="text-xs text-success mt-2">
                  {voiceBotDashboardData?.kpis?.total_conversations?.change}
                </div>
              </div>

              <div className="card rounded-xl p-6 border border-border-subtle hover:shadow-glow hover:-translate-y-0.5 transition-all">
                <div className="text-sm text-text-muted mb-2">Active Sessions</div>
                <div className="text-3xl font-bold text-text-main">
                  {voiceBotDashboardData?.kpis?.active_sessions?.value || 0}
                </div>
                <div className="text-xs text-text-muted mt-2">
                  {voiceBotDashboardData?.kpis?.active_sessions?.status}
                </div>
              </div>

              <div className="card rounded-xl p-6 border border-border-subtle hover:shadow-glow hover:-translate-y-0.5 transition-all">
                <div className="text-sm text-text-muted mb-2">Success Rate</div>
                <div className="text-3xl font-bold text-text-main">
                  {voiceBotDashboardData?.kpis?.success_rate?.value || 0}%
                </div>
                <div className="text-xs text-success mt-2">
                  {voiceBotDashboardData?.kpis?.success_rate?.change}
                </div>
              </div>

              <div className="card rounded-xl p-6 border border-border-subtle hover:shadow-glow hover:-translate-y-0.5 transition-all">
                <div className="text-sm text-text-muted mb-2">Avg Response Time</div>
                <div className="text-3xl font-bold text-text-main">
                  {voiceBotDashboardData?.kpis?.avg_response_time?.value || 0}
                  {voiceBotDashboardData?.kpis?.avg_response_time?.unit}
                </div>
                <div className="text-xs text-text-muted mt-2">
                  {voiceBotDashboardData?.kpis?.avg_response_time?.description}
                </div>
              </div>
            </div>

            <Card className="glass-morphism">
              <CardContent className="space-y-4">
                <BarChart
                  data={voiceBotDashboardData?.chart_data?.map((item: any) => ({ ...item, label: item.day })) || []}
                  series={chartSeries}
                />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card rounded-xl p-6 border border-border-subtle hover:shadow-glow hover:-translate-y-0.5 transition-all">
                <h2 className="text-lg font-semibold text-text-main mb-4">Recent Activity</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-bg/50 rounded-lg">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-text-main">New conversation started</div>
                      <div className="text-xs text-text-muted">2 minutes ago</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-bg/50 rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-text-main">Integration updated</div>
                      <div className="text-xs text-text-muted">15 minutes ago</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-bg/50 rounded-lg">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-text-main">Settings changed</div>
                      <div className="text-xs text-text-muted">1 hour ago</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card rounded-xl p-6 border border-border-subtle hover:shadow-glow hover:-translate-y-0.5 transition-all">
                <h2 className="text-lg font-semibold text-text-main mb-4">Quick Actions</h2>
                <div className="space-y-2">
                  <button className="w-full text-left px-4 py-3 bg-primary-soft/30 hover:bg-primary-soft/50 rounded-lg transition-colors text-sm font-medium text-text-main">
                    Start New Conversation
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-primary-soft/30 hover:bg-primary-soft/50 rounded-lg transition-colors text-sm font-medium text-text-main">
                    Configure Voice Settings
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-primary-soft/30 hover:bg-primary-soft/50 rounded-lg transition-colors text-sm font-medium text-text-main">
                    View Analytics
                  </button>
                </div>
              </div>
            </div>
          </>

        )
      }
    </div>
  );
}

