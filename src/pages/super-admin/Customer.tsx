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
} from "lucide-react";
import CustomerCompany from "../../components/super-admin/voicebot/CustomerCompany";
import CustomerLeads from "@/components/super-admin/voicebot/CustomerLeads";

import CustomerAgents from "@/components/super-admin/voicebot/CustomerAgents";

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
    const [activeTab, setActiveTab] = useState("profile");

    // Get customer data or use a default mock
    const customer = dummyCustomerData[id as keyof typeof dummyCustomerData] || dummyCustomerData["1"];
    const { company } = customer;

    return (
        <div className="space-y-6">
            {/* Header */}
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

            {/* Custom Tabs */}
            <div className="flex border-b border-border-subtle mb-4 shrink-0">
                <button
                    onClick={() => setActiveTab("profile")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all relative ${activeTab === "profile" ? "text-primary" : "text-text-muted hover:text-text-main"
                        }`}
                >
                    <User className="w-4 h-4" />
                    Profile
                    {activeTab === "profile" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />}
                </button>
                <button
                    onClick={() => setActiveTab("company")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all relative ${activeTab === "company" ? "text-primary" : "text-text-muted hover:text-text-main"
                        }`}
                >
                    <Building2 className="w-4 h-4" />
                    Company
                    {activeTab === "company" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />}
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
                {activeTab === "profile" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="card rounded-xl p-8 border border-border-subtle hover:shadow-glow hover:-translate-y-0.5 transition-all">
                            <h3 className="text-lg font-semibold text-text-main flex items-center gap-2 mb-2">
                                <User className="w-5 h-5 text-primary" />
                                Personal Information
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between py-2 border-b border-border-subtle/50">
                                    <span className="text-text-muted flex items-center gap-2"><Mail className="w-4 h-4" /> Email</span>
                                    <span className="text-text-main">{customer.email}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-border-subtle/50">
                                    <span className="text-text-muted flex items-center gap-2"><Phone className="w-4 h-4" /> Phone</span>
                                    <span className="text-text-main">{customer.profile.phone}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-border-subtle/50">
                                    <span className="text-text-muted flex items-center gap-2"><Shield className="w-4 h-4" /> Role</span>
                                    <span className="text-text-main">{customer.profile.role}</span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="text-text-muted flex items-center gap-2"><Calendar className="w-4 h-4" /> Joined</span>
                                    <span className="text-text-main">{customer.profile.joinedDate}</span>
                                </div>
                            </div>
                        </div>

                        <div className="card rounded-xl p-6 border border-border-subtle hover:shadow-glow hover:-translate-y-0.5 transition-all">
                            <h3 className="text-lg font-semibold text-text-main mb-2">Account Status</h3>
                            <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-text-muted">Account Status</span>
                                    <span className="flex items-center gap-1.5 text-success font-medium">
                                        <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                                        Active
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "company" && (
                    <CustomerCompany
                        company={company}
                        customerEmail={customer.email}
                        customerPhone={customer.profile.phone}
                    />
                )}

                {activeTab === "leads" && (
                    <CustomerLeads />
                )}

                {activeTab === "agents" && (
                    <CustomerAgents />
                )}
            </div>
        </div>
    );
};

export default Customer;