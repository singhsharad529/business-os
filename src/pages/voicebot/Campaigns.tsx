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
    ArrowLeft
} from "lucide-react";
import { SideSheet } from "@/components/SideSheet";
import { useData } from "@/contexts/DataContext";
import { toast } from "@/hooks/useToast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import voiceBotService from "@/api/voicebotService";

interface Campaign {
    id: string;
    name: string;
    status: "Active" | "Scheduled" | "Completed" | "Paused";
    leadsCount: number;
    agentName: string;
    startDate: string;
    endDate?: string;
    progress: number;
}

const DUMMY_CAMPAIGNS: Campaign[] = [
    {
        id: "c1",
        name: "Q4 Sales Outreach",
        status: "Active",
        leadsCount: 150,
        agentName: "Outbound Sales",
        startDate: "2025-12-25T10:00:00Z",
        progress: 65
    },
    {
        id: "c2",
        name: "Healthcare Follow-up",
        status: "Scheduled",
        leadsCount: 85,
        agentName: "Consultant-Healthcare",
        startDate: "2026-01-05T09:00:00Z",
        progress: 0
    },
    {
        id: "c3",
        name: "Property Listing Alert",
        status: "Completed",
        leadsCount: 200,
        agentName: "Property Listing Agent",
        startDate: "2025-12-20T14:30:00Z",
        progress: 100
    },
    {
        id: "c4",
        name: "Annual Review Check-in",
        status: "Paused",
        leadsCount: 50,
        agentName: "Account Support",
        startDate: "2025-12-23T11:00:00Z",
        progress: 30
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
    const { leadDatabaseData } = useData();
    console.log('leadsdb', leadDatabaseData);

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

    // Agent Selection Type & Template State
    const [agentSelectionTab, setAgentSelectionTab] = useState<"existing" | "templates">("templates");
    const [templateStep, setTemplateStep] = useState<"industries" | "configs" | "link-number">("industries");
    const [selectedTemplateRole, setSelectedTemplateRole] = useState<TemplateRole | null>(null);
    const [selectedTemplateConfig, setSelectedTemplateConfig] = useState<TemplateConfig | null>(null);

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
        setTemplateStep("industries");
        setSelectedTemplateRole(null);
        setSelectedTemplateConfig(null);
        setStartDate("");
        setEndDate("");
        setMaxRetries(3);
        setCallsPerDay(5);
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
            progress: 0
        };
        setCampaigns([newCampaign, ...campaigns]);
        toast.success("Campaign launched successfully!");
        resetForm();
    };

    return (
        <>
            <div className="space-y-6">
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
                                    <th className="py-4 px-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Campaign Name</th>
                                    <th className="py-4 px-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Status</th>
                                    <th className="py-4 px-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Leads</th>
                                    <th className="py-4 px-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Agent</th>
                                    <th className="py-4 px-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Start Date</th>
                                    <th className="py-4 px-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Progress</th>
                                    <th className="py-4 px-4 text-[10px] font-bold text-text-muted uppercase tracking-wider text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-subtle">
                                {campaigns.map((camp) => (
                                    <tr key={camp.id} className="group hover:bg-bg/40 transition-colors">
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
                                            <button className="p-2 hover:bg-white rounded-lg transition-colors text-text-muted hover:text-primary">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>


            </div>
            {/* Create Campaign Sidesheet */}
            <SideSheet
                isOpen={isCampaignSheetOpen}
                onClose={resetForm}
                title="Create New Campaign"
                size="md"
            >
                <div className="flex flex-col h-full bg-white">
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
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-bold text-text-main">Choose Calling Agent</label>

                                    </div>
                                    <div className="space-y-4 animate-in fade-in duration-300">
                                        {templateStep === "industries" && (
                                            <div className="grid grid-cols-1 gap-3">
                                                {agentTemplates.map((role) => (
                                                    <button
                                                        key={role.role}
                                                        onClick={() => {
                                                            setSelectedTemplateRole(role);
                                                            setTemplateStep("configs");
                                                        }}
                                                        className="group flex items-center justify-between p-4 rounded-2xl border border-border-subtle hover:border-primary hover:shadow-glow-sm bg-white transition-all text-left"
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className={`p-3 rounded-xl bg-${role.color}/10 text-${role.color} group-hover:bg-${role.color} group-hover:text-white transition-all`}>
                                                                <role.icon className="w-6 h-6" />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-bold text-text-main">{role.role}</h4>
                                                                <p className="text-[10px] text-text-muted">{role.configurations.length} Templates Available</p>
                                                            </div>
                                                        </div>
                                                        <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                        {
                                            templateStep === "configs" && (
                                                <div className="space-y-4">
                                                    <button
                                                        onClick={() => setTemplateStep("industries")}
                                                        className="flex items-center gap-2 text-[10px] font-bold text-text-muted hover:text-primary transition-colors mb-2 uppercase tracking-wider"
                                                    >
                                                        <ArrowLeft className="w-3 h-3" />
                                                        Back to Roles
                                                    </button>
                                                    <div className="grid grid-cols-1 gap-3">
                                                        {selectedTemplateRole?.configurations.map((config) => (
                                                            <button
                                                                key={config.id}
                                                                onClick={() => {
                                                                    setSelectedTemplateConfig(config);
                                                                    setTemplateStep("link-number");

                                                                }}
                                                                className={`group p-4 rounded-xl border transition-all text-left ${selectedTemplateConfig?.id === config.id
                                                                    ? 'border-primary bg-primary/5 shadow-glow-sm'
                                                                    : 'border-border-subtle hover:border-primary/50 bg-white'
                                                                    }`}
                                                            >
                                                                <div className="flex items-center justify-between">
                                                                    <h4 className={`text-sm font-bold ${selectedTemplateConfig?.id === config.id ? 'text-primary' : 'text-text-main'}`}>{config.label}</h4>
                                                                    {selectedTemplateConfig?.id === config.id && <Check className="w-4 h-4 text-primary" />}
                                                                </div>
                                                                <p className="text-[10px] text-text-muted mt-1">{config.description}</p>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                        {
                                            templateStep === "link-number" && (
                                                <div className="space-y-4">
                                                    <button
                                                        onClick={() => setTemplateStep("configs")}
                                                        className="flex items-center gap-2 text-[10px] font-bold text-text-muted hover:text-primary transition-colors mb-2 uppercase tracking-wider"
                                                    >
                                                        <ArrowLeft className="w-3 h-3" />
                                                        Back to Config
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
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h4 className="text-sm font-bold text-text-main flex items-center gap-2">
                                        <Activity className="w-4 h-4 text-primary" />
                                        Advanced Controls
                                    </h4>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
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
                                        </div>
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
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 4 && (
                            <div className="space-y-6 px-2 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="card-gradient rounded-2xl p-4 overflow-hidden relative shadow-glow">
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
                                            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/10">
                                                <span className="text-[10px] opacity-70 uppercase font-black">Target</span>
                                                <div className="text-xl font-black mt-0.5">{selectedLeads.length} Leads</div>
                                            </div>
                                            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/10 overflow-hidden">
                                                <span className="text-[10px] opacity-70 uppercase font-black">AI Agent</span>
                                                <div className="text-sm font-bold mt-1 truncate">
                                                    {selectedTemplateRole?.role || "Not Set"} - {selectedTemplateConfig?.label || "Not Set"}
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
                                            <div className="p-2 bg-warning/10 rounded-lg">
                                                <RotateCcw className="w-4 h-4 text-warning" />
                                            </div>
                                            <span className="text-xs font-bold text-text-main">Retry Policy</span>
                                        </div>
                                        <span className="text-xs font-bold text-text-main">{maxRetries} Retries</span>
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
                                (currentStep === 2 && (!campaignName || !selectedTemplateConfig))
                            }
                            onClick={() => {
                                if (currentStep === 4) {
                                    handleLaunch();
                                } else {
                                    nextStep();
                                }
                            }}
                            className="flex-[2] btn btn-primary py-3.5 rounded-xl flex items-center justify-center gap-2 group transition-all"
                        >
                            <span className="text-sm font-bold uppercase tracking-widest">{currentStep === 4 ? 'Launch Campaign' : 'Next Step'}</span>
                            {currentStep !== 4 && <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </div>
                </div>
            </SideSheet>
        </>
    );
}