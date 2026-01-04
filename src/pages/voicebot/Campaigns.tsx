import { useState, useMemo, useEffect } from "react";
import {
    Plus,
    Search,
    Check,
    ChevronRight,
    Clock,
    Zap,
    Calendar,
    User,
    XCircle,
    Target,
    BarChart3,
    Activity,
    MoreHorizontal,
    Phone,
    RotateCcw,
    Wallet,
    Home,
    ArrowLeft,
    PhoneOff,
    CheckCircle2,
    AlertCircle,
    Eye,
    TrendingUp,
    Timer,
    Edit,
    BotMessageSquare,
    PlusIcon,
    Flag
} from "lucide-react";
import { SideSheet } from "@/components/SideSheet";
import { useData } from "@/contexts/DataContext";
import { toast } from "@/hooks/useToast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import voiceBotService from "@/api/voicebotService";
import { CallDetails } from "@/components/voicebot/CallDetails";
import { Loader2 } from "lucide-react";
import { AxiosRequestConfig } from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lead } from "@/types/voicebotTypes";
import { LeadDetails } from "@/components/voicebot/LeadDetails";
import AddLead from "@/components/voicebot/AddLead";
import { EditCampaign } from "@/components/voicebot/EditCampaign";
import LeadFromDb from "@/components/voicebot/LeadFromDB";

interface Campaign {
    id: string;
    name: string;
    status: "Active" | "Scheduled" | "Completed" | "Paused";
    leadsCount: number;
    agentName: string;
    startDate: string;
    endDate?: string;
    progress: number;
    settings?: {
        callsPerDay: number;
        followUps: number;
        followUpDelays: number[];
        timeZone?: string;
        startTime?: string;
        endTime?: string;
    };
}

const DUMMY_CAMPAIGNS: Campaign[] = [
    {
        id: "c1",
        name: "Q4 Sales Outreach",
        status: "Active",
        leadsCount: 150,
        agentName: "Reality - Rental Specialist",
        startDate: "2025-12-25T10:00:00Z",
        progress: 65,
        settings: {
            callsPerDay: 1,
            followUps: 2,
            followUpDelays: [5, 8]
        }
    },
    {
        id: "c2",
        name: "Healthcare Follow-up",
        status: "Scheduled",
        leadsCount: 85,
        agentName: "Reality - Consultant-Healthcare",
        startDate: "2026-01-05T09:00:00Z",
        progress: 0,
        settings: {
            callsPerDay: 1,
            followUps: 2,
            followUpDelays: [5, 8]
        }
    },
    {
        id: "c3",
        name: "Property Listing Alert",
        status: "Completed",
        leadsCount: 200,
        agentName: "Property Listing Agent",
        startDate: "2025-12-20T14:30:00Z",
        progress: 100,
        settings: {
            callsPerDay: 1,
            followUps: 2,
            followUpDelays: [5, 8]
        }
    },
    {
        id: "c4",
        name: "Annual Review Check-in",
        status: "Paused",
        leadsCount: 50,
        agentName: "Account Support",
        startDate: "2025-12-23T11:00:00Z",
        progress: 30,
        settings: {
            callsPerDay: 1,
            followUps: 2,
            followUpDelays: [5, 8]
        }
    }
];

interface TemplateConfig {
    id: string;
    value: string;
    label: string;
    description: string;
}

interface TemplateRole {
    role: string;
    icon: any;
    color: string;
    configurations: TemplateConfig[];
}


const AGENT_TEMPLATES: TemplateRole[] = [
    {
        role: "Sales",
        icon: Target,
        color: "primary",
        configurations: [
            { id: "s1", value: "outbound_sales", label: "Outbound Sales", description: "Proactive outreach to potential customers" },
            { id: "s2", value: "inbound_sales", label: "Inbound Support", description: "Handle incoming customer inquiries" },
            { id: "s3", value: "sales_followup", label: "Follow-up Agent", description: "Follow up with leads and existing customers" }
        ]
    },
    {
        role: "Finance",
        icon: Wallet,
        color: "success",
        configurations: [
            { id: "f1", value: "account_support", label: "Account Support", description: "Help with account inquiries and transactions" },
            { id: "f2", value: "loan_advisor", label: "Loan Advisor", description: "Provide loan information and guidance" },
            { id: "f3", value: "investment_consultant", label: "Investment Consultant", description: "Investment and portfolio management guidance" }
        ]
    },
    {
        role: "Realty",
        icon: Home,
        color: "accent",
        configurations: [
            { id: "r1", value: "property_listing", label: "Property Listing Agent", description: "Help clients list properties for sale or rent" },
            { id: "r2", value: "buyer_agent", label: "Buyer's Agent", description: "Assist buyers in finding properties" },
            { id: "r3", value: "rental_specialist", label: "Rental Specialist", description: "Specialize in rental property services" }
        ]
    }
];


