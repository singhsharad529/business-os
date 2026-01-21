import { DollarSign, Users, Calendar, Target } from 'lucide-react'
import React from 'react'
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

const stats = [
    { label: "Total Revenue", value: "$124.5k", icon: DollarSign, trend: "+12% this month", trendColor: "text-success", iconColor: "bg-primary/10 text-primary" },
    { label: "Avg Cost/Call", value: "$12", icon: Users, trend: "", trendColor: "text-success", iconColor: "bg-success/10 text-success" },
    { label: "Monthly Recurring", value: "$45.2k", icon: Calendar, trend: "+8.4% growth", trendColor: "text-success", iconColor: "bg-warning/10 text-warning" },
    { label: "Avg. Revenue/Client", value: "$842", icon: Target, trend: "+2.1% improve", trendColor: "text-success", iconColor: "bg-primary/10 text-primary" },
]

const revenueTrendData = [
    { month: "Jan", revenue: 45000 },
    { month: "Feb", revenue: 52000 },
    { month: "Mar", revenue: 48000 },
    { month: "Apr", revenue: 61000 },
    { month: "May", revenue: 55000 },
    { month: "Jun", revenue: 67000 },
    { month: "Jul", revenue: 72000 },
    { month: "Aug", revenue: 69000 },
    { month: "Sep", revenue: 84000 },
    { month: "Oct", revenue: 91000 },
    { month: "Nov", revenue: 105000 },
    { month: "Dec", revenue: 124500 },
]

const revenueSourceData = [
    { name: "Subscriptions", value: 65, color: "#7132CA" }, // primary
    { name: "Usage Fees", value: 25, color: "#16A34A" },    // success
    { name: "Setup Fees", value: 10, color: "#F59E0B" },    // warning
]

const clientGrowthData = [
    { month: "Jan", new: 45, churned: 12 },
    { month: "Feb", new: 52, churned: 8 },
    { month: "Mar", new: 48, churned: 15 },
    { month: "Apr", new: 61, churned: 10 },
    { month: "May", new: 55, churned: 12 },
    { month: "Jun", new: 67, churned: 9 },
    { month: "Jul", new: 72, churned: 14 },
    { month: "Aug", new: 69, churned: 11 },
    { month: "Sep", new: 84, churned: 13 },
    { month: "Oct", new: 91, churned: 16 },
    { month: "Nov", new: 105, churned: 10 },
    { month: "Dec", new: 124, churned: 18 },
]

const activeClientsHistoryData = [
    { month: "Jan", clients: 850 },
    { month: "Feb", clients: 894 },
    { month: "Mar", clients: 927 },
    { month: "Apr", clients: 978 },
    { month: "May", clients: 1021 },
    { month: "Jun", clients: 1079 },
    { month: "Jul", clients: 1137 },
    { month: "Aug", clients: 1195 },
    { month: "Sep", clients: 1266 },
    { month: "Oct", clients: 1341 },
    { month: "Nov", clients: 1436 },
    { month: "Dec", clients: 1542 },
]

const clientGrowthSeries = [
    {
        key: "new",
        label: "New Clients",
        gradient: { start: "var(--chart-gradient-start)", end: "var(--chart-gradient-end)", }
    },
    {
        key: "churned",
        label: "Churned",
        gradient: { start: "var(--chart-gradient-start)", end: "var(--chart-gradient-end)", }
    }
]

const chartConfig = {
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

function RevenueDashboard() {
    return (
        <div className="py-4 space-y-6">
            {/* Stats Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
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
                        <CardTitle className="text-lg font-bold text-text-main">Revenue Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="h-[300px] w-full">
                            <AreaChart
                                data={revenueTrendData}
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
                                    dataKey="revenue"
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
                        <CardTitle className="text-lg font-bold text-text-main">Revenue by Source</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center">
                        <ChartContainer config={chartConfig} className="h-[300px] w-full">
                            <PieChart>
                                <Pie
                                    data={revenueSourceData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {revenueSourceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                                <ChartLegend content={<ChartLegendContent />} className="flex-wrap" />
                            </PieChart>
                        </ChartContainer>
                        <div className="mt-4 w-full space-y-2">
                            {revenueSourceData.map((item) => (
                                <div key={item.name} className="flex justify-between items-center text-sm">
                                    <span className="text-text-muted flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                        {item.name}
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
                        <CardTitle className="text-lg font-bold text-text-main">Client Growth</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <GenericBarChart
                            data={clientGrowthData}
                            series={clientGrowthSeries}
                        />
                    </CardContent>
                </Card>

                {/* Active Clients Over Time - Line Chart */}
                <Card className="glass-morphism">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold text-text-main">Active Clients Over Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="h-[300px] w-full">
                            <LineChart
                                data={activeClientsHistoryData}
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
                                    dataKey="clients"
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
                            <div className="flex justify-between items-center p-3 rounded-lg bg-primary-soft/30 border border-primary/10">
                                <span className="text-sm text-text-muted">Subscription</span>
                                <span className="font-bold text-text-main font-mono">$80,925</span>
                            </div>
                            <div className="flex justify-between items-center p-3 rounded-lg bg-success-soft/30 border border-success/10">
                                <span className="text-sm text-text-muted">Usage Fees</span>
                                <span className="font-bold text-text-main font-mono">$31,125</span>
                            </div>
                            <div className="flex justify-between items-center p-3 rounded-lg bg-warning-soft/30 border border-warning/10">
                                <span className="text-sm text-text-muted">One-time Setup</span>
                                <span className="font-bold text-text-main font-mono">$12,450</span>
                            </div>
                            <div className="pt-2 mt-2 border-t border-border-subtle flex justify-between items-center px-1">
                                <span className="text-base font-bold text-text-main">Total</span>
                                <span className="text-lg font-black text-primary font-mono">$124,500</span>
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
                                <span className="text-xl font-black text-success font-mono">1,154</span>
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
                                <span className="text-xl font-black text-danger font-mono">130</span>
                            </div>
                            <div className="flex justify-between items-center px-2 py-1">
                                <span className="text-sm font-bold text-text-muted">Total Clients</span>
                                <span className="text-lg font-black text-text-main font-mono">1,284</span>
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
                            {[
                                { name: "TechChop Inc", amount: "$1,240.00", date: "Jan 18, 2026" },
                                { name: "StartupXyz", amount: "$850.50", date: "Jan 20, 2026" },
                                { name: "Global Services", amount: "$3,420.00", date: "Jan 22, 2026" },
                            ].map((payment, i) => (
                                <div key={i} className="flex items-center justify-between group cursor-default">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-primary-soft flex items-center justify-center text-primary font-bold text-xs ring-1 ring-primary/20">
                                            {payment.name[0]}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-text-main group-hover:text-primary transition-colors">{payment.name}</p>
                                            <p className="text-[10px] text-text-muted">Due: {payment.date}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm font-black text-text-main font-mono">{payment.amount}</p>
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
                                {[
                                    { name: "Acme Corp", revenue: "$12,450.00" },
                                    { name: "Global Logistics", revenue: "$10,800.00" },
                                    { name: "Tech Solutions Inc", revenue: "$9,500.00" },
                                    { name: "Eco Energy Ltd", revenue: "$8,200.00" },
                                    { name: "Innovative Apps", revenue: "$7,600.00" },
                                ].map((client, index) => (
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
                                            {client.revenue}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default RevenueDashboard