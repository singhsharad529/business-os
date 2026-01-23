import { Phone, Clock, CheckCircle, Users, Edit2, ChevronLeft, Search, Eye } from 'lucide-react'
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
import { useState, useMemo, useEffect } from 'react'
import TableLoader from '@/components/common/TableLoader'
import { SideSheet } from '@/components/SideSheet'
import { CallDetails } from '@/components/voicebot/CallDetails'
import Pagination from '@/components/common/Pagination'
import EditAdminAgent from '@/components/super-admin/voicebot/EditAdminAgent'
import adminAgentService from '@/api/adminAgentService'
import { toast } from '@/hooks/useToast'
import DashboardLoader from '@/components/common/DashboardLoader'



const dummyCalls = [
    {
        "id": "1a44c37e-cc5a-46ec-ac9e-912b5458d508",
        "vapiId": "019bde6e-4f52-7880-88cd-3ae32a391582",
        "userId": null,
        "assistantVapiId": "233db94e-8018-4fbe-a9d7-9d216469b6be",
        "phoneNumberVapiId": null,
        "type": "webCall",
        "status": "call.in-progress.error-assistant-did-not-receive-customer-audio",
        "startedAt": "2026-01-21T02:42:25.039",
        "endedAt": "2026-01-21T02:42:25.039",
        "durationSeconds": 0,
        "durationMinutes": 0,
        "customerNumber": null,
        "phoneNumber": null,
        "phoneNumberName": null,
        "assistantName": "Sales Template V2",
        "summary": "",
        "successEvaluation": null,
        "transcript": "",
        "messageCount": 1,
        "messages": [
            {
                "role": "system",
                "time": 1768963330029,
                "message": "You are an expert sales representative for ACME Corp. Be friendly, professional, and focus on understanding customer needs before presenting solutions.",
                "secondsFromStart": 0
            }
        ],
        "recordings": {
            "mono": "https://storage.vapi.ai/019bde6e-4f52-7880-88cd-3ae32a391582-1768963347555-4f3c3c9c-ad13-4da1-bffd-802e7aa0a0cb-mono.wav",
            "stereo": "https://storage.vapi.ai/019bde6e-4f52-7880-88cd-3ae32a391582-1768963347556-906ecd79-a0f3-44df-b9c9-863a0828611c-stereo.wav"
        },
        "cost": {
            "total": 0.0029,
            "tokens": {
                "promptTokens": 0,
                "completionTokens": 0
            },
            "breakdown": {
                "llm": 0,
                "stt": 0.0029,
                "tts": 0,
                "vapi": 0,
                "transport": 0
            },
            "ttsCharacters": 0
        },
        "performance": {
            "turnLatencyAvg": 0,
            "modelLatencyAvg": 0,
            "voiceLatencyAvg": 0,
            "transcriberLatencyAvg": 0
        },
        "createdAt": "2026-01-21T02:42:28.64",
        "updatedAt": "2026-01-21T02:42:28.64",
        "isTestCall": false
    },
    {
        "id": "7a625d56-2744-47b5-8acc-2eedac151d10",
        "vapiId": "019bde6d-f7c4-7008-8b31-a91e8b4187ef",
        "userId": null,
        "assistantVapiId": "5f923970-6f9e-463a-8fe9-5225e76797ae",
        "phoneNumberVapiId": null,
        "type": "webCall",
        "status": "call.in-progress.error-assistant-did-not-receive-customer-audio",
        "startedAt": "2026-01-21T02:42:02.606",
        "endedAt": "2026-01-21T02:42:02.606",
        "durationSeconds": 0,
        "durationMinutes": 0,
        "customerNumber": null,
        "phoneNumber": null,
        "phoneNumberName": null,
        "assistantName": "Sales Template V3",
        "summary": "",
        "successEvaluation": null,
        "transcript": "",
        "messageCount": 1,
        "messages": [
            {
                "role": "system",
                "time": 1768963307599,
                "message": "You are an expert sales representative for ACME Corp. Be friendly, professional, and focus on understanding customer needs before presenting solutions.",
                "secondsFromStart": 0
            }
        ],
        "recordings": {
            "mono": "https://storage.vapi.ai/019bde6d-f7c4-7008-8b31-a91e8b4187ef-1768963325122-b4ef52eb-5b2e-499a-9402-fbc5d143149e-mono.wav",
            "stereo": "https://storage.vapi.ai/019bde6d-f7c4-7008-8b31-a91e8b4187ef-1768963325122-6fab2ef8-9f59-4549-bd4c-c556e0054d98-stereo.wav"
        },
        "cost": {
            "total": 0.0029,
            "tokens": {
                "promptTokens": 0,
                "completionTokens": 0
            },
            "breakdown": {
                "llm": 0,
                "stt": 0.0029,
                "tts": 0,
                "vapi": 0,
                "transport": 0
            },
            "ttsCharacters": 0
        },
        "performance": {
            "turnLatencyAvg": 0,
            "modelLatencyAvg": 0,
            "voiceLatencyAvg": 0,
            "transcriberLatencyAvg": 0
        },
        "createdAt": "2026-01-21T02:42:06.146",
        "updatedAt": "2026-01-21T02:42:06.146",
        "isTestCall": false
    },
    {
        "id": "464ee8be-5c26-480b-bff6-0cb21c5baee4",
        "vapiId": "019b7da9-8b1e-7110-9e96-f8508698b82d",
        "userId": "e14d0d6e-d081-462b-ab44-382758738b92",
        "assistantVapiId": "73a8c4de-1391-4aa4-afe5-169896ed77a6",
        "phoneNumberVapiId": "cf7347be-d921-440a-923c-5ae456d8d08c",
        "type": "outboundPhoneCall",
        "status": "customer-ended-call",
        "startedAt": "2026-01-02T07:43:50.769",
        "endedAt": "2026-01-02T07:44:17.498",
        "durationSeconds": 26.729,
        "durationMinutes": 0.4455,
        "customerNumber": "+919773120538",
        "phoneNumber": "+12176018658",
        "phoneNumberName": "VAPI Label",
        "assistantName": "Realty - Rental Specialist",
        "summary": "The AI offered assistance with rental properties, asking if the user was looking to rent or list. The user indicated they were not ready, but the AI offered to provide information or answer questions about the rental process whenever they are prepared in the future.",
        "successEvaluation": "false",
        "transcript": "AI: Hello. I specialize in rental properties. Are you looking to rent or list a rental property?\nUser: I'm not ready.\nAI: That's perfectly fine. If you have any questions about the rental process, or need information to prepare for renting or listing in the future, feel free to ask. I'm here to help whenever you're ready.\nUser: Sure. I'll let you know. Thank you.\nAI: Thank you for letting me. You're very welcome. Whenever you're ready or if you have any questions,\n",
        "messageCount": 7,
        "messages": [
            {
                "role": "system",
                "time": 1767339830604,
                "message": "You are a rental property specialist. You help clients find rental properties or manage rental listings. You must communicate exclusively in English. All responses should be in English.",
                "secondsFromStart": 0
            },
            {
                "role": "system",
                "time": 1767339830604,
                "message": "Understand rental requirements, budget, lease terms, and help match clients with suitable rental properties.",
                "secondsFromStart": 0
            },
            {
                "role": "bot",
                "time": 1767339832539,
                "source": "",
                "endTime": 1767339837239,
                "message": "Hello. I specialize in rental properties. Are you looking to rent or list a rental property?",
                "duration": 4360,
                "secondsFromStart": 1.77
            },
            {
                "role": "user",
                "time": 1767339836819,
                "endTime": 1767339839889,
                "message": "I'm not ready.",
                "duration": 3070,
                "metadata": {
                    "wordLevelConfidence": [
                        {
                            "end": 6.54,
                            "word": "i'm",
                            "start": 6.04,
                            "confidence": 0.7265625,
                            "punctuated_word": "I'm"
                        },
                        {
                            "end": 8.61,
                            "word": "not",
                            "start": 8.36,
                            "confidence": 0.7895508,
                            "punctuated_word": "not"
                        },
                        {
                            "end": 9.11,
                            "word": "ready",
                            "start": 8.61,
                            "confidence": 0.99072266,
                            "punctuated_word": "ready."
                        }
                    ]
                },
                "secondsFromStart": 6.04
            },
            {
                "role": "bot",
                "time": 1767339841919,
                "source": "",
                "endTime": 1767339851459,
                "message": "That's perfectly fine. If you have any questions about the rental process, or need information to prepare for renting or listing in the future, feel free to ask. I'm here to help whenever you're ready.",
                "duration": 8980,
                "secondsFromStart": 11.15
            },
            {
                "role": "user",
                "time": 1767339851049,
                "endTime": 1767339854179,
                "message": "Sure. I'll let you know. Thank you.",
                "duration": 2280,
                "metadata": {
                    "wordLevelConfidence": [
                        {
                            "end": 20.51,
                            "word": "sure",
                            "start": 20.27,
                            "confidence": 0.8625488,
                            "punctuated_word": "Sure."
                        },
                        {
                            "end": 20.75,
                            "word": "i'll",
                            "start": 20.51,
                            "confidence": 0.9975586,
                            "punctuated_word": "I'll"
                        },
                        {
                            "end": 20.99,
                            "word": "let",
                            "start": 20.75,
                            "confidence": 0.99902344,
                            "punctuated_word": "let"
                        },
                        {
                            "end": 21.07,
                            "word": "you",
                            "start": 20.99,
                            "confidence": 0.99902344,
                            "punctuated_word": "you"
                        },
                        {
                            "end": 21.57,
                            "word": "know",
                            "start": 21.07,
                            "confidence": 0.99853516,
                            "punctuated_word": "know."
                        }
                    ]
                },
                "secondsFromStart": 20.27
            },
            {
                "role": "bot",
                "time": 1767339853379,
                "source": "",
                "endTime": 1767339858519,
                "message": "Thank you for letting me. You're very welcome. Whenever you're ready or if you have any questions,",
                "duration": 4760,
                "secondsFromStart": 22.61
            }
        ],
        "recordings": {
            "mono": "https://storage.vapi.ai/019b7da9-8b1e-7110-9e96-f8508698b82d-1767339860298-5d59d3d9-81b3-44c4-be22-bc514681d902-mono.wav",
            "stereo": "https://storage.vapi.ai/019b7da9-8b1e-7110-9e96-f8508698b82d-1767339860298-dcc83b71-b31b-4e91-963c-34b58ec7b50c-stereo.wav"
        },
        "cost": {
            "total": 0.0571,
            "tokens": {
                "promptTokens": 494,
                "completionTokens": 93
            },
            "breakdown": {
                "llm": 0.0077,
                "stt": 0.0052,
                "tts": 0.0216,
                "vapi": 0.0223,
                "transport": 0
            },
            "ttsCharacters": 432
        },
        "performance": {
            "turnLatencyAvg": 1683.67,
            "modelLatencyAvg": 743.33,
            "voiceLatencyAvg": 353.33,
            "transcriberLatencyAvg": 436.33
        },
        "createdAt": "2026-01-02T07:44:24.784",
        "updatedAt": "2026-01-02T07:44:24.784",
        "isTestCall": false
    },
    {
        "id": "cd7a165b-b74f-4406-92b4-89e79dbc708c",
        "vapiId": "019b7a3c-95ce-7776-bde9-429c2511b0de",
        "userId": "e14d0d6e-d081-462b-ab44-382758738b92",
        "assistantVapiId": "87dacff4-c1ff-4225-91dd-e76c6f1e75f5",
        "phoneNumberVapiId": "cf7347be-d921-440a-923c-5ae456d8d08c",
        "type": "outboundPhoneCall",
        "status": "customer-did-not-answer",
        "startedAt": null,
        "endedAt": null,
        "durationSeconds": null,
        "durationMinutes": null,
        "customerNumber": "+919871750805",
        "phoneNumber": "+12176018658",
        "phoneNumberName": "VAPI Label",
        "assistantName": "Sales - Inbound Support",
        "summary": null,
        "successEvaluation": null,
        "transcript": null,
        "messageCount": 0,
        "messages": [],
        "recordings": {
            "mono": null,
            "stereo": null
        },
        "cost": {
            "total": 0,
            "tokens": {
                "promptTokens": null,
                "completionTokens": null
            },
            "breakdown": {
                "llm": null,
                "stt": null,
                "tts": null,
                "vapi": null,
                "transport": null
            },
            "ttsCharacters": null
        },
        "performance": null,
        "createdAt": "2026-01-01T15:46:08.642",
        "updatedAt": "2026-01-01T15:46:08.642",
        "isTestCall": false
    },
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

    const [agentStatsTab, setAgentStatsTab] = useState<"dashboard" | "calls">("dashboard");
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false)

    const [dashboardData, setDashboardData] = useState<any>(null);
    const [dashboardLoader, setDashboardLoader] = useState(false)
    const [isCallDetailSheetOpen, setIsCallDetailSheetOpen] = useState(false);
    const [selectedCallForDetail, setSelectedCallForDetail] = useState<any>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const inboundPageSize = 10;

    const navigate = useNavigate()

    const formatDuration = (seconds: number) => {
        if (!seconds) return "0m 0s";
        const mins = Math.floor(seconds / 60);
        const secs = Math.round(seconds % 60);
        return `${mins}m ${secs}s`;
    };

    const stats = useMemo(() => [
        {
            label: "Total Calls",
            value: dashboardData?.totalCalls?.toLocaleString() || "0",
            icon: Phone,
            trend: "+0%",
            trendColor: "text-success",
            iconColor: "bg-primary/10 text-primary"
        },
        {
            label: "Avg Duration",
            value: formatDuration(dashboardData?.avgDurationSeconds || 0),
            icon: Clock,
            trend: "0.0%",
            trendColor: "text-success",
            iconColor: "bg-success/10 text-success"
        },
        {
            label: "Success Rate",
            value: `${(dashboardData?.successRate || 0).toFixed(1)}%`,
            icon: CheckCircle,
            trend: "0.0%",
            trendColor: "text-success",
            iconColor: "bg-warning/10 text-warning"
        },
        {
            label: "Unique Callers",
            value: dashboardData?.uniqueCallers?.toLocaleString() || "0",
            icon: Users,
            trend: "0.0%",
            trendColor: "text-success",
            iconColor: "bg-primary/10 text-primary"
        },
    ], [dashboardData]);

    const callVolumeData = useMemo(() => {
        return dashboardData?.callVolume?.points?.map((p: any) => ({
            day: p.day,
            calls: p.count
        })) || [];
    }, [dashboardData]);

    const callOutcomesData = useMemo(() => [
        { outcome: "Resolved", count: dashboardData?.callOutcomes?.resolved || 0 },
        { outcome: "Missed", count: dashboardData?.callOutcomes?.missed || 0 },
    ], [dashboardData]);

    const filteredInboundCalls = useMemo(() => {
        if (!searchTerm) return dummyCalls;
        return dummyCalls.filter(call =>
            call.customerNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            call.assistantName?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    const pagination = {
        page: currentPage,
        pageSize: inboundPageSize,
        total: filteredInboundCalls.length,
        totalPages: Math.ceil(filteredInboundCalls.length / inboundPageSize)
    };

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate(-1);
        }
    };

    const handleViewDetails = (call: any) => {
        setSelectedCallForDetail(call);
        setIsCallDetailSheetOpen(true);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const fetchAgentStats = async () => {
        try {
            setDashboardLoader(true);
            const response = await adminAgentService.getActiveAgentDashboard(agent?.id as string, {});
            if (response) {
                setDashboardData(response)
            }
        } catch (error) {
            // console.log(error);
            toast.danger("Failed to fetch agent stats")
        } finally {
            setDashboardLoader(false)
        }
    }

    useEffect(() => {
        fetchAgentStats()
    }, [])

    return (
        <div>
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
                                {agent?.metadata?.department?.charAt(0).toUpperCase() + agent?.metadata?.department?.slice(1) || "Sales"}
                            </p>
                        </div>
                    </div>
                    {/* <button
                        className="btn btn-primary flex items-center gap-2"
                    >
                        <Edit2 className="w-4 h-4" />
                        Edit Agent
                    </button> */}
                </div>

                {/* Tabs Switcher */}
                <div className="flex items-center justify-between border-b border-border-subtle">
                    <div className="flex gap-8">
                        <button
                            onClick={() => {
                                setAgentStatsTab("dashboard");
                            }}
                            className={`pb-2 text-sm font-bold transition-all relative ${agentStatsTab === 'dashboard' ? 'text-primary' : 'text-text-muted hover:text-text-main'}`}
                        >
                            Dashboard
                            {agentStatsTab === 'dashboard' && (
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />
                            )}
                        </button>
                        <button
                            onClick={() => {
                                setAgentStatsTab("calls");
                            }}
                            className={`pb-2 text-sm font-bold transition-all relative ${agentStatsTab === 'calls' ? 'text-primary' : 'text-text-muted hover:text-text-main'}`}
                        >
                            Inbound Calls
                            {agentStatsTab === 'calls' && (
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />
                            )}
                        </button>
                    </div>
                </div>

                {
                    agentStatsTab === "dashboard" && (
                        <div>
                            {dashboardLoader ? (
                                <DashboardLoader />
                            ) : (
                                <div className='space-y-6'>
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
                                                {/* <div className={`text-xs mt-2 font-medium ${stat.trendColor}`}>
                                                    {stat.trend}
                                                </div> */}
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

                                                    >
                                                        <CartesianGrid vertical={false} stroke="#D9E1EC" strokeDasharray="3 3" />
                                                        <XAxis
                                                            dataKey="day"
                                                            axisLine={false}
                                                            tickLine={false}
                                                            tick={{ fill: '#475467', fontSize: 12, fontWeight: 600 }}
                                                            dy={5}
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
                                                <ChartContainer config={chartConfig} className="h-[200px] w-full">
                                                    <BarChart
                                                        layout="vertical"
                                                        data={callOutcomesData}
                                                        margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                                                        barSize={45}
                                                        barCategoryGap="40%"
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
                            )}
                        </div>
                    )
                }
                {
                    agentStatsTab === "calls" && (
                        <div>
                            {loading ? (
                                <TableLoader rows={10} columns={8} />
                            ) : (
                                <div className="card p-4">
                                    <div className="flex flex-col sm:flex-row gap-2 mb-4">
                                        <div className="flex-1 relative">
                                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                            <input
                                                type="text"
                                                placeholder="Search by number or assistant..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="input pl-8 w-full"
                                            />
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-border-subtle">
                                                    <th className="py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Sr.No.</th>
                                                    <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Customer Number</th>
                                                    <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Assistant</th>
                                                    <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Status</th>
                                                    <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Duration</th>
                                                    <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Cost</th>
                                                    <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Call Time</th>
                                                    <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border-subtle/50">
                                                {filteredInboundCalls && filteredInboundCalls?.map((call: any, i: number) => (
                                                    <tr key={call.id} className="hover:bg-bg-alt/30 transition-colors">
                                                        <td className="py-4 px-3 text-center text-xs text-text-muted">
                                                            {(pagination?.page - 1) * (pagination?.pageSize || inboundPageSize) + i + 1}
                                                        </td>
                                                        <td className="py-4 px-3 text-sm text-text-main font-medium">{call.customerNumber || 'Web Call'}</td>
                                                        <td className="py-4 px-3 text-sm text-text-muted">{call.assistantName || 'N/A'}</td>
                                                        <td className="py-4 px-3">
                                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${call.status?.includes('ended') || call.status === 'completed' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                                                                }`}>
                                                                {call.status?.split('.').pop()?.split('-').join(' ')}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-3 text-sm text-text-muted">
                                                            {call.durationMinutes ? `${call.durationMinutes.toFixed(2)}m` : call.durationSeconds ? `${call.durationSeconds}s` : '0s'}
                                                        </td>
                                                        <td className="py-4 px-3 text-sm text-text-muted">${call.cost?.total?.toFixed(3) || '0.000'}</td>
                                                        <td className="py-4 px-3 text-sm text-text-muted">
                                                            {call.createdAt ? new Date(call.createdAt).toLocaleString() : 'N/A'}
                                                        </td>
                                                        <td className="py-4 px-3 text-sm text-text-muted">
                                                            <button
                                                                onClick={() => handleViewDetails(call)}
                                                                className="p-2 hover:bg-primary/10 rounded-lg transition-all cursor-pointer"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    {pagination && (
                                        <Pagination
                                            currentPage={pagination.page}
                                            totalPages={pagination.totalPages}
                                            pageSize={pagination.pageSize}
                                            totalCount={pagination.total}
                                            onPageChange={handlePageChange}
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                    )
                }

            </div>
            {/* Call Details SideSheet */}
            <SideSheet
                isOpen={isCallDetailSheetOpen}
                onClose={() => setIsCallDetailSheetOpen(false)}
                title="Call Details"
                size="md"
            >
                {selectedCallForDetail && <CallDetails call={selectedCallForDetail} />}
            </SideSheet>


            {/* SideSheets */}
            {/* <SideSheet
                isOpen={isEditSheetOpen}
                onClose={() => setIsEditSheetOpen(false)}
                title="Edit AI Agent"
                size="md"
            >
                {agent && (
                    <EditAdminAgent
                        agent={agent}
                        onClose={() => setIsEditSheetOpen(false)}
                        onSuccess={() => {
                            setIsEditSheetOpen(false);
                            fetchAgents(selectedCategory, 1);
                        }}
                    />
                )}
            </SideSheet> */}
        </div>
    )
}

export default AgentStats