export default function Campaigns() {
    const [isCampaignSheetOpen, setIsCampaignSheetOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);

    // API Agents & Leads State
    const [apiAgents, setApiAgents] = useState<any[]>([]);
    const [apiLeads, setApiLeads] = useState<any[]>([]);
    const [agentsLoading, setAgentsLoading] = useState(false);
    const [leadsLoading, setLeadsLoading] = useState(false);

    // Campaign List State
    const [campaigns, setCampaigns] = useState<Campaign[]>(DUMMY_CAMPAIGNS);
    const [agentTemplates, setAgentTemplates] = useState<TemplateRole[]>(AGENT_TEMPLATES);
    const [linkNumbers, setLinkNumbers] = useState<string[]>(["+919876543210", "+919876543211", "+919876543212", "+919876543213", "+919876543214"]);
    const [linkNumbersLoading, setLinkNumbersLoading] = useState(false);
    const [linkedNumber, setLinkedNumber] = useState<string>("")

    const [searchTerm, setSearchTerm] = useState("");

    // Create Campaign Form State
    const [campaignName, setCampaignName] = useState("");
    const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
    const [selectedAgent, setSelectedAgent] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [maxRetries, setMaxRetries] = useState(3);
    const [callsPerDay, setCallsPerDay] = useState(5);
    const [followUps, setFollowUps] = useState(1);
    const [followUpDelays, setFollowUpDelays] = useState<number[]>([1]);
    const [timeZone, setTimeZone] = useState("UTC");
    const [startTime, setStartTime] = useState("09:00");
    const [endTime, setEndTime] = useState("17:00");
    const [selectedDays, setSelectedDays] = useState<string[]>(["Mon", "Tue", "Wed", "Thu", "Fri"]);

    // Agent Selection Type & Template State
    const [agentSelectionTab, setAgentSelectionTab] = useState<"existing" | "templates">("templates");
    const [templateStep, setTemplateStep] = useState<"select-template" | "link-number">("select-template");
    const [selectedTemplateRole, setSelectedTemplateRole] = useState<TemplateRole | null>(null);
    const [selectedTemplateConfig, setSelectedTemplateConfig] = useState<TemplateConfig | null>(null);

    // Selected Campaign Detail State
    const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
    const [isAddLeadSheetOpen, setIsAddLeadSheetOpen] = useState(false);
    const [isEditCampaignSheetOpen, setIsEditCampaignSheetOpen] = useState(false);


    // Call Detail View State
    const [selectedCallForDetail, setSelectedCallForDetail] = useState<any>(null);
    const [isCallDetailSheetOpen, setIsCallDetailSheetOpen] = useState(false);
    const [callDetailLoadingId, setCallDetailLoadingId] = useState<string | null>(null);

    const [templates, setTemplates] = useState<any | null>(null);
    const [templatesLoading, setTemplatesLoading] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);

    // Column Visibility State
    const [visibleColumns, setVisibleColumns] = useState({
        email: true,
        name: true,
        company: true,
        phone: true,
        expertise: true,
        lastCalled: true
    });


    const CAMPAIGN_STATS = {
        totalCalls: 1250,
        successCalls: 850,
        failedCalls: 120,
        notConnectedCalls: 280,
        avgDuration: "2m 15s",
        successRate: "68%",
        connectedLeads: "970",
        conversionRate: "24%"
    };

    const CAMPAIGN_CALLS = [
        { id: "call1", vapiId: "mock-vapi-1", phoneNumber: "+1 (555) 123-4567", status: "Completed", duration: "2m 30s", date: "2025-12-28 10:30 AM" },
        { id: "call2", vapiId: "mock-vapi-2", phoneNumber: "+1 (555) 987-6543", status: "Failed", duration: "0m 45s", date: "2025-12-28 11:15 AM" },
        { id: "call3", vapiId: "mock-vapi-3", phoneNumber: "+1 (555) 456-7890", status: "Not Connected", duration: "0m 00s", date: "2025-12-28 12:00 PM" },
        { id: "call4", vapiId: "mock-vapi-4", phoneNumber: "+1 (555) 234-5678", status: "Completed", duration: "1m 15s", date: "2025-12-28 01:45 PM" },
        { id: "call5", vapiId: "mock-vapi-5", phoneNumber: "+1 (555) 876-5432", status: "Completed", duration: "3m 20s", date: "2025-12-28 02:30 PM" },
    ];

    const Campaign_Leads = [
        {
            id: "e74b2bda-8b4f-49b9-80e0-50f10dba2993",
            userId: "e14d0d6e-d081-462b-ab44-382758738b92",
            sourceFileId: "dc501c5f-699f-4cc7-9dea-a254dc0b2bae",
            sourceGcsKey: "e14d0d6e-d081-462b-ab44-382758738b92/database/files/leads_data.xlsx",
            leadName: "Shellen",
            leadPhoneNumber: "+1-555-0123",
            leadEmail: "sarah.j@vertexsolutions.com",
            lastCalledAt: "2025-12-26T14:30:00",
            leadCompany: "Vertex Solutions",
            leadExpertiseDomain: "SaaS Sales",
            createdAt: "2025-12-27T14:39:47.256",
            updatedAt: "2025-12-27T14:39:47.256"
        },
        {
            id: "3b1434eb-0a52-4b58-8f15-3b50a88ed946",
            userId: "e14d0d6e-d081-462b-ab44-382758738b92",
            sourceFileId: "495664c5-b9d6-4cc6-bd33-bbbf01063863",
            sourceGcsKey: "e14d0d6e-d081-462b-ab44-382758738b92/database/files/leads_data.xlsx",
            leadName: "John Doe",
            leadPhoneNumber: "+1-555-0123",
            leadEmail: "sarah.j@vertexsolutions.com",
            lastCalledAt: "2025-12-26T14:30:00",
            leadCompany: "Vertex Solutions",
            leadExpertiseDomain: "SaaS Sales",
            createdAt: "2025-12-27T14:17:18.496",
            updatedAt: "2025-12-27T14:17:18.496"
        },
        {
            id: "6d47e6c5-3d9f-4197-97c3-85435b2fcd97",
            userId: "e14d0d6e-d081-462b-ab44-382758738b92",
            sourceFileId: "78efe98c-2190-40f6-8231-71dd4cfc7896",
            sourceGcsKey: "e14d0d6e-d081-462b-ab44-382758738b92/database/files/leads_data.xlsx",
            leadName: "Rajesh Kumar",
            leadPhoneNumber: "+91-98765-43210",
            leadEmail: "rajesh.k@innovatefin.in",
            lastCalledAt: "2025-12-24T10:15:00",
            leadCompany: "InnovateFin",
            leadExpertiseDomain: "Fintech",
            createdAt: "2025-12-27T12:16:33.911",
            updatedAt: "2025-12-27T12:16:33.911"
        },
        {
            id: "24425da7-b613-4a9d-8c89-a2fd789fd091",
            userId: "e14d0d6e-d081-462b-ab44-382758738b92",
            sourceFileId: "78efe98c-2190-40f6-8231-71dd4cfc7896",
            sourceGcsKey: "e14d0d6e-d081-462b-ab44-382758738b92/database/files/leads_data.xlsx",
            leadName: "Elena Rodriguez",
            leadPhoneNumber: "+34-91-555-0199",
            leadEmail: "elena.rod@greenscape.es",
            lastCalledAt: "2025-12-27T09:45:00",
            leadCompany: "GreenScape",
            leadExpertiseDomain: "Renewable Energy",
            createdAt: "2025-12-27T12:16:33.911",
            updatedAt: "2025-12-27T12:16:33.911"
        },

    ]

    const fetchAgents = async () => {
        setAgentsLoading(true);
        try {
            const response = await voiceBotService.getAllAgents({});
            if (response && response.agents) {
                setApiAgents(response.agents);
            }
        } catch (error) {
            console.error("Failed to fetch agents:", error);
            toast.danger("Failed to load agents. Please try again.");
        } finally {
            setAgentsLoading(false);
        }
    };

    const fetchLeads = async () => {
        setLeadsLoading(true);
        try {
            // Fetching a large page size for campaign selection, or we could implement proper pagination/search later
            const response = await voiceBotService.getLeadDatabaseData({ page: 1, page_size: 100 }, {});
            if (response && response.leads) {
                setApiLeads(response.leads);
            }
        } catch (error) {
            console.error("Failed to fetch leads:", error);
            toast.danger("Failed to load leads. Please try again.");
        } finally {
            setLeadsLoading(false);
        }
    };

    useEffect(() => {
        fetchAgents();
        fetchLeads();
    }, []);

    const handleViewCallDetails = async (call: any) => {
        if (!call.vapiId) return;

        // If it's a mock ID, we can show mock data
        if (call.vapiId.startsWith('mock-vapi-')) {
            setSelectedCallForDetail({
                vapiId: call.vapiId,
                customerNumber: call.phoneNumber,
                status: call.status,
                startedAt: new Date().toISOString(),
                summary: "This is a mock summary for a campaign call outreach. The candidate expressed interest in the property listing and requested a follow-up email with more details.",
                messages: [
                    { role: "bot", message: "Hello! This is a follow-up call regarding the property listing you viewed.", secondsFromStart: 2 },
                    { role: "user", message: "Oh hi, yes I remember. Can you tell me more about the pricing?", secondsFromStart: 10 },
                    { role: "bot", message: "Certainly! The current asking price is $450,000, and it's open to negotiation.", secondsFromStart: 18 },
                    { role: "user", message: "That sounds interesting. Could you send me an email with the details?", secondsFromStart: 25 },
                    { role: "bot", message: "Of course, I'll send that right away to your registered email address.", secondsFromStart: 32 }
                ]
            });
            setIsCallDetailSheetOpen(true);
            return;
        }

        try {
            setCallDetailLoadingId(call.id);
            const response = await voiceBotService.getCallDetail(call.vapiId, {});
            setSelectedCallForDetail(response);
            setIsCallDetailSheetOpen(true);
        } catch (error) {
            console.error("Failed to fetch call details:", error);
            toast.danger("Failed to load call details");
        } finally {
            setCallDetailLoadingId(null);
        }
    };

    // Filtering for Leads in Sidesheet
    const [leadSearchText, setLeadSearchText] = useState("");
    const [leadColumnFilter, setLeadColumnFilter] = useState("all");

    const filteredLeads = useMemo(() => {
        return apiLeads.filter((lead: any) => {
            const searchLower = leadSearchText.toLowerCase();
            if (leadColumnFilter === "all") {
                return (
                    lead.leadName.toLowerCase().includes(searchLower) ||
                    lead.leadEmail.toLowerCase().includes(searchLower) ||
                    lead.leadCompany.toLowerCase().includes(searchLower)
                );
            }
            if (leadColumnFilter === "name") return lead.leadName.toLowerCase().includes(searchLower);
            if (leadColumnFilter === "email") return lead.leadEmail.toLowerCase().includes(searchLower);
            if (leadColumnFilter === "company") return lead.leadCompany.toLowerCase().includes(searchLower);
            return true;
        });
    }, [apiLeads, leadSearchText, leadColumnFilter]);

    const handleSelectLead = (id: string) => {
        setSelectedLeads(prev =>
            prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
        );
    };

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const resetForm = () => {
        setIsCampaignSheetOpen(false);
        setCurrentStep(1);
        setCampaignName("");
        setSelectedLeads([]);
        setSelectedAgent("");
        setAgentSelectionTab("existing");
        setTemplateStep("select-template");
        setSelectedTemplateRole(null);
        setSelectedTemplateConfig(null);
        setStartDate("");
        setEndDate("");
        setMaxRetries(3);
        setCallsPerDay(5);
        setFollowUps(1);
        setFollowUpDelays([1]);
        setTimeZone("UTC");
        setStartTime("09:00");
        setEndTime("17:00");
        setSelectedDays(["Mon", "Tue", "Wed", "Thu", "Fri"]);
        setLeadSearchText("");
    };

    const handleLaunch = () => {
        const newCampaign: Campaign = {
            id: `c${campaigns.length + 1}`,
            name: campaignName,
            status: "Scheduled",
            leadsCount: selectedLeads.length,
            agentName: agentSelectionTab === "existing"
                ? (apiAgents.find((a: any) => a.vapiId === selectedAgent)?.name || "Unknown Agent")
                : (selectedTemplateConfig?.label || "Unknown Agent"),
            startDate: startDate || new Date().toISOString(),
            endDate: endDate,
            progress: 0,
            settings: {
                callsPerDay: callsPerDay,
                followUps: followUps,
                followUpDelays: followUpDelays,
                timeZone: timeZone,
                startTime: startTime,
                endTime: endTime,
            }
        };
        setCampaigns([newCampaign, ...campaigns]);
        toast.success("Campaign launched successfully!");
        resetForm();
    };

    const getAgentTemplates = async (page: number = 1, pageSize: number = 10) => {
        try {
            setTemplatesLoading(true);
            const config: AxiosRequestConfig = {
                params: {
                    page,
                    page_size: pageSize
                }
            };
            const response = await voiceBotService.getAgentTemplates(config);
            console.log(response);
            setTemplates(response);
        } catch (error) {
            // console.log(error);
            toast.danger("Failed to fetch agent templates");
        }
        finally {
            setTemplatesLoading(false);
        }
    }


    const selectLead = () => {
        setIsDetailSheetOpen(true);
        setSelectedLead({
            id: "e74b2bda-8b4f-49b9-80e0-50f10dba2993",
            userId: "e14d0d6e-d081-462b-ab44-382758738b92",
            sourceFileId: "dc501c5f-699f-4cc7-9dea-a254dc0b2bae",
            sourceGcsKey: "e14d0d6e-d081-462b-ab44-382758738b92/database/files/leads_data.xlsx",
            leadName: "Shellen",
            leadPhoneNumber: "+1-555-0123",
            leadEmail: "sarah.j@vertexsolutions.com",
            lastCalledAt: "2025-12-26T14:30:00",
            leadCompany: "Vertex Solutions",
            leadExpertiseDomain: "SaaS Sales",
            createdAt: "2025-12-27T14:39:47.256",
            updatedAt: "2025-12-27T14:39:47.256"
        });
    }
    return (
        <>
            <div className="space-y-6">
                {!selectedCampaign ? (
                    <>
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-text-main">Campaigns</h1>
                                <p className="text-text-muted mt-1">Monitor and manage your automated calling campaigns</p>
                            </div>
                            <button
                                onClick={() => setIsCampaignSheetOpen(true)}
                                className="btn btn-primary flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Create Campaign
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="card p-6 border border-border-subtle hover:shadow-glow transition-all">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                        <Target className="w-5 h-5" />
                                    </div>
                                    <span className="text-[10px] font-bold text-success uppercase tracking-wider">+12%</span>
                                </div>
                                <div className="text-2xl font-bold text-text-main">12</div>
                                <div className="text-xs text-text-muted mt-1">Total Campaigns</div>
                            </div>
                            <div className="card p-6 border border-border-subtle hover:shadow-glow transition-all">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="p-2 bg-accent/10 rounded-lg text-accent">
                                        <Activity className="w-5 h-5" />
                                    </div>
                                    <span className="text-[10px] font-bold text-success uppercase tracking-wider">+5%</span>
                                </div>
                                <div className="text-2xl font-bold text-text-main">4</div>
                                <div className="text-xs text-text-muted mt-1">Active Now</div>
                            </div>
                            <div className="card p-6 border border-border-subtle hover:shadow-glow transition-all">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="p-2 bg-success/10 rounded-lg text-success">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                </div>
                                <div className="text-2xl font-bold text-text-main">1,280</div>
                                <div className="text-xs text-text-muted mt-1">Calls Made</div>
                            </div>
                            <div className="card p-6 border border-border-subtle hover:shadow-glow transition-all">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="p-2 bg-warning/10 rounded-lg text-warning">
                                        <BarChart3 className="w-5 h-5" />
                                    </div>
                                </div>
                                <div className="text-2xl font-bold text-text-main">34%</div>
                                <div className="text-xs text-text-muted mt-1">Avg. Conversion</div>
                            </div>
                        </div>

                        <div className="card p-6 border border-border-subtle shadow-soft overflow-hidden">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                <h3 className="text-sm font-bold text-text-main uppercase tracking-widest">Campaign List</h3>
                                <div className="relative w-full md:w-80">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                    <input
                                        type="text"
                                        placeholder="Search campaigns..."
                                        className="w-full pl-10 pr-4 py-2 bg-bg/50 border border-border-subtle rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-border-subtle bg-bg/30">
                                            <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider ">Campaign Name</th>
                                            <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider ">Status</th>
                                            <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider ">Leads</th>
                                            <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider ">Agent</th>
                                            <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider ">Start Date</th>
                                            <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider ">Progress</th>
                                            <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider  text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border-subtle">
                                        {campaigns.map((camp) => (
                                            <tr
                                                key={camp.id}
                                                className="group hover:bg-bg/40 transition-colors"
                                            >
                                                <td className="py-4 px-4">
                                                    <div className="text-sm font-bold text-text-main">{camp.name}</div>
                                                    <div className="text-[10px] text-text-muted mt-0.5 whitespace-nowrap">ID: {camp.id}</div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${camp.status === 'Active' ? 'bg-success/10 text-success border border-success/20' :
                                                        camp.status === 'Scheduled' ? 'bg-primary/10 text-primary border border-primary/20' :
                                                            camp.status === 'Paused' ? 'bg-warning/10 text-warning border border-warning/20' :
                                                                'bg-bg-alt text-text-muted border border-border-subtle'
                                                        }`}>
                                                        {camp.status}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 text-xs font-medium text-text-main">{camp.leadsCount}</td>
                                                <td className="py-4 px-4 text-xs text-text-muted">{camp.agentName}</td>
                                                <td className="py-4 px-4 text-xs text-text-muted">{new Date(camp.startDate).toLocaleDateString()}</td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex-1 min-w-[60px] h-1.5 bg-border-subtle rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full transition-all duration-500 ${camp.status === 'Active' ? 'bg-primary' : 'bg-text-muted/30'}`}
                                                                style={{ width: `${camp.progress}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-[10px] font-bold text-text-main">{camp.progress}%</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 text-right">
                                                    <button className="p-2 hover:bg-primary/10 rounded-lg transition-all cursor-pointer"

                                                        onClick={() => setSelectedCampaign(camp)}

                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        {/* Selected Campaign Header */}
                        <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setSelectedCampaign(null)}
                                    className="p-2 hover:bg-bg-alt rounded-xl border border-border-subtle text-text-muted hover:text-primary transition-all active:scale-95"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h1 className="text-3xl font-bold text-text-main">{selectedCampaign.name}</h1>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${selectedCampaign.status === 'Active' ? 'bg-success/10 text-success border border-success/20' :
                                            selectedCampaign.status === 'Scheduled' ? 'bg-primary/10 text-primary border border-primary/20' :
                                                selectedCampaign.status === 'Paused' ? 'bg-warning/10 text-warning border border-warning/20' :
                                                    'bg-bg-alt text-text-muted border border-border-subtle'
                                            }`}>
                                            {selectedCampaign.status}
                                        </span>
                                    </div>
                                    {/* <p className="text-text-muted mt-1 flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        Created on {new Date(selectedCampaign.startDate).toLocaleDateString()}
                                    </p> */}
                                </div>
                            </div>
                            {/* <div className="flex items-center gap-3">
                                <button className="btn btn-primary flex items-center gap-2">
                                    <Edit className="w-4 h-4" />
                                    Edit Campaign
                                </button>
                            </div> */}
                        </div>

                        {/* Enhanced Campaign Progress & Timeline Card */}
                        <div className="card rounded-2xl p-8 border border-border-subtle bg-gradient-to-br from-white via-white to-primary/5 shadow-soft hover:shadow-glow transition-all duration-500 overflow-hidden relative group">
                            {/* Decorative background gradients */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-primary/10 transition-colors duration-700" />
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/5 rounded-full blur-3xl -ml-24 -mb-24" />

                            <div className="relative z-10">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                                    {/* Left: Date Comparison & Timeline */}
                                    <div className="flex-1 space-y-6">
                                        <div className="flex items-center justify-between px-1">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">
                                                    <Calendar className="w-3 h-3 text-primary" />
                                                    Start Date
                                                </div>
                                                <div className="text-sm font-bold text-text-main">{new Date(selectedCampaign.startDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                                            </div>

                                            <div className="text-center group-hover:scale-110 transition-transform duration-500">
                                                <div className="inline-flex items-center justify-center p-2 rounded-xl bg-primary-soft/30 border border-primary-soft/50 text-primary">
                                                    <Zap className="w-5 h-5 animate-pulse" />
                                                </div>
                                                <div className="mt-1 text-[8px] font-black text-primary uppercase tracking-tighter">Running</div>
                                            </div>

                                            <div className="text-right space-y-1">
                                                <div className="flex items-center gap-2 justify-end text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">
                                                    End Date (Est.)
                                                    <Flag className="w-3 h-3 text-accent" />
                                                </div>
                                                <div className="text-sm font-bold text-text-main">
                                                    {selectedCampaign.endDate
                                                        ? new Date(selectedCampaign.endDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
                                                        : new Date(new Date(selectedCampaign.startDate).getTime() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
                                                    }
                                                </div>
                                            </div>
                                        </div>

                                        {/* Visualization of timeline */}
                                        <div className="relative pt-4 pb-2">
                                            <div className="h-2 w-full bg-bg-alt rounded-full overflow-hidden border border-border-subtle/50">
                                                <div
                                                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000 ease-out"
                                                    style={{ width: `${Math.min(100, Math.max(0, ((new Date().getTime() - new Date(selectedCampaign.startDate).getTime()) / ((selectedCampaign.endDate ? new Date(selectedCampaign.endDate).getTime() : new Date(selectedCampaign.startDate).getTime() + 14 * 24 * 60 * 60 * 1000) - new Date(selectedCampaign.startDate).getTime())) * 100))}%` }}
                                                />
                                            </div>

                                            {/* Today Marker */}
                                            <div
                                                className="absolute top-0 flex flex-col items-center -translate-x-1/2 transition-all duration-1000 ease-out"
                                                style={{ left: `${Math.min(95, Math.max(5, ((new Date().getTime() - new Date(selectedCampaign.startDate).getTime()) / ((selectedCampaign.endDate ? new Date(selectedCampaign.endDate).getTime() : new Date(selectedCampaign.startDate).getTime() + 14 * 24 * 60 * 60 * 1000) - new Date(selectedCampaign.startDate).getTime())) * 100))}%` }}
                                            >
                                                <div className="text-[9px] font-black text-primary bg-primary-soft/50 px-2 py-0.5 rounded-full border border-primary-soft/50 mb-1 backdrop-blur-sm">TODAY</div>
                                                <div className="w-0.5 h-6 bg-primary" />
                                            </div>

                                            <div className="flex justify-between mt-4">
                                                <div className="text-[10px] font-bold text-text-muted flex items-center gap-1.5 bg-bg/50 px-2 py-1 rounded-lg border border-border-subtle/30">
                                                    <Clock className="w-3 h-3 text-primary/60" />
                                                    {Math.max(0, Math.floor((new Date().getTime() - new Date(selectedCampaign.startDate).getTime()) / (1000 * 60 * 60 * 24)))} days elapsed
                                                </div>
                                                <div className="text-[10px] font-bold text-text-muted flex items-center gap-1.5 bg-bg/50 px-2 py-1 rounded-lg border border-border-subtle/30">
                                                    {Math.max(0, Math.ceil(((selectedCampaign.endDate ? new Date(selectedCampaign.endDate).getTime() : new Date(selectedCampaign.startDate).getTime() + 14 * 24 * 60 * 60 * 1000) - new Date().getTime()) / (1000 * 60 * 60 * 24)))} days remaining
                                                    <Timer className="w-3 h-3 text-accent/60" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Middle: Vertical Divider for LG screen */}
                                    <div className="hidden lg:block w-px h-24 bg-gradient-to-b from-transparent via-border-subtle to-transparent mx-8 opacity-50" />

                                    {/* Right: Progression Metrics */}
                                    <div className="w-full lg:w-80 space-y-6">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Campaign Progress</h4>
                                            <span className="text-sm font-black text-success tabular-nums">{selectedCampaign.progress}%</span>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="w-full h-4 bg-bg-alt rounded-2xl overflow-hidden border border-border-subtle/30 p-1">
                                                <div
                                                    className="h-full bg-gradient-to-r from-success/60 to-success rounded-xl shadow-[0_0_10px_rgba(34,197,94,0.3)] transition-all duration-1000 ease-in-out"
                                                    style={{ width: `${selectedCampaign.progress}%` }}
                                                />
                                            </div>
                                            <div className="flex justify-between px-1">
                                                <div className="flex flex-col">
                                                    <span className="text-xl font-black text-text-main tabular-nums">
                                                        {Math.round((selectedCampaign.progress / 100) * selectedCampaign.leadsCount)}
                                                    </span>
                                                    <span className="text-[9px] font-bold text-success uppercase tracking-wider mt-0.5">Contacted</span>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-xl font-black text-text-muted tabular-nums">
                                                        {selectedCampaign.leadsCount - Math.round((selectedCampaign.progress / 100) * selectedCampaign.leadsCount)}
                                                    </span>
                                                    <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider mt-0.5">Remaining</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Selected Campaign Stats */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-4">
                                {[
                                    { label: "Total Calls", value: CAMPAIGN_STATS.totalCalls, icon: Phone, color: "primary" },
                                    { label: "Success", value: CAMPAIGN_STATS.successCalls, icon: CheckCircle2, color: "success" },
                                    { label: "Failed", value: CAMPAIGN_STATS.failedCalls, icon: XCircle, color: "danger" },
                                    { label: "Not Connected", value: CAMPAIGN_STATS.notConnectedCalls, icon: PhoneOff, color: "warning" },
                                    { label: "Avg Duration", value: CAMPAIGN_STATS.avgDuration, icon: Timer, color: "accent" },
                                    { label: "Success Rate", value: CAMPAIGN_STATS.successRate, icon: TrendingUp, color: "success" },
                                    { label: "Connected", value: CAMPAIGN_STATS.connectedLeads, icon: User, color: "primary" },
                                    { label: "Conversion", value: CAMPAIGN_STATS.conversionRate, icon: BarChart3, color: "success" },
                                ].map((stat, i) => (
                                    <div key={i} className="card flex items-center justify-between rounded-xl p-6 border border-border-subtle hover:shadow-glow hover:-translate-y-0.5 transition-all">

                                        <div>
                                            <div className="text-lg font-bold text-text-main leading-tight">{stat.value}</div>
                                            <div className="text-[10px] text-text-muted uppercase tracking-wider mt-1">{stat.label}</div>
                                        </div>
                                        <div className={`p-2 bg-${stat.color}/10 text-${stat.color} rounded-lg w-fit mb-2`}>
                                            <stat.icon className="w-6 h-6" />
                                        </div>

                                    </div>
                                ))}
                            </div>
                            <div className="lg:col-span-1 space-y-6">
                                <div className="card p-6 border border-border-subtle shadow-soft h-full">
                                    <h3 className="text-sm font-bold text-text-main uppercase tracking-widest mb-6">Campaign Information</h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center py-2 border-b border-border-subtle/50">
                                            <span className="text-xs text-text-muted">Agent</span>
                                            <span className="text-xs font-bold text-text-main">{selectedCampaign.agentName}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-border-subtle/50">
                                            <span className="text-xs text-text-muted">Target Leads</span>
                                            <span className="text-xs font-bold text-text-main">{selectedCampaign.leadsCount}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-border-subtle/50">
                                            <span className="text-xs text-text-muted">Linked Number</span>
                                            <span className="text-xs font-bold text-text-main">+91 98765 43210</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-border-subtle/50">
                                            <span className="text-xs text-text-muted">Calls per Day</span>
                                            <span className="text-xs font-bold text-text-main">{selectedCampaign.settings?.callsPerDay || 50}</span>
                                        </div>
                                        <div className="flex flex-col py-2 border-b border-border-subtle/50">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-text-muted">Follow Ups</span>
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-xs font-bold text-text-main text-right">2 Follow Ups</span>
                                                    <span className="text-xs text-text-muted text-right">Days: 5, 8</span>
                                                </div>
                                            </div>

                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-border-subtle/50">
                                            <span className="text-xs text-text-muted">Time Window</span>
                                            <span className="text-xs font-bold text-text-main">{selectedCampaign.settings?.startTime || '09:00'} - {selectedCampaign.settings?.endTime || '18:00'}</span>
                                        </div>
                                        <div>
                                            <button
                                                onClick={() => setIsEditCampaignSheetOpen(true)}
                                                className="btn btn-primary w-full rounded-full"
                                            >
                                                <Edit className="w-4 h-4" /> Edit Campaign
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div className="card rounded-xl p-6 border border-border-subtle hover:shadow-glow transition-all">
                            {/* Calls Table */}

                            <Tabs defaultValue="leads" className="w-full">
                                <TabsList className="bg-primary-soft/50 p-1 mb-2">
                                    <TabsTrigger value="leads" className="px-6">Leads</TabsTrigger>
                                    <TabsTrigger value="calls" className="px-6">Calls History</TabsTrigger>
                                </TabsList>
                                <TabsContent value="leads">
                                    <div className="flex flex-col md:flex-row md:items-center gap-4 my-1 px-2">
                                        <div className="relative flex-1">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                            <input
                                                type="text"
                                                placeholder="Search leads..."
                                                className="w-full pl-10 pr-4 py-2 bg-bg/50 border border-border-subtle rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                            // value={searchTerm}
                                            // onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                        <div className="">
                                            <button className="btn btn-primary rounded-full"
                                                onClick={() => setIsAddLeadSheetOpen(true)}
                                            ><PlusIcon className="w-4 h-4" /> Add Lead</button>
                                        </div>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-border-subtle">
                                                    <th className="py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Sr.No.</th>
                                                    {visibleColumns.email && <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Email</th>}
                                                    {visibleColumns.name && <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Full Name</th>}
                                                    {visibleColumns.company && <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Company</th>}
                                                    {visibleColumns.phone && <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Phone</th>}
                                                    {visibleColumns.expertise && <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Expertise</th>}
                                                    {<th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Call Time</th>}

                                                    {/* {visibleColumns.lastCalled && <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Last Called</th>} */}
                                                    <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Actions</th>

                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border-subtle/50">
                                                {Campaign_Leads.map((user, i) => (
                                                    <tr key={user.id} className={`hover:bg-bg-alt/30 transition-colors`}>
                                                        <td className="py-4 px-3 text-center text-xs text-text-muted">{i + 1}</td>
                                                        {visibleColumns.email && <td className="py-4 px-3 text-sm text-text-main font-medium">{user.leadEmail}</td>}
                                                        {visibleColumns.name && <td className="py-4 px-3 text-sm text-text-muted">{user.leadName}</td>}
                                                        {visibleColumns.company && <td className="py-4 px-3 text-sm text-text-muted">{user.leadCompany}</td>}
                                                        {visibleColumns.phone && <td className="py-4 px-3 text-sm text-text-muted">{user.leadPhoneNumber}</td>}
                                                        {visibleColumns.expertise && (
                                                            <td className="py-4 px-3">
                                                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-bg-alt text-text-muted`}>
                                                                    {user.leadExpertiseDomain}
                                                                </span>
                                                            </td>
                                                        )}
                                                        {<td className="py-4 px-3 text-sm text-text-muted">
                                                            {new Date().toLocaleString()}
                                                        </td>}
                                                        {/* {visibleColumns.lastCalled && <td className="py-4 px-3 text-sm text-text-muted">
                                                            {user.lastCalledAt ? new Date(user.lastCalledAt).toLocaleString() : 'Never'}
                                                        </td>} */}
                                                        <td className="py-4 px-3 text-sm text-text-muted">
                                                            <button
                                                                // onClick={() => {
                                                                //     setSelectedLead(user);
                                                                //     setIsDetailSheetOpen(true);
                                                                // }}
                                                                onClick={selectLead}
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
                                </TabsContent>
                                <TabsContent value="calls">
                                    <div className="overflow-x-auto">
                                        <div className="overflow-hidden">
                                            <div className="flex flex-col md:flex-row md:items-center justify-end gap-4 my-1 px-2">
                                                <div className="relative w-full md:w-80">
                                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                                    <input
                                                        type="text"
                                                        placeholder="Search calls..."
                                                        className="w-full pl-10 pr-4 py-2 bg-bg/50 border border-border-subtle rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                                    // value={searchTerm}
                                                    // onChange={(e) => setSearchTerm(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-left">
                                                    <thead>
                                                        <tr className="border-b border-border-subtle bg-bg/30">
                                                            <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Phone Number</th>
                                                            <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Status</th>
                                                            <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Duration</th>
                                                            <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Date</th>
                                                            <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-border-subtle">
                                                        {CAMPAIGN_CALLS.map((call) => (
                                                            <tr key={call.id} className="group hover:bg-bg/40 transition-colors">
                                                                <td className="py-4 px-4 text-xs font-bold text-text-main">{call.phoneNumber}</td>
                                                                <td className="py-4 px-4">
                                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${call.status === 'Completed' ? 'bg-success/10 text-success border border-success/20' :
                                                                        call.status === 'Failed' ? 'bg-danger/10 text-danger border border-danger/20' :
                                                                            'bg-warning/10 text-warning border border-warning/20'
                                                                        }`}>
                                                                        {call.status}
                                                                    </span>
                                                                </td>
                                                                <td className="py-4 px-4 text-xs text-text-muted">{call.duration}</td>
                                                                <td className="py-4 px-4 text-xs text-text-muted">{call.date}</td>
                                                                <td className="py-4 px-4">
                                                                    <button
                                                                        className="p-2 hover:bg-primary/10 rounded-lg transition-all text-text-muted hover:text-primary active:scale-90 flex items-center gap-2  group/btn"
                                                                        onClick={() => handleViewCallDetails(call)}
                                                                        disabled={!!callDetailLoadingId}
                                                                    >
                                                                        {callDetailLoadingId === call.id ? (
                                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                                        ) : (
                                                                            <Eye className="w-4 h-4" />
                                                                        )}
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>

                                        </div>
                                    </div>
                                </TabsContent>


                            </Tabs>

                            {/* Campaign Info Card */}



                        </div>
                    </div>
                )}
            </div>
            {/* Create Campaign Sidesheet */}
            <SideSheet
                isOpen={isCampaignSheetOpen}
                onClose={resetForm}
                title="Create New Campaign"
                size="md"
            >
                <div className="flex flex-col h-full">
                    {/* Stepper */}
                    <div className="flex items-center justify-between mb-8 px-2 relative">
                        {[1, 2, 3, 4].map((step) => (
                            <div key={step} className="flex flex-col items-center z-10">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${currentStep === step ? 'bg-primary text-white scale-110 shadow-glow' :
                                    currentStep > step ? 'bg-success text-white' : 'bg-bg-alt text-text-muted'
                                    }`}>
                                    {currentStep > step ? <Check className="w-4 h-4" /> : step}
                                </div>
                                <span className="text-[10px] mt-2 font-bold uppercase tracking-wider text-text-muted text-center">
                                    {step === 1 ? 'Leads' : step === 2 ? 'Agent' : step === 3 ? 'Settings' : 'Review'}
                                </span>
                            </div>
                        ))}
                        <div className="absolute top-4 left-6 right-6 h-0.5 bg-bg-alt -z-0">
                            <div
                                className="h-full bg-primary transition-all duration-300"
                                style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {currentStep === 1 && (
                            <div className="space-y-6 px-2 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-sm font-bold text-text-main tracking-tight">Select Target Leads</h3>
                                            <p className="text-[10px] text-text-muted mt-0.5">Pick existing leads from your database</p>
                                        </div>
                                        <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{selectedLeads.length} selected</span>
                                    </div>

                                    <div className="flex flex-col md:flex-row gap-2">
                                        <div className="relative w-[50%]">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                            <input
                                                type="text"
                                                placeholder="Search leads..."
                                                className="w-full pl-10 pr-4 py-2 bg-bg border border-border-subtle rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                                value={leadSearchText}
                                                onChange={(e) => setLeadSearchText(e.target.value)}
                                            />
                                        </div>
                                        <div className="w-[50%]">
                                            <Select
                                                value={leadColumnFilter}
                                                onValueChange={(value) => setLeadColumnFilter(value)}

                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a column" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All Fields</SelectItem>
                                                    <SelectItem value="name">Name</SelectItem>
                                                    <SelectItem value="email">Email</SelectItem>
                                                    <SelectItem value="company">Company</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-2 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                                        {leadsLoading ? (
                                            <div className="space-y-3">
                                                {[1, 2, 3, 4, 5].map((i) => (
                                                    <div key={i} className="h-16 bg-bg animate-pulse rounded-2xl border border-border-subtle" />
                                                ))}
                                            </div>
                                        ) : filteredLeads.length > 0 ? filteredLeads.map((user: any) => (
                                            <div
                                                key={user.id}
                                                onClick={() => handleSelectLead(user.id)}
                                                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${selectedLeads.includes(user.leadEmail)
                                                    ? 'border-primary bg-primary/5 ring-1 ring-primary/20 shadow-sm'
                                                    : 'border-border-subtle hover:border-text-muted/30 bg-white'
                                                    }`}
                                            >
                                                <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${selectedLeads.includes(user.id) ? 'bg-primary border-primary rotate-0' : 'border-border-subtle rotate-45'
                                                    }`}>
                                                    {selectedLeads.includes(user.id) && <Check className="w-3.5 h-3.5 text-white" />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-xs font-bold text-text-main truncate">{user.leadName}</div>
                                                    <div className="text-[10px] text-text-muted truncate flex items-center gap-2 mt-0.5">
                                                        <span>{user.leadEmail}</span>
                                                        <span className="w-1 h-1 bg-text-muted/30 rounded-full" />
                                                        <span>{user.leadCompany}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="py-20 text-center bg-bg/30 rounded-3xl border border-dashed border-border-subtle">
                                                <Search className="w-10 h-10 text-text-muted mx-auto mb-2 opacity-20" />
                                                <p className="text-xs text-text-muted">No leads found matching your search</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="space-y-6 px-2 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-text-main flex items-center gap-2">
                                        Campaign Name
                                        <span className="text-[10px] font-normal text-primary bg-primary/10 px-1.5 py-0.5 rounded">Required</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Q4 Sales Outreach"
                                        className="w-full px-4 py-3 bg-bg border border-border-subtle rounded-xl text-sm focus:ring-1 focus:ring-primary focus:outline-none placeholder:text-text-muted/30 shadow-sm"
                                        value={campaignName}
                                        onChange={(e) => setCampaignName(e.target.value)}
                                    />
                                </div>




                                <div className="space-y-4">
                                    <div className="space-y-4 animate-in fade-in duration-300">
                                        {templateStep === "select-template" && (
                                            <div className="grid grid-cols-1 gap-4">
                                                <div>
                                                    <h3 className="text-lg font-bold text-text-main">Select Template</h3>
                                                    <p className="text-sm text-text-muted">Choose a template for your test agent.</p>
                                                </div>
                                                {
                                                    templatesLoading ? (
                                                        <div className="flex flex-col gap-4 w-full">
                                                            <Skeleton className="w-full h-20 rounded-xl" />
                                                            <Skeleton className="w-full h-20 rounded-xl" />
                                                            <Skeleton className="w-full h-20 rounded-xl" />
                                                            <Skeleton className="w-full h-20 rounded-xl" />
                                                        </div>
                                                    ) : templates?.templates?.map((template: any) => (
                                                        <button
                                                            key={template.id}
                                                            onClick={() => {
                                                                setSelectedTemplate(template);
                                                                setTemplateStep("link-number");
                                                            }}
                                                            className="group flex items-center gap-4 p-4 rounded-xl border border-border-subtle hover:border-primary hover:bg-primary/5 transition-all text-left"
                                                        >

                                                            <div className="p-2.5 bg-primary-soft rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                                                <BotMessageSquare className="w-5 h-5" />
                                                            </div>

                                                            <div>
                                                                <h4 className="text-sm font-bold text-text-main group-hover:text-primary">{template.name}</h4>
                                                                <p className="text-xs text-text-muted mt-1">{template.metadata.department[0].toUpperCase()}{template.metadata.department.slice(1)}</p>
                                                                <p className="text-xs text-text-muted mt-1">{template.language}</p>
                                                            </div>

                                                        </button>
                                                    ))
                                                }
                                            </div>
                                        )}


                                        {
                                            templateStep === "link-number" && (
                                                <div className="space-y-4">
                                                    <button
                                                        onClick={() => setTemplateStep("select-template")}
                                                        className="flex items-center gap-2 text-[10px] font-bold text-text-muted hover:text-primary transition-colors mb-2 uppercase tracking-wider"
                                                    >
                                                        <ArrowLeft className="w-3 h-3" />
                                                        Back to Select Template
                                                    </button>
                                                    <div className="grid grid-cols-1 gap-3">
                                                        <Select
                                                            value={linkedNumber}
                                                            onValueChange={setLinkedNumber}
                                                        >
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Choose a number to link" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {linkNumbers.map((number) => (
                                                                    <SelectItem key={number} value={number}>
                                                                        {number}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                            )}
                                    </div>

                                </div>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className="space-y-8 px-2 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="space-y-4">
                                    <h4 className="text-sm font-bold text-text-main flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-primary" />
                                        Campaign Duration
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest pl-1">Start Date</label>
                                            <input
                                                type="date"
                                                value={startDate}
                                                onChange={(e) => setStartDate(e.target.value)}
                                                className="w-full px-4 py-3 bg-bg border border-border-subtle rounded-xl text-sm focus:ring-1 focus:ring-primary focus:outline-none shadow-sm"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest pl-1">End Date</label>
                                            <input
                                                type="date"
                                                value={endDate}
                                                onChange={(e) => setEndDate(e.target.value)}
                                                className="w-full px-4 py-3 bg-bg border border-border-subtle rounded-xl text-sm focus:ring-1 focus:ring-primary focus:outline-none shadow-sm"
                                                disabled
                                            />
                                            <span className="text-[10px] text-text-subtle">End date will be updated automatically</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h4 className="text-sm font-bold text-text-main flex items-center gap-2">
                                        <Activity className="w-4 h-4 text-primary" />
                                        Advanced Controls
                                    </h4>

                                    <div className="grid grid-cols-1 gap-4">
                                        {/* <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest pl-1">Max Retries</label>
                                            <select
                                                value={maxRetries}
                                                onChange={(e) => setMaxRetries(parseInt(e.target.value))}
                                                className="w-full bg-bg border border-border-subtle rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
                                            >
                                                <option value={1}>1 Retry</option>
                                                <option value={3}>3 Retries</option>
                                                <option value={5}>5 Retries</option>
                                                <option value={10}>10 Retries</option>
                                            </select>
                                        </div> */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest pl-1">Calls/Day</label>
                                            <select
                                                value={callsPerDay}
                                                onChange={(e) => setCallsPerDay(parseInt(e.target.value))}
                                                className="w-full bg-bg border border-border-subtle rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
                                            >
                                                <option value={1} >1</option>
                                                <option value={2} >2</option>
                                                <option value={5} >5</option>
                                                <option value={10} >10</option>
                                                <option value={20} >20</option>
                                                <option value={50} >50</option>
                                                <option value={100} >100</option>
                                            </select>
                                        </div>


                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest pl-1">Follow Ups</label>
                                            <select
                                                value={followUps}
                                                onChange={(e) => {
                                                    const val = parseInt(e.target.value);
                                                    setFollowUps(val);
                                                    // Adjust delays array to match count
                                                    setFollowUpDelays(prev => {
                                                        const newDelays = [...prev];
                                                        if (val > prev.length) {
                                                            for (let i = prev.length; i < val; i++) newDelays.push(1);
                                                        } else {
                                                            return newDelays.slice(0, val);
                                                        }
                                                        return newDelays;
                                                    });
                                                }}
                                                className="w-full bg-bg border border-border-subtle rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
                                            >
                                                <option value={0}>No Follow Up</option>
                                                <option value={1}>1 Follow Up</option>
                                                <option value={2}>2 Follow Ups</option>
                                                <option value={3}>3 Follow Ups</option>
                                            </select>
                                        </div>


                                    </div>

                                    <div>
                                        {followUps > 0 && (
                                            <div className="w-[full] space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                                <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest pl-1">Follow-up Schedule (Days)</label>

                                                {followUpDelays.map((delay, index) => (
                                                    <div key={index} className="flex items-center gap-3 bg-bg-alt/30 p-2 rounded-xl border border-border-subtle/50">
                                                        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">
                                                            #{index + 1}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[12px] text-text-muted">Wait</span>
                                                            <input
                                                                type="number"
                                                                min={1}
                                                                value={delay}
                                                                onChange={(e) => {
                                                                    const newVal = parseInt(e.target.value) || 1;
                                                                    const newDelays = [...followUpDelays];
                                                                    newDelays[index] = newVal;
                                                                    setFollowUpDelays(newDelays);
                                                                }}
                                                                className="w-16 px-2 py-1 bg-white border border-border-subtle rounded-lg text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary"
                                                            />
                                                            <span className="text-[12px] text-text-muted">days after {index === 0 ? 'the initial call' : `follow-up #${index}`}</span>
                                                        </div>
                                                    </div>
                                                ))}

                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest pl-1">Time Zone</label>
                                        <select
                                            value={timeZone}
                                            onChange={(e) => setTimeZone(e.target.value)}
                                            className="w-full bg-bg border border-border-subtle rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
                                        >
                                            <option value="UTC">UTC (GMT+00:00)</option>
                                            <option value="America/New_York">Eastern Time (GMT-05:00)</option>
                                            <option value="America/Chicago">Central Time (GMT-06:00)</option>
                                            <option value="America/Denver">Mountain Time (GMT-07:00)</option>
                                            <option value="America/Los_Angeles">Pacific Time (GMT-08:00)</option>
                                            <option value="Asia/Kolkata">India Standard Time (GMT+05:30)</option>
                                            <option value="Europe/London">London (GMT+00:00)</option>
                                            <option value="Europe/Paris">Paris (GMT+01:00)</option>
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest pl-1">Timing (Start)</label>
                                            <input
                                                type="time"
                                                value={startTime}
                                                onChange={(e) => setStartTime(e.target.value)}
                                                className="w-full bg-bg border border-border-subtle rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest pl-1">Timing (End)</label>
                                            <input
                                                type="time"
                                                value={endTime}
                                                onChange={(e) => setEndTime(e.target.value)}
                                                className="w-full bg-bg border border-border-subtle rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 4 && (
                            <div className="space-y-6 px-2 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="card-gradient rounded-2xl p-4 overflow-hidden relative">
                                    <div className="relative z-10">
                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                            <div>
                                                <div className="text-[10px] font-bold uppercase opacity-80 mb-1 tracking-widest">Campaign Name</div>
                                                <div className="text-2xl font-black">{campaignName || "Untitled Campaign"}</div>
                                            </div>
                                            <div className="bg-white/10 rounded-xl">
                                                <span className="text-[10px] opacity-70 uppercase font-black">Linked Number</span>
                                                <div className="text-sm font-bold mt-1 truncate">
                                                    {linkedNumber || "Not Set"}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                            <div className="rounded-xl p-3 border border-white/10">
                                                <span className="text-[10px] opacity-70 uppercase font-black">Target</span>
                                                <div className="text-xl font-black mt-0.5">{selectedLeads.length} Leads</div>
                                            </div>
                                            <div className="rounded-xl p-3 border border-white/10 overflow-hidden">
                                                <span className="text-[10px] opacity-70 uppercase font-black">AI Agent</span>
                                                <div className="text-sm font-bold mt-1 truncate">
                                                    {selectedTemplate?.name || "Not Set"}
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                    <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse" />
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-4 bg-bg border border-border-subtle rounded-2xl">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-primary/10 rounded-lg">
                                                <Calendar className="w-4 h-4 text-primary" />
                                            </div>
                                            <span className="text-xs font-bold text-text-main">Campaign Period</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[10px] font-bold text-primary">{startDate || 'Start Date Not Set'}</div>
                                            <div className="text-[9px] text-text-muted">to {endDate || 'End Date Not Set'}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-bg border border-border-subtle rounded-2xl">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-accent/10 rounded-lg">
                                                <Zap className="w-4 h-4 text-accent" />
                                            </div>
                                            <span className="text-xs font-bold text-text-main">Daily Volume</span>
                                        </div>
                                        <span className="text-xs font-bold text-text-main">{callsPerDay} Calls/Day</span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-bg border border-border-subtle rounded-2xl">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-success/10 rounded-lg">
                                                <RotateCcw className="w-4 h-4 text-success" />
                                            </div>
                                            <span className="text-xs font-bold text-text-main">Follow Ups & Retries</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs font-bold text-text-main">{followUps} Follow Ups</span>
                                            <div className="text-[9px] text-text-muted">
                                                {followUpDelays.length > 0 ? `Days: ${followUpDelays.join(', ')}` : 'No delays'}
                                            </div>
                                            <div className="text-[9px] text-text-muted">{maxRetries} Max Retries</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-bg border border-border-subtle rounded-2xl">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-warning/10 rounded-lg">
                                                <Clock className="w-4 h-4 text-warning" />
                                            </div>
                                            <span className="text-xs font-bold text-text-main">Timing</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs font-bold text-text-main">{startTime} - {endTime}</div>
                                        </div>
                                    </div>
                                </div>

                                {selectedLeads.length === 0 && (
                                    <div className="p-4 rounded-2xl bg-danger/10 border border-danger/20 flex items-start gap-4">
                                        <div className="w-8 h-8 rounded-full bg-danger/20 flex items-center justify-center shrink-0">
                                            <XCircle className="w-5 h-5 text-danger" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-danger">Missing Selection</div>
                                            <div className="text-[10px] text-text-muted mt-1">Please select target leads to proceed with the launch.</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-3 pt-6 mt-6 border-t border-border-subtle">
                        {currentStep > 1 ? (
                            <button
                                onClick={prevStep}
                                className="flex-1 px-4 py-3 rounded-xl border border-border-subtle text-xs font-bold text-text-main hover:bg-bg transition-all active:scale-95"
                            >
                                Back
                            </button>
                        ) : (
                            <button
                                onClick={resetForm}
                                className="flex-1 px-4 py-3 rounded-xl border border-border-subtle text-xs font-bold text-text-muted hover:bg-bg transition-all active:scale-95"
                            >
                                Cancel
                            </button>
                        )}
                        <button
                            disabled={
                                (currentStep === 1 && selectedLeads.length === 0) ||
                                (currentStep === 2 && (!campaignName || !selectedTemplate))
                            }
                            onClick={() => {
                                if (currentStep === 4) {
                                    handleLaunch();
                                } else {
                                    nextStep();
                                    if (templateStep === "select-template") {
                                        getAgentTemplates();
                                    }
                                }
                            }}
                            className="flex-[2] btn btn-primary py-3 rounded-xl text-xs font-bold shadow-glow-sm flex items-center justify-center gap-2 group transition-all"
                        >
                            {currentStep === 4 ? 'Launch Campaign' : 'Next Step'}
                            {currentStep !== 4 && <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </div>
                </div>
            </SideSheet >
            <SideSheet
                isOpen={isCallDetailSheetOpen}
                onClose={() => setIsCallDetailSheetOpen(false)}
                title="Call Details"
                size="md"
            >
                {selectedCallForDetail && <CallDetails call={selectedCallForDetail} />}
            </SideSheet>

            {/* Lead Details SideSheet */}
            <SideSheet
                isOpen={isDetailSheetOpen}
                onClose={() => setIsDetailSheetOpen(false)}
                title="Lead Profile Details"
                size="md"
            >
                {selectedLead && (
                    <LeadDetails
                        leadId={selectedLead.id}
                        onClose={() => setIsDetailSheetOpen(false)}
                        onUpdate={() => { }}
                        onDelete={() => { }}
                    />
                )}
            </SideSheet>

            {/* Add Lead SideSheet */}
            <SideSheet
                isOpen={isAddLeadSheetOpen}
                onClose={() => setIsAddLeadSheetOpen(false)}
                title="Add New Lead"
                size="md"
            >
                <LeadFromDb
                    onClose={() => setIsAddLeadSheetOpen(false)}
                    onSuccess={() => { }}
                />
            </SideSheet>

            {/* Edit Campaign SideSheet */}
            <SideSheet
                isOpen={isEditCampaignSheetOpen}
                onClose={() => setIsEditCampaignSheetOpen(false)}
                title="Edit Campaign Settings"
                size="md"
            >
                {selectedCampaign && (
                    <EditCampaign
                        campaign={selectedCampaign}
                        onClose={() => setIsEditCampaignSheetOpen(false)}
                        onUpdate={(updated) => {
                            setCampaigns(prev => prev.map(c => c.id === updated.id ? updated : c));
                            setSelectedCampaign(updated);
                        }}
                    />
                )}
            </SideSheet>
        </>
    );
}