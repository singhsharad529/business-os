import { useState, useEffect, useMemo } from "react";
import {
    BotMessageSquare,
    Phone,
    Briefcase,
    ArrowLeft,
    Loader2,
    Clock,
    PhoneCall,
    PhoneOff,
    History as HistoryIcon,
    Plus,
    Home,
    Wallet,
    Target,
    Dot,
    ChevronRight,
    User,
    MessageSquare
} from "lucide-react";
import { toast } from "@/hooks/useToast";

interface TestCallProps {
    onCancel: () => void;
}

type Step = "select-role" | "select-config" | "input-number" | "simulating" | "completed";
type Tab = "new" | "history";

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

interface TestCallRecord {
    id: string;
    agentName: string;
    agentRole: string;
    phoneNumber: string;
    duration: number;
    timestamp: string;
    status: "completed" | "failed";
    summary?: string;
    messages?: Array<{
        role: "bot" | "user" | "assistant";
        message: string;
        secondsFromStart?: number;
    }>;
}

const DUMMY_HISTORY: TestCallRecord[] = [
    {
        id: "mock1",
        agentName: "Outbound Sales",
        agentRole: "Sales",
        phoneNumber: "+1 (555) 123-4567",
        duration: 124,
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        status: "completed",
        summary: "The agent called the user to discuss a potential business partnership. The user expressed interest and requested a follow-up document.",
        messages: [
            { role: "assistant", message: "Hello, this is Alex from Business OS. Am I speaking with the business manager?", secondsFromStart: 1 },
            { role: "user", message: "Yes, this is him. How can I help you?", secondsFromStart: 5 },
            { role: "assistant", message: "I'm calling about our new automation tools that could save your team 20 hours a week. Would you be interested in a brief overview?", secondsFromStart: 12 },
            { role: "user", message: "That sounds interesting. Can you send me some documentation first?", secondsFromStart: 20 },
            { role: "assistant", message: "Absolutely. I'll send that over to your email right away. When would be a good time to follow up?", secondsFromStart: 28 },
            { role: "user", message: "Try me on Thursday afternoon.", secondsFromStart: 35 },
            { role: "assistant", message: "Perfect. I've noted that. Have a great day!", secondsFromStart: 40 }
        ]
    },
    {
        id: "mock2",
        agentName: "Loan Advisor",
        agentRole: "Finance",
        phoneNumber: "+1 (555) 987-6543",
        duration: 45,
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        status: "completed",
        summary: "Client inquired about personal loan interest rates and eligibility criteria.",
        messages: [
            { role: "assistant", message: "Thank you for calling Finance Direct. How can I assist you with your loan inquiry today?", secondsFromStart: 2 },
            { role: "user", message: "I'm looking for a personal loan of about $10,000.", secondsFromStart: 8 },
            { role: "assistant", message: "I can help with that. Our current rates start at 5.9%. Do you know your current credit score range?", secondsFromStart: 15 },
            { role: "user", message: "It's around 720.", secondsFromStart: 22 }
        ]
    },
    {
        id: "mock3",
        agentName: "Property Listing Agent",
        agentRole: "Realty",
        phoneNumber: "+1 (555) 456-7890",
        duration: 0,
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        status: "failed",
        summary: "The call was disconnected before the user could provide details.",
        messages: [
            { role: "assistant", message: "Hello, this is Realty Plus. Are you calling to list a property?", secondsFromStart: 2 }
        ]
    }
];

