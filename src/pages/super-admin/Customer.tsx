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
} from "lucide-react";
import CustomerCompany from "../../components/super-admin/voicebot/CustomerCompany";
import CustomerLeads from "@/components/super-admin/voicebot/CustomerLeads";

import CustomerAgents from "@/components/super-admin/voicebot/CustomerAgents";
import AddLead from "@/components/voicebot/AddLead";
import { SideSheet } from "@/components/SideSheet";

import sampleFile from "@/assets/files/leads_data_sample.xlsx";
import CustomerInboundCalls from "@/components/super-admin/voicebot/CustomerInboundCalls";


// Dummy data for a single customer
const dummyCustomerData = {
    "1": {
        id: "1",
        fullName: "Josh Anderson",
        email: "josh@techflow.io",
        username: "josh_tech_24",
        company: {
            id: "comp_01",
            name: "TechFlow Systems",
            industry: "Software_Development",
            size: "50-200 employees",
            website: "https://techflow.io",
            address: "123 Silicon Valley Way, San Jose, CA",
            description: "TechFlow Systems is a leading provider of cloud-native infrastructure solutions. We specialize in helping enterprise clients transition to microservices architectures while maintaining high availability and security standards.\n\nOur mission is to simplify complex system orchestrations through intelligent automation and robust monitoring frameworks.",
            taxId: "TX-9988-7766",
            foundedDate: "2018-05-20",
            currency: "USD",
            timezone: "America/Los_Angeles",
            createdAt: "2023-10-12T08:30:00Z",
            documents: [
                { documentName: "Business_License.pdf", documentType: "PDF", uploadedAt: "2023-10-15T10:00:00Z", documentUrl: "#" },
                { documentName: "Tax_Certificate.pdf", documentType: "PDF", uploadedAt: "2023-10-15T10:05:00Z", documentUrl: "#" },
            ]
        },
        profile: {
            phone: "+1 (555) 123-4567",
            role: "CTO",
            joinedDate: "October 12, 2023",
            status: "active",
            plan: "Enterprise",
        },
        leads: [
            { id: 1, name: "Alice Thompson", email: "alice@example.com", phone: "+1 234 567 890", status: "New" },
            { id: 2, name: "Bob Richards", email: "bob@example.com", phone: "+1 234 567 891", status: "Contacted" },
            { id: 3, name: "Charlie Davis", email: "charlie@example.com", phone: "+1 234 567 892", status: "Qualified" },
        ],
        agents: [
            { id: 1, name: "Inbound Support", model: "GPT-4o", voice: "Alloy", status: "active" },
            { id: 2, name: "Outbound Sales", model: "GPT-4o-mini", voice: "Echo", status: "active" },
        ]
    },
};

const Customer = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("profile-company");
    const [isAddLeadSheetOpen, setIsAddLeadSheetOpen] = useState(false);
    const [isAddAgentSheetOpen, setIsAddAgentSheetOpen] = useState(false);

    const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    // Get customer data or use a default mock
    const customer = dummyCustomerData[id as keyof typeof dummyCustomerData] || dummyCustomerData["1"];
    const { company } = customer;


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
                            <h1 className="text-3xl font-bold text-text-main">{customer.fullName}</h1>
                            <p className="text-text-muted">{company.name}</p>
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
                            <button className="btn btn-primary flex items-center gap-2"
                                onClick={() => setIsEditSheetOpen(true)}

                            >
                                <Edit className="w-4 h-4" />
                                Edit Company</button>
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
                        <div className="text-3xl font-bold text-text-main">{0}</div>
                        {/* <div className="text-xs text-success mt-2 font-medium">Active organizations</div> */}
                    </div>

                    <div className="card rounded-xl p-6 border border-border-subtle hover:shadow-glow hover:-translate-y-0.5 transition-all">
                        <div className="flex justify-between items-start mb-2">
                            <div className="text-sm text-text-muted">Connected</div>
                            <div className="p-2 bg-success/10 rounded-lg text-success">
                                <TrendingUp className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-text-main">14</div>
                        {/* <div className="text-xs text-success mt-2 font-medium">~3.4 agents per client</div> */}
                    </div>

                    <div className="card rounded-xl p-6 border border-border-subtle hover:shadow-glow hover:-translate-y-0.5 transition-all">
                        <div className="flex justify-between items-start mb-2">
                            <div className="text-sm text-text-muted">Avg Duration</div>
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <Clock className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-text-main">12:34</div>
                        {/* <div className="text-xs text-success mt-2 font-medium">Successful password changes</div> */}
                    </div>

                    <div className="card rounded-xl p-6 border border-border-subtle hover:shadow-glow hover:-translate-y-0.5 transition-all">
                        <div className="flex justify-between items-start mb-2">
                            <div className="text-sm text-text-muted">Total Revenue</div>
                            <div className="p-2 bg-warning/10 rounded-lg text-warning">
                                <DollarSign className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-text-main">$12,345</div>
                        {/* <div className="text-xs text-text-muted mt-2 font-medium">Daily active agents</div> */}
                    </div>

                    <div className="card rounded-xl p-6 border border-border-subtle hover:shadow-glow hover:-translate-y-0.5 transition-all">
                        <div className="flex justify-between items-start mb-2">
                            <div className="text-sm text-text-muted">MRR</div>
                            <div className="p-2 bg-warning/10 rounded-lg text-warning">
                                <DollarSign className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-text-main">$0</div>
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
                </div>

                {/* Tab Content */}
                <div className="mt-6">
                    {activeTab === "profile-company" && (
                        <CustomerCompany
                            isEditSheetOpen={isEditSheetOpen}
                            setIsEditSheetOpen={setIsEditSheetOpen}
                            userid={id as string}
                        />
                    )}

                    {activeTab === "inbound" && (
                        <CustomerInboundCalls />
                    )}

                    {activeTab === "leads" && (
                        <CustomerLeads
                            isImportModalOpen={isImportModalOpen}
                            setIsImportModalOpen={setIsImportModalOpen}
                        />
                    )}

                    {activeTab === "agents" && (
                        <CustomerAgents

                            isAddAgentSheetOpen={isAddAgentSheetOpen}
                            setIsAddAgentSheetOpen={setIsAddAgentSheetOpen}
                            userid={id as string}
                        />
                    )}
                </div>
            </div>

            {/* Add Lead SideSheet */}
            <SideSheet
                isOpen={isAddLeadSheetOpen}
                onClose={() => setIsAddLeadSheetOpen(false)}
                title="Add New Lead"
                size="md"
            >
                <AddLead
                    onClose={() => setIsAddLeadSheetOpen(false)}
                    onSuccess={() => { }}
                />
            </SideSheet>
        </div>
    );
};

export default Customer;