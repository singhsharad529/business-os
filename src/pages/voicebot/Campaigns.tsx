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
    RotateCcw
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

export default function Campaigns() {
    const { agents, leadDatabaseData } = useData();
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
    const [searchTerm, setSearchTerm] = useState("");

    // Create Campaign Form State
    const [campaignName, setCampaignName] = useState("");
    const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
    const [selectedAgent, setSelectedAgent] = useState("");
    const [scheduleType, setScheduleType] = useState("immediate");
    const [startDate, setStartDate] = useState("");
    const [concurrency, setConcurrency] = useState(5);
    const [maxRetries, setMaxRetries] = useState(3);
    const [callDelay, setCallDelay] = useState(30);

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
        setScheduleType("immediate");
        setStartDate("");
        setConcurrency(5);
        setMaxRetries(3);
        setLeadSearchText("");
    };

    const handleLaunch = () => {
        const newCampaign: Campaign = {
            id: `c${campaigns.length + 1}`,
            name: campaignName,
            status: scheduleType === "immediate" ? "Active" : "Scheduled",
            leadsCount: selectedLeads.length,
            agentName: apiAgents.find((a: any) => a.vapiId === selectedAgent)?.name || "Unknown Agent",
            startDate: startDate || new Date().toISOString(),
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
                                    <label className="text-sm font-bold text-text-main">Choose Calling Agent</label>
                                    <div className="grid grid-cols-1 gap-3">
                                        {agentsLoading ? (
                                            <div className="space-y-3">
                                                {[1, 2, 3].map((i) => (
                                                    <div key={i} className="h-20 bg-bg animate-pulse rounded-2xl border border-border-subtle" />
                                                ))}
                                            </div>
                                        ) : apiAgents.length > 0 ? apiAgents.map((agent: any) => (
                                            <div
                                                key={agent.id}
                                                onClick={() => setSelectedAgent(agent.vapiId)}
                                                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${selectedAgent === agent.vapiId
                                                    ? 'border-primary bg-primary/5 shadow-glow-sm ring-1 ring-primary/30'
                                                    : 'border-border-subtle bg-white hover:border-text-muted/30 shadow-soft'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${selectedAgent === agent.vapiId ? 'bg-primary text-white rotate-0' : 'bg-primary/10 text-primary rotate-3 group-hover:rotate-0'
                                                        }`}>
                                                        <User className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-text-main">{agent.name}</div>
                                                        <div className="flex flex-wrap gap-2 mt-1.5">
                                                            <span className="text-[9px] text-text-muted bg-bg-alt px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter truncate max-w-[80px]">
                                                                {agent.metadata?.department || agent.industry}
                                                            </span>
                                                            <span className="text-[9px] text-text-muted bg-bg-alt px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">
                                                                {agent.metadata?.language || agent.language}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedAgent === agent.vapiId ? 'border-primary bg-primary text-white scale-110 shadow-lg' : 'border-border-subtle group-hover:border-primary/50'
                                                    }`}>
                                                    {selectedAgent === agent.vapiId && <Check className="w-4 h-4" />}
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="text-center py-10 bg-bg rounded-2xl border border-dashed border-border-subtle">
                                                <User className="w-10 h-10 text-text-muted mx-auto mb-2 opacity-20" />
                                                <p className="text-xs text-text-muted">No agents found. Create one first.</p>
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
                                        Scheduling
                                    </h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => setScheduleType("immediate")}
                                            className={`p-4 rounded-2xl border text-center transition-all group ${scheduleType === "immediate"
                                                ? 'border-primary bg-primary/5 ring-1 ring-primary ring-inset shadow-glow-sm'
                                                : 'border-border-subtle bg-white hover:border-text-muted/30'
                                                }`}
                                        >
                                            <Zap className={`w-6 h-6 mx-auto mb-2 transition-transform group-hover:scale-110 ${scheduleType === "immediate" ? 'text-primary' : 'text-text-muted'}`} />
                                            <div className="text-xs font-bold text-text-main">Immediate</div>
                                            <div className="text-[10px] text-text-muted mt-1">Start campaign now</div>
                                        </button>
                                        <button
                                            onClick={() => setScheduleType("scheduled")}
                                            className={`p-4 rounded-2xl border text-center transition-all group ${scheduleType === "scheduled"
                                                ? 'border-primary bg-primary/5 ring-1 ring-primary ring-inset shadow-glow-sm'
                                                : 'border-border-subtle bg-white hover:border-text-muted/30'
                                                }`}
                                        >
                                            <Clock className={`w-6 h-6 mx-auto mb-2 transition-transform group-hover:scale-110 ${scheduleType === "scheduled" ? 'text-primary' : 'text-text-muted'}`} />
                                            <div className="text-xs font-bold text-text-main">Scheduled</div>
                                            <div className="text-[10px] text-text-muted mt-1">Pick future date</div>
                                        </button>
                                    </div>

                                    {scheduleType === "scheduled" && (
                                        <div className="animate-in fade-in zoom-in-95 duration-300">
                                            <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest pl-1 mb-1.5 block">Launch Date & Time</label>
                                            <input
                                                type="datetime-local"
                                                value={startDate}
                                                onChange={(e) => setStartDate(e.target.value)}
                                                className="w-full px-4 py-3 bg-bg border border-border-subtle rounded-xl text-sm focus:ring-1 focus:ring-primary focus:outline-none shadow-sm"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-6">
                                    <h4 className="text-sm font-bold text-text-main flex items-center gap-2">
                                        <Activity className="w-4 h-4 text-primary" />
                                        Advanced Controls
                                    </h4>

                                    <div className="space-y-4 bg-bg/30 p-5 rounded-2xl border border-border-subtle">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <label className="text-xs font-bold text-text-main uppercase tracking-tighter">Concurrency</label>
                                                <p className="text-[10px] text-text-muted">Simultaneous calls</p>
                                            </div>
                                            <span className="text-primary font-black text-xl">{concurrency}</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="1"
                                            max="50"
                                            value={concurrency}
                                            onChange={(e) => setConcurrency(parseInt(e.target.value))}
                                            className="w-full h-1.5 bg-primary/10 rounded-lg appearance-none cursor-pointer accent-primary"
                                        />
                                        <div className="flex justify-between text-[8px] text-text-muted font-bold uppercase tracking-widest">
                                            <span>Conservative</span>
                                            <span>Aggressive</span>
                                        </div>
                                    </div>

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
                                            <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest pl-1">Retry Delay</label>
                                            <select
                                                value={callDelay}
                                                onChange={(e) => setCallDelay(parseInt(e.target.value))}
                                                className="w-full bg-bg border border-border-subtle rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
                                            >
                                                <option value={15}>15 Mins</option>
                                                <option value={30}>30 Mins</option>
                                                <option value={60}>1 Hour</option>
                                                <option value={1440}>24 Hours</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 4 && (
                            <div className="space-y-6 px-2 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="card-gradient rounded-2xl p-6 overflow-hidden relative shadow-glow">
                                    <div className="relative z-10 text-white">
                                        <div className="text-[10px] font-bold uppercase opacity-80 mb-1 tracking-widest">Confirm Configuration</div>
                                        <div className="text-2xl font-black">{campaignName || "Untitled Campaign"}</div>

                                        <div className="grid grid-cols-2 gap-4 mt-6">
                                            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/10">
                                                <span className="text-[10px] opacity-70 uppercase font-black">Target</span>
                                                <div className="text-xl font-black mt-0.5">{selectedLeads.length} Leads</div>
                                            </div>
                                            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/10 overflow-hidden">
                                                <span className="text-[10px] opacity-70 uppercase font-black">AI Agent</span>
                                                <div className="text-sm font-bold mt-1 truncate">{apiAgents.find((a: any) => a.vapiId === selectedAgent)?.name || "Not Set"}</div>
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
                                            <span className="text-xs font-bold text-text-main">Schedule</span>
                                        </div>
                                        <span className="text-xs font-bold text-primary capitalize">{scheduleType === 'immediate' ? 'Instant Launch' : startDate}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-bg border border-border-subtle rounded-2xl">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-accent/10 rounded-lg">
                                                <Zap className="w-4 h-4 text-accent" />
                                            </div>
                                            <span className="text-xs font-bold text-text-main">Power Mode</span>
                                        </div>
                                        <span className="text-xs font-bold text-text-main">{concurrency} Concurrent Lines</span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-bg border border-border-subtle rounded-2xl">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-warning/10 rounded-lg">
                                                <RotateCcw className="w-4 h-4 text-warning" />
                                            </div>
                                            <span className="text-xs font-bold text-text-main">Persistence</span>
                                        </div>
                                        <span className="text-xs font-bold text-text-main">{maxRetries} Retries every {callDelay >= 60 ? `${callDelay / 60}h` : `${callDelay}m`}</span>
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
                                (currentStep === 2 && (!campaignName || !selectedAgent))
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