export default function TestCall({ onCancel }: TestCallProps) {
    const [activeTab, setActiveTab] = useState<Tab>("new");
    const [step, setStep] = useState<Step>("select-role");
    const [selectedRole, setSelectedRole] = useState<TemplateRole | null>(null);
    const [selectedConfig, setSelectedConfig] = useState<TemplateConfig | null>(null);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [simStatus, setSimStatus] = useState<"initiating" | "ongoing" | "completed">("initiating");
    const [timer, setTimer] = useState(0);
    const [history, setHistory] = useState<TestCallRecord[]>([]);
    const [selectedHistoryItem, setSelectedHistoryItem] = useState<TestCallRecord | null>(null);

    useEffect(() => {
        const savedHistory = localStorage.getItem("test_call_history");
        if (savedHistory) {
            try {
                setHistory(JSON.parse(savedHistory));
            } catch (e) {
                console.error("Failed to parse history", e);
                setHistory(DUMMY_HISTORY);
            }
        } else {
            setHistory(DUMMY_HISTORY);
        }
    }, []);

    const saveToHistory = (record: TestCallRecord) => {
        const updatedHistory = [record, ...history].slice(0, 20);
        setHistory(updatedHistory);
        localStorage.setItem("test_call_history", JSON.stringify(updatedHistory));
    };

    useEffect(() => {
        let interval: any;
        if (step === "simulating" && simStatus === "ongoing") {
            interval = setInterval(() => {
                setTimer(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [step, simStatus]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const handleStartCall = () => {
        if (!phoneNumber) {
            toast.danger("Please enter your phone number");
            return;
        }
        setStep("simulating");
        setSimStatus("initiating");
        setTimer(0);

        // Simulate call progression
        setTimeout(() => {
            setSimStatus("ongoing");
            // End call after 15 seconds automatically for simulation
            setTimeout(() => {
                setSimStatus("completed");
                const newRecord: TestCallRecord = {
                    id: Math.random().toString(36).substr(2, 9),
                    agentName: selectedConfig?.label || "Unknown Agent",
                    agentRole: selectedRole?.role || "General",
                    phoneNumber: phoneNumber,
                    duration: 15, // Mock duration
                    timestamp: new Date().toISOString(),
                    status: "completed",
                    summary: "The test call was completed successfully. This is a simulated summary for your test interaction.",
                    messages: [
                        { role: "assistant", message: "Hi! This is a test call from your Business OS agent.", secondsFromStart: 1 },
                        { role: "user", message: "Hello, I can hear you clearly.", secondsFromStart: 5 },
                        { role: "assistant", message: "Great! This confirms the outbound calling system is working as expected.", secondsFromStart: 10 },
                        { role: "user", message: "Awesome, thanks for the test.", secondsFromStart: 14 }
                    ]
                };
                saveToHistory(newRecord);
                setStep("completed");
            }, 15000);
        }, 3000);
    };

    const handleRetry = () => {
        setStep("select-role");
        setSelectedRole(null);
        setSelectedConfig(null);
        setPhoneNumber("");
    };

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Tab Header */}
            {!selectedHistoryItem && (
                <div className="flex border-b border-border-subtle mb-6">
                    <button
                        onClick={() => setActiveTab("new")}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all relative ${activeTab === "new" ? "text-primary" : "text-text-muted hover:text-text-main"
                            }`}
                    >
                        <Plus className="w-4 h-4" />
                        New Test Call
                        {activeTab === "new" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />}
                    </button>
                    <button
                        onClick={() => setActiveTab("history")}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all relative ${activeTab === "history" ? "text-primary" : "text-text-muted hover:text-text-main"
                            }`}
                    >
                        <HistoryIcon className="w-4 h-4" />
                        History
                        {activeTab === "history" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />}
                    </button>
                </div>
            )}

            <div className="flex-1 overflow-y-auto px-1">
                {activeTab === "new" ? (
                    <div className="space-y-6 pb-6">
                        {step === "select-role" && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div>
                                    <h3 className="text-lg font-bold text-text-main">Select Industry</h3>
                                    <p className="text-sm text-text-muted">Choose a template category for your test agent.</p>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    {AGENT_TEMPLATES.map((role) => (
                                        <button
                                            key={role.role}
                                            onClick={() => {
                                                setSelectedRole(role);
                                                setStep("select-config");
                                            }}
                                            className="group flex items-center justify-between p-4 rounded-2xl border border-border-subtle hover:border-primary hover:shadow-glow-sm bg-white transition-all text-left"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`p-3 rounded-xl bg-${role.color}/10 text-${role.color} group-hover:bg-${role.color} group-hover:text-white transition-all`}>
                                                    <role.icon className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-text-main">{role.role}</h4>
                                                    <p className="text-xs text-text-muted">{role.configurations.length} Templates Available</p>
                                                </div>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {step === "select-config" && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                <button
                                    onClick={() => setStep("select-role")}
                                    className="flex items-center gap-2 text-xs text-text-muted hover:text-primary transition-colors mb-2"
                                >
                                    <ArrowLeft className="w-3 h-3" />
                                    Back to Industries
                                </button>
                                <div>
                                    <h3 className="text-lg font-bold text-text-main">{selectedRole?.role} Templates</h3>
                                    <p className="text-sm text-text-muted">Pick a specialized configuration for the call.</p>
                                </div>
                                <div className="grid grid-cols-1 gap-3">
                                    {selectedRole?.configurations.map((config) => (
                                        <button
                                            key={config.id}
                                            onClick={() => {
                                                setSelectedConfig(config);
                                                setStep("input-number");
                                            }}
                                            className="group p-4 rounded-xl border border-border-subtle hover:border-primary hover:bg-primary/5 transition-all text-left"
                                        >
                                            <h4 className="text-sm font-bold text-text-main group-hover:text-primary">{config.label}</h4>
                                            <p className="text-xs text-text-muted mt-1">{config.description}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {step === "input-number" && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <button
                                    onClick={() => setStep("select-config")}
                                    className="flex items-center gap-2 text-xs text-text-muted hover:text-primary transition-colors mb-2"
                                >
                                    <ArrowLeft className="w-3 h-3" />
                                    Back to Templates
                                </button>
                                <div className="flex flex-col items-center text-center space-y-4">
                                    <div className={`w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary`}>
                                        {selectedRole && <selectedRole.icon className="w-8 h-8" />}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-text-main">Ready for Test Call?</h3>
                                        <p className="text-sm text-text-muted px-6">
                                            The <span className="font-semibold text-text-main">{selectedConfig?.label}</span> will call you to simulate a conversation.
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-text-main flex items-center gap-2">
                                            Your Phone Number
                                            <span className="text-[10px] font-normal text-text-muted px-1.5 py-0.5 bg-bg border border-border-subtle rounded text-primary">Required</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
                                                <Phone className="w-4 h-4" />
                                            </div>
                                            <input
                                                type="tel"
                                                placeholder="+1 (555) 000-0000"
                                                value={phoneNumber}
                                                onChange={(e) => setPhoneNumber(e.target.value)}
                                                className="w-full bg-white border border-border-subtle rounded-xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleStartCall}
                                        className="btn btn-primary w-full py-4 rounded-xl text-sm font-bold shadow-glow-primary"
                                    >
                                        Start My Test Call
                                    </button>
                                </div>
                                <div className="p-4 bg-bg rounded-xl border border-border-subtle flex gap-3">
                                    <div className="p-2 bg-white rounded-lg border border-border-subtle">
                                        <Clock className="w-4 h-4 text-primary" />
                                    </div>
                                    <p className="text-[11px] text-text-muted leading-relaxed">
                                        You'll receive an outbound call automatically. Please ensure your line is free to pick up.
                                    </p>
                                </div>
                            </div>
                        )}

                        {step === "simulating" && (
                            <div className="flex flex-col items-center justify-center py-10 space-y-8 animate-in fade-in duration-500">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping scale-150" />
                                    <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse scale-125" />
                                    <div className="relative w-24 h-24 bg-primary rounded-full flex items-center justify-center text-white shadow-glow">
                                        <PhoneCall className="w-10 h-10" />
                                    </div>
                                </div>

                                <div className="text-center space-y-2">
                                    <div className="flex items-center justify-center gap-2 text-primary font-bold uppercase tracking-widest text-[10px]">
                                        <Dot className="w-4 h-4 animate-bounce" />
                                        {simStatus === "initiating" ? "Initiating Call" : "Call Ongoing"}
                                    </div>
                                    <h3 className="text-xl font-bold text-text-main">{selectedConfig?.label}</h3>
                                    <p className="text-sm text-text-muted">{phoneNumber}</p>
                                </div>

                                <div className="bg-bg border border-border-subtle rounded-3xl px-8 py-4 flex flex-col items-center">
                                    <span className="text-[10px] uppercase font-bold text-text-muted tracking-tighter">Call Duration</span>
                                    <span className="text-2xl font-mono font-bold text-text-main">{formatTime(timer)}</span>
                                </div>

                                <div className="space-y-4 w-full">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between text-[10px] font-bold text-text-muted uppercase">
                                            <span>Processing</span>
                                            <span>{simStatus === "initiating" ? "15%" : "65%"}</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-border-subtle rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary transition-all duration-1000"
                                                style={{ width: simStatus === "initiating" ? "15%" : "65%" }}
                                            />
                                        </div>
                                    </div>
                                    <p className="text-center text-xs text-text-muted italic">
                                        Simulating a real conversation with {selectedRole?.role} AI...
                                    </p>
                                </div>
                            </div>
                        )}

                        {step === "completed" && (
                            <div className="flex flex-col items-center justify-center py-10 space-y-8 animate-in zoom-in-95 duration-500">
                                <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center text-success border border-success/20">
                                    <PhoneOff className="w-10 h-10" />
                                </div>

                                <div className="text-center space-y-2">
                                    <h3 className="text-2xl font-bold text-text-main">Call Completed</h3>
                                    <p className="text-sm text-text-muted max-w-[280px]">
                                        Your simulation with <span className="text-primary font-bold">{selectedConfig?.label}</span> has finished successfully.
                                    </p>
                                </div>

                                <div className="w-full grid grid-cols-2 gap-3">
                                    <div className="p-4 rounded-2xl bg-bg border border-border-subtle text-center">
                                        <span className="text-[10px] font-bold text-text-muted uppercase block">Duration</span>
                                        <span className="text-lg font-bold text-text-main">0:15</span>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-bg border border-border-subtle text-center">
                                        <span className="text-[10px] font-bold text-text-muted uppercase block">Sentiment</span>
                                        <span className="text-lg font-bold text-success">Positive</span>
                                    </div>
                                </div>

                                <div className="space-y-3 w-full">
                                    <button
                                        onClick={() => setActiveTab("history")}
                                        className="btn btn-secondary w-full py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                                    >
                                        <HistoryIcon className="w-4 h-4" />
                                        View History
                                    </button>
                                    <button
                                        onClick={handleRetry}
                                        className="btn btn-primary w-full py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" />
                                        New Test Call
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    /* History Tab */
                    <div className="space-y-4 animate-in fade-in duration-300 pb-6">
                        {selectedHistoryItem ? (
                            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                                <button
                                    onClick={() => setSelectedHistoryItem(null)}
                                    className="flex items-center gap-2 text-xs text-text-muted hover:text-primary transition-colors mb-2"
                                >
                                    <ArrowLeft className="w-3 h-3" />
                                    Back to History
                                </button>

                                <div className="space-y-6">
                                    {/* Call Info Header */}
                                    <div className="flex items-center justify-between p-4 bg-bg rounded-2xl border border-border-subtle">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-text-main">{selectedHistoryItem.agentName}</span>
                                            <span className="text-[10px] text-text-muted mt-1">{selectedHistoryItem.phoneNumber}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-tighter ${selectedHistoryItem.status === 'completed' ? 'bg-success/10 text-success border border-success/20' : 'bg-danger/10 text-danger border border-danger/20'
                                                }`}>
                                                {selectedHistoryItem.status}
                                            </span>
                                            <div className="text-[10px] text-text-muted mt-1">{formatTime(selectedHistoryItem.duration)}</div>
                                        </div>
                                    </div>

                                    {/* Summary Section */}
                                    {selectedHistoryItem.summary && (
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
                                                    <BotMessageSquare className="w-3.5 h-3.5 text-primary" />
                                                </div>
                                                <h3 className="text-xs font-bold text-text-main uppercase tracking-wider">Simulated Summary</h3>
                                            </div>
                                            <div className="bg-bg/50 rounded-xl p-4 border border-border-subtle italic text-xs text-text-main leading-relaxed">
                                                "{selectedHistoryItem.summary}"
                                            </div>
                                        </div>
                                    )}

                                    {/* Transcript Section */}
                                    <div className="space-y-4 pt-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded bg-accent/10 flex items-center justify-center">
                                                <MessageSquare className="w-3.5 h-3.5 text-accent" />
                                            </div>
                                            <h3 className="text-xs font-bold text-text-main uppercase tracking-wider">Call Transcript</h3>
                                        </div>
                                        <div className="space-y-5 px-1">
                                            {selectedHistoryItem.messages?.map((msg, index) => {
                                                const isBot = msg.role === 'bot' || msg.role === 'assistant';
                                                return (
                                                    <div key={index} className={`flex gap-3 ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
                                                        <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${isBot ? 'bg-primary/20 text-primary' : 'bg-accent/20 text-accent'}`}>
                                                            {isBot ? <BotMessageSquare className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                                                        </div>
                                                        <div className={`flex flex-col gap-1 max-w-[85%] ${isBot ? 'items-start' : 'items-end'}`}>
                                                            <div className={`relative rounded-xl p-3 text-xs leading-relaxed ${isBot
                                                                ? 'bg-bg border border-border-subtle rounded-tl-none'
                                                                : 'bg-primary text-white rounded-tr-none shadow-sm'
                                                                }`}>
                                                                <span>{msg.message}</span>
                                                            </div>
                                                            <div className="text-[9px] text-text-muted px-1">
                                                                {msg.secondsFromStart ? `${msg.secondsFromStart}s` : ''}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between px-1">
                                    <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Recent Test Calls</h3>
                                    <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">{history.length} Total</span>
                                </div>

                                {history.length > 0 ? (
                                    <div className="overflow-x-auto rounded-2xl border border-border-subtle bg-white shadow-soft">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-bg/50 border-b border-border-subtle">
                                                    <th className="py-3 px-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Agent</th>
                                                    <th className="py-3 px-4 text-[10px] font-bold text-text-muted uppercase tracking-wider text-center">Duration</th>
                                                    <th className="py-3 px-4 text-[10px] font-bold text-text-muted uppercase tracking-wider text-right">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border-subtle">
                                                {history.map((item) => (
                                                    <tr
                                                        key={item.id}
                                                        onClick={() => setSelectedHistoryItem(item)}
                                                        className="group hover:bg-bg/60 transition-all cursor-pointer"
                                                    >
                                                        <td className="py-4 px-4">
                                                            <div className="flex flex-col">
                                                                <span className="text-xs font-bold text-text-main group-hover:text-primary transition-colors leading-tight">{item.agentName}</span>
                                                                <span className="text-[10px] text-text-muted flex items-center gap-1 mt-0.5">
                                                                    <Phone className="w-2.5 h-2.5" />
                                                                    {item.phoneNumber}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-4 text-center">
                                                            <div className="flex flex-col items-center">
                                                                <span className="text-xs font-medium text-text-main">{formatTime(item.duration)}</span>
                                                                <span className="text-[9px] text-text-muted mt-0.5">{new Date(item.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-4 text-right">
                                                            <div className="flex flex-col items-end">
                                                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-tighter ${item.status === 'completed' ? 'bg-success/10 text-success border border-success/20' : 'bg-danger/10 text-danger border border-danger/20'
                                                                    }`}>
                                                                    {item.status}
                                                                </span>
                                                                <span className="text-[9px] text-text-muted mt-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    View Detail →
                                                                </span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-20 bg-bg/50 rounded-3xl border border-dashed border-border-subtle">
                                        <HistoryIcon className="w-12 h-12 text-text-muted mx-auto mb-4 opacity-20" />
                                        <h4 className="text-sm font-bold text-text-main">No history yet</h4>
                                        <p className="text-xs text-text-muted max-w-[200px] mx-auto mt-1">Start your first test call to see your activity here.</p>
                                        <button
                                            onClick={() => setActiveTab("new")}
                                            className="mt-6 text-xs text-primary font-bold hover:underline"
                                        >
                                            Make test call now
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Footer space */}
            <div className="h-6 shrink-0" />
        </div>
    );
}
