import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    User,
    Building2,
    Database,
    Users,
    ArrowLeft,
    Mail,
    Phone,
    Calendar,
    Shield,
    Plus,
    Edit,
    Download,
    Upload,
    PhoneCall,
    Briefcase,
    UserCheck,
    Activity,
    TrendingUp,
    Clock,
    DollarSign,
    Bot,
    Star,
} from "lucide-react";
import CustomerCompany from "../../components/super-admin/voicebot/CustomerCompany";
import CustomerLeads from "@/components/super-admin/voicebot/CustomerLeads";

import CustomerAgents from "@/components/super-admin/voicebot/CustomerAgents";
import AddLead from "@/components/voicebot/AddLead";
import { SideSheet } from "@/components/SideSheet";

import sampleFile from "@/assets/files/leads_data_sample.xlsx";
import CustomerInboundCalls from "@/components/super-admin/voicebot/CustomerInboundCalls";
import CustomerFeedbacks from "@/components/super-admin/voicebot/CustomerFeedbacks";
import CustomerBilling from "@/components/super-admin/voicebot/CustomerBilling";




const Customer = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("profile-company");
    const [isAddLeadSheetOpen, setIsAddLeadSheetOpen] = useState(false);
    const [isAddAgentSheetOpen, setIsAddAgentSheetOpen] = useState(false);
    const [isAddFeedbackSheetOpen, setIsAddFeedbackSheetOpen] = useState(false);
    const [customerName, setCustomerName] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [clientDashboardStats, setClientDashboardStats] = useState<any>(null)

    const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    // Get customer data or use a default mock



    const getSampleFile = () => {
        const link = document.createElement("a");
        link.href = sampleFile;
        link.download = "business_os_sample.xlsx"; // file name shown to user
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-all text-text-muted hover:text-text-main"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-text-main">{customerName}</h1>
                            <p className="text-text-muted">{companyName}</p>
                        </div>
                    </div>



                    {
                        activeTab === "leads" && (
                            <div className="flex gap-4">
                                <button className="btn btn-secondary flex items-center gap-2"
                                    onClick={getSampleFile}
                                >
                                    <Download className="w-4 h-4" />
                                    Sample CSV</button>
                                <button className="btn btn-secondary flex items-center gap-2"
                                    onClick={() => setIsImportModalOpen(true)}
                                >
                                    <Upload className="w-4 h-4" />
                                    Import Leads</button>
                                <button className="btn btn-primary flex items-center gap-2"
                                    onClick={() => setIsAddLeadSheetOpen(true)}
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Lead</button>
                            </div>
                        )
                    }
                    {
                        activeTab === "profile-company" && (
                            <div className="flex gap-4">
                                <button className="btn btn-secondary flex items-center gap-2"
                                    onClick={() => setIsAddFeedbackSheetOpen(true)}
                                >
                                    <Star className="w-4 h-4" />
                                    Feebacks</button>
                                <button className="btn btn-primary flex items-center gap-2"
                                    onClick={() => setIsEditSheetOpen(true)}

                                >
                                    <Edit className="w-4 h-4" />
                                    Edit Company</button>

                            </div>
                        )
                    }
                    {
                        activeTab === "agents" && (
                            <button className="btn btn-primary flex items-center gap-2"
                                onClick={() => setIsAddAgentSheetOpen(true)}
                            >
                                <Bot className="w-4 h-4" />
                                Assign Agent</button>
                        )
                    }
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="card rounded-xl p-6 border border-border-subtle hover:shadow-glow hover:-translate-y-0.5 transition-all">
                        <div className="flex justify-between items-start mb-2">
                            <div className="text-sm text-text-muted">Total Calls</div>
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <PhoneCall className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-text-main">{clientDashboardStats?.totalCalls}</div>
                        {/* <div className="text-xs text-success mt-2 font-medium">Active organizations</div> */}
                    </div>

                    <div className="card rounded-xl p-6 border border-border-subtle hover:shadow-glow hover:-translate-y-0.5 transition-all">
                        <div className="flex justify-between items-start mb-2">
                            <div className="text-sm text-text-muted">Connected</div>
                            <div className="p-2 bg-success/10 rounded-lg text-success">
                                <TrendingUp className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-text-main">{clientDashboardStats?.connectedCalls}</div>
                        {/* <div className="text-xs text-success mt-2 font-medium">~3.4 agents per client</div> */}
                    </div>

                    <div className="card rounded-xl p-6 border border-border-subtle hover:shadow-glow hover:-translate-y-0.5 transition-all">
                        <div className="flex justify-between items-start mb-2">
                            <div className="text-sm text-text-muted">Avg Duration</div>
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <Clock className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-text-main">{clientDashboardStats?.avgDurationSeconds}</div>
                        {/* <div className="text-xs text-success mt-2 font-medium">Successful password changes</div> */}
                    </div>

                    <div className="card rounded-xl p-6 border border-border-subtle hover:shadow-glow hover:-translate-y-0.5 transition-all">
                        <div className="flex justify-between items-start mb-2">
                            <div className="text-sm text-text-muted">Total Revenue</div>
                            <div className="p-2 bg-warning/10 rounded-lg text-warning">
                                <DollarSign className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-text-main">${clientDashboardStats?.totalRevenue}</div>
                        {/* <div className="text-xs text-text-muted mt-2 font-medium">Daily active agents</div> */}
                    </div>

                    <div className="card rounded-xl p-6 border border-border-subtle hover:shadow-glow hover:-translate-y-0.5 transition-all">
                        <div className="flex justify-between items-start mb-2">
                            <div className="text-sm text-text-muted">MRR</div>
                            <div className="p-2 bg-warning/10 rounded-lg text-warning">
                                <DollarSign className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-text-main">{clientDashboardStats?.mrr}</div>
                        {/* <div className="text-xs text-text-muted mt-2 font-medium">Daily active agents</div> */}
                    </div>
                </div>

                {/* Custom Tabs */}
                <div className="flex border-b border-border-subtle mb-4 shrink-0">
                    <button
                        onClick={() => setActiveTab("profile-company")}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all relative ${activeTab === "profile-company" ? "text-primary" : "text-text-muted hover:text-text-main"
                            }`}
                    >
                        <User className="w-4 h-4" />
                        Profile & Company
                        {activeTab === "profile-company" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />}
                    </button>
                    <button
                        onClick={() => setActiveTab("inbound")}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all relative ${activeTab === "company" ? "text-primary" : "text-text-muted hover:text-text-main"
                            }`}
                    >
                        <PhoneCall className="w-4 h-4" />
                        Inbound Calls
                        {activeTab === "inbound" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />}
                    </button>
                    <button
                        onClick={() => setActiveTab("leads")}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all relative ${activeTab === "leads" ? "text-primary" : "text-text-muted hover:text-text-main"
                            }`}
                    >
                        <Database className="w-4 h-4" />
                        Leads database
                        {activeTab === "leads" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />}
                    </button>
                    <button
                        onClick={() => setActiveTab("agents")}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all relative ${activeTab === "agents" ? "text-primary" : "text-text-muted hover:text-text-main"
                            }`}
                    >
                        <Users className="w-4 h-4" />
                        Agents
                        {activeTab === "agents" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />}
                    </button>
                    <button
                        onClick={() => setActiveTab("billing")}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all relative ${activeTab === "billing" ? "text-primary" : "text-text-muted hover:text-text-main"
                            }`}
                    >
                        <Users className="w-4 h-4" />
                        Billing
                        {activeTab === "billing" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />}
                    </button>
                </div>

                {/* Tab Content */}
                <div className="mt-6">
                    {activeTab === "profile-company" && (
                        <CustomerCompany
                            isEditSheetOpen={isEditSheetOpen}
                            setIsEditSheetOpen={setIsEditSheetOpen}
                            userid={id as string}
                            setCustomerName={setCustomerName}
                            setCompanyName={setCompanyName}
                            setClientDashboardStats={setClientDashboardStats}
                        />
                    )}

                    {activeTab === "inbound" && (
                        <CustomerInboundCalls />
                    )}

                    {activeTab === "leads" && (
                        <CustomerLeads
                            isImportModalOpen={isImportModalOpen}
                            setIsImportModalOpen={setIsImportModalOpen}
                            isAddLeadSheetOpen={isAddLeadSheetOpen}
                            setIsAddLeadSheetOpen={setIsAddLeadSheetOpen}
                        />
                    )}

                    {activeTab === "agents" && (
                        <CustomerAgents

                            isAddAgentSheetOpen={isAddAgentSheetOpen}
                            setIsAddAgentSheetOpen={setIsAddAgentSheetOpen}
                            userid={id as string}
                        />
                    )}

                    {activeTab === "billing" && (
                        <CustomerBilling />
                    )}
                </div>
            </div>



            {/* Add Lead SideSheet */}
            <SideSheet
                isOpen={isAddFeedbackSheetOpen}
                onClose={() => setIsAddFeedbackSheetOpen(false)}
                title="User Feebacks"
                size="md"
            >
                <CustomerFeedbacks
                    onClose={() => setIsAddFeedbackSheetOpen(false)}

                />
            </SideSheet>
        </div>
    );
};

export default Customer;