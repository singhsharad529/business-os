import { Phone, Clock, CheckCircle, Users, Edit2, ChevronLeft } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Line,
    LineChart,
    Bar,
    BarChart,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { useNavigate } from 'react-router-dom'

const stats = [
    { label: "Total Calls", value: "1,248", icon: Phone, trend: "+12.5%", trendColor: "text-success", iconColor: "bg-primary/10 text-primary" },
    { label: "Avg Duration", value: "4m 32s", icon: Clock, trend: "-2.4%", trendColor: "text-success", iconColor: "bg-success/10 text-success" },
    { label: "Success Rate", value: "94.2%", icon: CheckCircle, trend: "+1.2%", trendColor: "text-success", iconColor: "bg-warning/10 text-warning" },
    { label: "Unique Callers", value: "852", icon: Users, trend: "+15.8%", trendColor: "text-success", iconColor: "bg-primary/10 text-primary" },
]

const callVolumeData = [
    { day: "Mon", calls: 145 },
    { day: "Tue", calls: 152 },
    { day: "Wed", calls: 168 },
    { day: "Thu", calls: 141 },
    { day: "Fri", calls: 185 },
    { day: "Sat", calls: 112 },
    { day: "Sun", calls: 98 },
]

const callOutcomesData = [
    { outcome: "Resolved", count: 850 },
    { outcome: "Transferred", count: 240 },
    { outcome: "Callback", count: 120 },
    { outcome: "Missed", count: 38 },
]

const chartConfig = {
    calls: {
        label: "Calls",
        color: "#7132CA",
    },
    count: {
        label: "Total Count",
        color: "#7132CA",
    }
}

interface AgentStatsProps {
    agent?: any;
    onBack?: () => void;
}

function AgentStats({ agent, onBack }: AgentStatsProps) {

    const navigate = useNavigate()
    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate(-1);
        }
    };

    return (
        <div className="py-6 space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleBack}
                        className="p-1 hover:bg-bg-alt rounded-lg transition-colors text-text-muted hover:text-primary mr-1"
                    >
                        <ChevronLeft className="w-6 h-6 text-primary" />
                    </button>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black text-text-main tracking-tight">{agent?.name || "Sales - Inbound Support"}</h1>
                        <p className="text-text-muted text-sm font-medium">
                            {agent?.metadata?.department.charAt(0).toUpperCase() + agent?.metadata?.department.slice(1) || "Sales"}
                        </p>
                    </div>
                </div>
                <button
                    // onClick={() => setIsAddSheetOpen(true)}
                    className="btn btn-primary flex items-center gap-2"
                >
                    <Edit2 className="w-4 h-4" />
                    Edit Agent
                </button>
            </div>

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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Call Volume - Line Chart */}
                <Card className="glass-morphism border-border-subtle rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xl font-black text-text-main">Call volume</CardTitle>
                            <span className="text-xs font-bold text-text-muted px-3 py-1 bg-bg-muted rounded-full">Last 7 days</span>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <ChartContainer config={chartConfig} className="h-[320px] w-full">
                            <LineChart
                                data={callVolumeData}
                                margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
                            >
                                <CartesianGrid vertical={false} stroke="#D9E1EC" strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="day"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#475467', fontSize: 12, fontWeight: 600 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#475467', fontSize: 12, fontWeight: 600 }}
                                />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Line
                                    type="monotone"
                                    dataKey="calls"
                                    stroke="#7132CA"
                                    strokeWidth={4}
                                    dot={{ fill: '#7132CA', strokeWidth: 2, r: 4, stroke: '#fff' }}
                                    activeDot={{ r: 8, strokeWidth: 0 }}
                                    animationDuration={2000}
                                />
                            </LineChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                {/* Call Outcomes - Horizontal Bar Chart */}
                <Card className="glass-morphism border-border-subtle rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xl font-black text-text-main">Call outcomes</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <ChartContainer config={chartConfig} className="h-[320px] w-full">
                            <BarChart
                                layout="vertical"
                                data={callOutcomesData}
                                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                                barSize={40}
                            >
                                <defs>
                                    <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="var(--chart-gradient-end)" />
                                        <stop offset="100%" stopColor="var(--chart-gradient-start)" />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid horizontal={false} stroke="#D9E1EC" strokeDasharray="3 3" />
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="outcome"
                                    type="category"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#475467', fontSize: 13, fontWeight: 700 }}
                                    width={90}
                                />
                                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                                <Bar
                                    dataKey="count"
                                    fill="url(#barGradient)"
                                    radius={[0, 8, 8, 0]}
                                    animationDuration={1500}
                                />
                            </BarChart>
                        </ChartContainer>
                        <div className="mt-6 grid grid-cols-2 gap-4">
                            {callOutcomesData.map((item) => (
                                <div key={item.outcome} className="flex flex-col p-3 rounded-2xl bg-bg border border-border-subtle/50 group hover:border-primary/20 transition-colors duration-300">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                                        <span className="text-xs font-bold text-text-muted">{item.outcome}</span>
                                    </div>
                                    <span className="text-lg font-black text-text-main font-mono">{item.count}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default AgentStats