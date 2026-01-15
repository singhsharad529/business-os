import GenericBarChart from '@/components/chart/BarChart'
import { Card, CardContent } from '@/components/ui/card'
import { Clock, PhoneCall, Target, Users } from 'lucide-react'
import React, { useState } from 'react'

const dashboardData = {
    today: {
        stats: [
            { label: "Total Calls", value: "1,284", icon: PhoneCall, trend: "+5% vs yesterday", trendColor: "text-success", iconColor: "bg-primary/10 text-primary" },
            { label: "Connected Rate", value: "82.4%", icon: Target, trend: "+1.2% improved", trendColor: "text-success", iconColor: "bg-success/10 text-success" },
            { label: "Avg Duration", value: "3m 45s", icon: Clock, trend: "Consistent", trendColor: "text-text-muted", iconColor: "bg-warning/10 text-warning" },
            { label: "Leads Captured", value: "42", icon: Users, trend: "+12 since morning", trendColor: "text-success", iconColor: "bg-primary/10 text-primary" },
        ],
        chart: [
            { label: "00:00", inbound: 12 },
            { label: "02:00", inbound: 8 },
            { label: "04:00", inbound: 5 },
            { label: "06:00", inbound: 18 },
            { label: "08:00", inbound: 45 },
            { label: "10:00", inbound: 82 },
            { label: "12:00", inbound: 115 },
            { label: "14:00", inbound: 98 },
            { label: "16:00", inbound: 134 },
            { label: "18:00", inbound: 76 },
            { label: "20:00", inbound: 54 },
            { label: "22:00", inbound: 32 },
        ]
    },
    "7day": {
        stats: [
            { label: "Total Calls", value: "8,452", icon: PhoneCall, trend: "+8% vs last week", trendColor: "text-success", iconColor: "bg-primary/10 text-primary" },
            { label: "Connected Rate", value: "84.2%", icon: Target, trend: "+2.4% improved", trendColor: "text-success", iconColor: "bg-success/10 text-success" },
            { label: "Avg Duration", value: "4m 12s", icon: Clock, trend: "+15s increase", trendColor: "text-success", iconColor: "bg-warning/10 text-warning" },
            { label: "Leads Captured", value: "312", icon: Users, trend: "+45 this week", trendColor: "text-success", iconColor: "bg-primary/10 text-primary" },
        ],
        chart: [
            { label: "Mon", inbound: 450 },
            { label: "Tue", inbound: 520 },
            { label: "Wed", inbound: 615 },
            { label: "Thu", inbound: 498 },
            { label: "Fri", inbound: 734 },
            { label: "Sat", inbound: 376 },
            { label: "Sun", inbound: 254 },
        ]
    },
    "30day": {
        stats: [
            { label: "Total Calls", value: "45.2k", icon: PhoneCall, trend: "+12% vs last month", trendColor: "text-success", iconColor: "bg-primary/10 text-primary" },
            { label: "Connected Rate", value: "83.8%", icon: Target, trend: "-0.5% decrease", trendColor: "text-danger", iconColor: "bg-success/10 text-success" },
            { label: "Avg Duration", value: "4m 32s", icon: Clock, trend: "Stable performance", trendColor: "text-text-muted", iconColor: "bg-warning/10 text-warning" },
            { label: "Leads Captured", value: "1,284", icon: Users, trend: "+156 this month", trendColor: "text-success", iconColor: "bg-primary/10 text-primary" },
        ],
        chart: [
            { label: "Day 1", inbound: 1200 },
            { label: "Day 3", inbound: 1450 },
            { label: "Day 5", inbound: 1100 },
            { label: "Day 7", inbound: 1650 },
            { label: "Day 9", inbound: 1300 },
            { label: "Day 12", inbound: 1800 },
            { label: "Day 15", inbound: 1400 },
            { label: "Day 18", inbound: 1950 },
            { label: "Day 21", inbound: 1700 },
            { label: "Day 24", inbound: 2100 },
            { label: "Day 27", inbound: 1850 },
            { label: "Day 30", inbound: 2300 },
        ]
    }
}

function CallsDashboard() {
    const [activeTab, setActiveTab] = useState<keyof typeof dashboardData>("today");

    const currentData = dashboardData[activeTab];

    const dummySeries = [
        {
            key: "inbound",
            label: "Inbound Calls",
            gradient: {
                start: "var(--chart-gradient-start)",
                end: "var(--chart-gradient-end)",
            },
        },
    ];

    const tabs: { id: keyof typeof dashboardData; label: string }[] = [
        { id: "today", label: "Today" },
        { id: "7day", label: "7 Day" },
        { id: "30day", label: "30 Day" },
    ];

    return (

        <div>
            <div className="flex items-center justify-end my-2">
                <div className="flex gap-1 bg-surface-main/50 p-1 rounded-xl border border-border-subtle">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-1 rounded-lg text-[12px] font-medium transition-all duration-300 ${activeTab === tab.id
                                ? "bg-primary text-white shadow-lg"
                                : "text-text-muted hover:text-text-main hover:bg-white/5"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>
            <div className='space-y-6'>


                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {currentData.stats.map((stat, index) => (
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

                <Card className="glass-morphism">
                    <CardContent className="space-y-4 pt-6">
                        <h4 className="text-xl font-semibold text-text-main mb-4">Inbound Calls Overview</h4>
                        <GenericBarChart
                            data={currentData.chart}
                            series={dummySeries}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default CallsDashboard