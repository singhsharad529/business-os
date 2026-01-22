import { DollarSign, Users, Calendar, Target } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Area,
    AreaChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Pie,
    PieChart,
    Cell,
    Line,
    LineChart,
} from "recharts"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart"
import GenericBarChart from '@/components/chart/BarChart'
import adminAgentService from '@/api/adminAgentService'
import DashboardLoader from '@/components/common/DashboardLoader'


const chartConfig = {
    value: {
        label: "Value",
        color: "#7132CA",
    },
    revenue: {
        label: "Revenue",
        color: "#7132CA",
    },
    subscriptions: {
        label: "Subscriptions",
        color: "#7132CA",
    },
    usageFees: {
        label: "Usage Fees",
        color: "#16A34A",
    },
    setupFees: {
        label: "Setup Fees",
        color: "#F59E0B",
    },
    new: {
        label: "New Clients",
        color: "#16A34A",
    },
    churned: {
        label: "Churned",
        color: "#EF4444",
    },
    clients: {
        label: "Active Clients",
        color: "#7132CA",
    }
}

function RevenueDashboard({ revenueDashboardData, setRevenueDashboardData }: { revenueDashboardData: any, setRevenueDashboardData: (data: any) => void }) {

    const [loading, setLoading] = useState(false);

    const fetchRevenueDashboardData = async () => {
        try {
            setLoading(true);
            const response = await adminAgentService.getRevenueDashboardData({});
            setRevenueDashboardData(response);
        } catch (error) {
            console.error("Error fetching revenue dashboard data:", error);
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!revenueDashboardData) {
            fetchRevenueDashboardData();
        }
    }, []);


    const kpis = revenueDashboardData?.kpis || {};
    const charts = revenueDashboardData?.charts || {};
    const tables = revenueDashboardData?.tables || {};

    const statsCards = [
        {
            label: kpis.totalRevenue?.label || "Total Revenue",
            value: kpis.totalRevenue?.formatted || "$0",
            icon: DollarSign,
            trend: kpis.totalRevenue?.change || "",
            trendColor: "text-success",
            iconColor: "bg-primary/10 text-primary"
        },
        {
            label: kpis.activeClients?.label || "Active Clients",
            value: kpis.activeClients?.value || "0",
            icon: Users,
            trend: kpis.activeClients?.change || "",
            trendColor: "text-success",
            iconColor: "bg-success/10 text-success"
        },
        {
            label: kpis.monthlyRecurring?.label || "Monthly Recurring",
            value: kpis.monthlyRecurring?.formatted || "$0",
            icon: Calendar,
            trend: kpis.monthlyRecurring?.change || "",
            trendColor: "text-success",
            iconColor: "bg-warning/10 text-warning"
        },
        {
            label: kpis.avgRevenuePerClient?.label || "Avg. Revenue/Client",
            value: kpis.avgRevenuePerClient?.formatted || "$0",
            icon: Target,
            trend: kpis.avgRevenuePerClient?.change || "",
            trendColor: "text-success",
            iconColor: "bg-primary/10 text-primary"
        },
    ];

    const revenueSourceColors: Record<string, string> = {
        "Subscriptions": "#7132CA",
        "Usage Fees": "#16A34A",
        "Setup Fees": "#F59E0B"
    };

    const clientGrowthSeries = [
        {
            key: "value",
            label: "Clients",
            gradient: { start: "var(--chart-gradient-start)", end: "var(--chart-gradient-end)", }
        }
    ];

    return (
        <div className="py-4 space-y-6">
            {
                loading || !revenueDashboardData ? (
                    <DashboardLoader />
                ) : (
                    <>
                        {/* Stats Cards Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {statsCards.map((stat, index) => (
                                <div key={index} className="card rounded-xl p-6 border border-border-subtle hover:shadow-glow hover:-translate-y-0.5 transition-all">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="text-sm text-text-muted">{stat.label}</div>
                                        <div className={`p-2 rounded-lg ${stat.iconColor}`}>
                                            <stat.icon className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <div className="text-3xl font-bold text-text-main">
                                        {stat.value}
                                    </div>
                                    <div className={`text-xs mt-2 font-medium ${stat.trendColor}`}>
                                        {stat.trend}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Charts Row */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Revenue Trend - Area Chart */}
                            <Card className="lg:col-span-2 glass-morphism border-border-subtle">
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold text-text-main">{charts.revenueTrend?.label || "Revenue Trend"}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ChartContainer config={chartConfig} className="h-[300px] w-full">
                                        <AreaChart
                                            data={charts.revenueTrend?.data || []}
                                            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                                        >
                                            <defs>
                                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#7132CA" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#7132CA" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid vertical={false} stroke="#D9E1EC" strokeDasharray="3 3" />
                                            <XAxis
                                                dataKey="month"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: '#475467', fontSize: 12 }}
                                                dy={10}
                                            />
                                            <YAxis
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: '#475467', fontSize: 12 }}
                                                tickFormatter={(value) => `$${value / 1000}k`}
                                            />
                                            <ChartTooltip content={<ChartTooltipContent />} />
                                            <Area
                                                type="monotone"
                                                dataKey="value"
                                                stroke="#7132CA"
                                                strokeWidth={2}
                                                fillOpacity={1}
                                                fill="url(#colorRevenue)"
                                            />
                                        </AreaChart>
                                    </ChartContainer>
                                </CardContent>
                            </Card>

                            {/* Revenue Source - Donut Chart */}
                            <Card className="glass-morphism border-border-subtle">
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold text-text-main">{charts.revenueBySource?.label || "Revenue by Source"}</CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col items-center justify-center">
                                    <ChartContainer config={chartConfig} className="h-[300px] w-full">
                                        <PieChart>
                                            <Pie
                                                data={charts.revenueBySource?.data || []}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                                nameKey="label"
                                            >
                                                {(charts.revenueBySource?.data || []).map((entry: any, index: number) => (
                                                    <Cell key={`cell-${index}`} fill={revenueSourceColors[entry.label] || "#7132CA"} />
                                                ))}
                                            </Pie>
                                            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                                            <ChartLegend content={<ChartLegendContent />} className="flex-wrap" />
                                        </PieChart>
                                    </ChartContainer>
                                    <div className="mt-4 w-full space-y-2">
                                        {(charts.revenueBySource?.data || []).map((item: any) => (
                                            <div key={item.label} className="flex justify-between items-center text-sm">
                                                <span className="text-text-muted flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: revenueSourceColors[item.label] || "#7132CA" }} />
                                                    {item.label}
                                                </span>
                                                <span className="font-bold text-text-main">{item.value}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Growth Charts Row */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Client Growth - Grouped Bar Chart */}
                            <Card className="glass-morphism">
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold text-text-main">{charts.clientGrowth?.label || "Client Growth"}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <GenericBarChart
                                        data={charts.clientGrowth?.data || []}
                                        series={clientGrowthSeries}
                                    />
                                </CardContent>
                            </Card>

                            {/* Active Clients Over Time - Line Chart */}
                            <Card className="glass-morphism">
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold text-text-main">{charts.activeClientsOverTime?.label || "Active Clients Over Time"}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ChartContainer config={chartConfig} className="h-[300px] w-full">
                                        <LineChart
                                            data={charts.activeClientsOverTime?.data || []}
                                            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                                        >
                                            <CartesianGrid vertical={false} stroke="#D9E1EC" strokeDasharray="3 3" />
                                            <XAxis
                                                dataKey="month"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: '#475467', fontSize: 12 }}
                                                dy={10}
                                            />
                                            <YAxis
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: '#475467', fontSize: 12 }}
                                            />
                                            <ChartTooltip content={<ChartTooltipContent />} />
                                            <Line
                                                type="monotone"
                                                dataKey="value"
                                                stroke="#7132CA"
                                                strokeWidth={3}
                                                dot={{ fill: '#7132CA', strokeWidth: 2, r: 4, stroke: '#fff' }}
                                                activeDot={{ r: 6, strokeWidth: 0 }}
                                            />
                                        </LineChart>
                                    </ChartContainer>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Bottom Row - Details Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Revenue Breakdown */}
                            <Card className="card rounded-xl p-2 border border-border-subtle hover:shadow-glow hover:-translate-y-0.5 transition-all">
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold text-text-main">
                                        Revenue Breakdown
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-3">
                                        {(tables.revenueBreakdown || []).map((item: any, idx: number) => {
                                            const colors = [
                                                "bg-primary-soft/30 border-primary/10",
                                                "bg-success-soft/30 border-success/10",
                                                "bg-warning-soft/30 border-warning/10"
                                            ];
                                            return (
                                                <div key={idx} className={`flex justify-between items-center p-3 rounded-lg ${colors[idx % colors.length]}`}>
                                                    <span className="text-sm text-text-muted">{item.label}</span>
                                                    <span className="font-bold text-text-main font-mono">${item.value.toLocaleString()}</span>
                                                </div>
                                            );
                                        })}
                                        <div className="pt-2 mt-2 border-t border-border-subtle flex justify-between items-center px-1">
                                            <span className="text-base font-bold text-text-main">Total</span>
                                            <span className="text-lg font-black text-primary font-mono">${(revenueDashboardData?.totals?.revenueBreakdownTotal || 0).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Client Status */}
                            <Card className="card rounded-xl p-2 border border-border-subtle hover:shadow-glow hover:-translate-y-0.5 transition-all">
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold text-text-main">Client Status</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center justify-between p-4 bg-bg rounded-xl border border-border-subtle">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                                                    <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-text-main">Active Clients</p>
                                                    <p className="text-xs text-text-muted">Currently using services</p>
                                                </div>
                                            </div>
                                            <span className="text-xl font-black text-success font-mono">{tables.clientStatus?.active || 0}</span>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-bg rounded-xl border border-border-subtle">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-danger/10 flex items-center justify-center">
                                                    <div className="w-3 h-3 rounded-full bg-danger" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-text-main">Suspended</p>
                                                    <p className="text-xs text-text-muted">Requires attention</p>
                                                </div>
                                            </div>
                                            <span className="text-xl font-black text-danger font-mono">{tables.clientStatus?.suspended || 0}</span>
                                        </div>
                                        <div className="flex justify-between items-center px-2 py-1">
                                            <span className="text-sm font-bold text-text-muted">Total Clients</span>
                                            <span className="text-lg font-black text-text-main font-mono">{tables.clientStatus?.total || 0}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Upcoming Payments */}
                            <Card className="card rounded-xl p-2 border border-border-subtle hover:shadow-glow hover:-translate-y-0.5 transition-all">
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold text-text-main">Upcoming Payments</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {(tables.upcomingPayments || []).map((payment: any, i: number) => (
                                            <div key={i} className="flex items-center justify-between group cursor-default">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-primary-soft flex items-center justify-center text-primary font-bold text-xs ring-1 ring-primary/20">
                                                        {payment.name[0]}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-text-main group-hover:text-primary transition-colors">{payment.name}</p>
                                                        <p className="text-[10px] text-text-muted">Due: {payment.dueDate}</p>
                                                    </div>
                                                </div>
                                                <p className="text-sm font-black text-text-main font-mono">${payment.amount.toLocaleString()}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="w-full mt-6 py-2.5 rounded-xl border border-primary/20 bg-primary-soft/50 text-primary text-xs font-bold hover:bg-primary hover:text-white transition-all duration-300">
                                        View All Receivables
                                    </button>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Top Clients by Revenue Table */}
                        <Card className="card rounded-xl border border-border-subtle hover:shadow-glow transition-all">
                            <CardHeader className="border-b border-border-subtle/50 px-6 py-4">
                                <CardTitle className="text-lg font-bold text-text-main">Top Clients by Revenue</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-bg/50 border-b border-border-subtle">
                                                <th className="px-6 py-3 text-xs font-bold text-text-muted uppercase tracking-wider">Client Company Name</th>
                                                <th className="px-6 py-3 text-xs font-bold text-text-muted uppercase tracking-wider text-right">Revenue (Monthly)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border-subtle">
                                            {(tables.topClientsByRevenue || []).map((client: any, index: number) => (
                                                <tr key={index} className="hover:bg-primary-soft/10 transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-bg border border-border-subtle flex items-center justify-center text-primary font-bold text-xs">
                                                                {client.name[0]}
                                                            </div>
                                                            <span className="font-medium text-text-main group-hover:text-primary transition-colors">{client.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right font-mono font-bold text-text-main">
                                                        ${client.revenue.toLocaleString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>

                    </>
                )
            }
        </div>
    )
}

export default RevenueDashboard