import { useState, useEffect } from "react";
import {
    BotMessageSquare,
    Phone,
    ArrowLeft,
    Clock,
    PhoneCall,
    History as HistoryIcon,
    Plus,
    Dot,
    Loader2,
    User2,
    BookPlus,
    Mic,
    MicOff
} from "lucide-react";
import Vapi from "@vapi-ai/web";
import { toast } from "@/hooks/useToast";
import voiceBotService from "@/api/voicebotService";
import { AxiosRequestConfig } from "axios";
import { Skeleton } from "../ui/skeleton";
import { CallDetails } from "./CallDetails";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Pagination from "@/components/common/Pagination";
import TableLoader from "../common/TableLoader";
import adminAgentService from "@/api/adminAgentService";

interface TestCallProps {
    onCancel: () => void;
}

type Step = "select-template" | "input-number" | "simulating" | "completed";
type Tab = "new" | "history";

interface TemplateConfig {
    id: string;
    value: string;
    label: string;
    description: string;
}




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


interface Number {
    id: string;
    vapiId: string;
    orgId: string;
    provider: string;
    number: string;
    credentialId: string;
    assistantId: string;
    name: string;
    status: string;
    twilioAccountSid: string;
    twilioAuthToken: string;
    createdAt: string;
    updatedAt: string;
}


export default function TestCall({ onCancel }: TestCallProps) {
    const [activeTab, setActiveTab] = useState<Tab>("new");
    const [step, setStep] = useState<Step>("select-template");
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [history, setHistory] = useState<any>(null);
    const [selectedHistoryItem, setSelectedHistoryItem] = useState<any | null>(null);
    const [templates, setTemplates] = useState<any | null>(null);
    const [templatesLoading, setTemplatesLoading] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);
    const [initialCallLoading, setInitialCallLoading] = useState(false);
    const [unassignedNumbers, setUnassignedNumbers] = useState<Number[]>([]);
    const [publishLoading, setPublishLoading] = useState<boolean>(false);
    const [selectedNumber, setSelectedNumber] = useState<string>("");
    const [pagination, setPagination] = useState<any>(null);
    const [historyLoading, setHistoryLoading] = useState<boolean>(false);
    const [callType, setCallType] = useState<"outbound" | "web">("web");
    const [vapi, setVapi] = useState<Vapi | null>(null);
    const [isWebCallActive, setIsWebCallActive] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [webCallStatus, setWebCallStatus] = useState<"idle" | "connecting" | "connected">("idle");

    const defaultPageSize = 10;
    const fetchHistoryTestCalls = async (page: number = 1, pageSize: number = defaultPageSize) => {
        try {
            const config = {
                params: {
                    isTestCall: true,
                    page,
                    page_size: pageSize
                }
            };
            setHistoryLoading(true);
            const response = await voiceBotService.getHistoryTestCalls(config);
            // console.log('response', response);
            setHistory(response.reports);
            setPagination(response.pagination);
        } catch (error) {
            console.error("Failed to fetch history test calls", error);
            toast.danger("Failed to fetch history test calls");
        }
        finally {
            setHistoryLoading(false);
        }
    }

    const handlePageChange = (page: number) => {
        fetchHistoryTestCalls(page, defaultPageSize);
    };

    useEffect(() => {
        fetchHistoryTestCalls();

        // Initialize Vapi
        const vapiInstance = new Vapi(import.meta.env.VITE_VAPI_PUBLIC_KEY || "2b18e02a-bad5-493e-91eb-fdfeea7d1763"); // Using orgId as fallback or let user define in .env
        setVapi(vapiInstance);

        vapiInstance.on("call-start", () => {
            setWebCallStatus("connected");
            setIsWebCallActive(true);
        });

        vapiInstance.on("call-end", () => {
            setWebCallStatus("idle");
            setIsWebCallActive(false);
            setStep("completed");
        });

        vapiInstance.on("error", (error) => {
            console.error("Vapi Error:", error);
            toast.danger("Call error occurred");
            setWebCallStatus("idle");
            setIsWebCallActive(false);
        });

        return () => {
            vapiInstance.stop();
        };
    }, []);


    const formatTime = (seconds: number | null) => {
        if (!seconds) return "0:00";
        const totalSeconds = Math.floor(seconds);
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const handleRetry = () => {
        setStep("select-template");
        setPhoneNumber("");
        setName("");
        setSelectedTemplate(null);
        vapi?.stop()
    };


    const agentTemplateSize = 10;
    const getAgentTemplates = async (page: number = 1, pageSize: number = agentTemplateSize) => {
        try {
            setTemplatesLoading(true);
            const config: AxiosRequestConfig = {
                params: {
                    include_inactive: false,
                    page,
                    page_size: pageSize
                }
            };
            const response = await adminAgentService.getAllAssistants(config);
            console.log(response.data.assistants);
            setTemplates(response.data.assistants);
        } catch (error) {
            // console.log(error);
            toast.danger("Failed to fetch agent templates");
        }
        finally {
            setTemplatesLoading(false);
        }
    }


    const getUnassignedNumbers = async () => {
        try {
            const response = await voiceBotService.getNumbers({});
            console.log(response.unassignedPhoneNumbers);
            setUnassignedNumbers(response.unassignedPhoneNumbers);
        } catch (error) {
            // console.log(error);
            toast.danger("Failed to fetch unassigned numbers");
        }
        finally {

        }
    }

    const startWebCall = async () => {
        console.log(selectedTemplate);
        if (!vapi || !selectedTemplate?.vapiId) {
            toast.danger("Vapi not initialized or assistant ID missing");
            return;
        }

        try {
            setWebCallStatus("connecting");
            setStep("simulating");
            await vapi.start(selectedTemplate.vapiId);

            // Listen for events
            vapi.on('call-start', () => console.log('Call started'));
            vapi.on('call-end', () => console.log('Call ended'));
            vapi.on('message', (message) => {
                if (message.type === 'transcript') {
                    console.log(`${message.role}: ${message.transcript}`);
                }
            });
        } catch (error) {
            console.error("Failed to start web call", error);
            toast.danger("Failed to start web call");
            setWebCallStatus("idle");
            setStep("input-number");
        }
    }

    console.log('call and callstatus', callType, webCallStatus);


    const stopWebCall = () => {
        if (vapi) {
            vapi.stop();
        }
    };

    const toggleMute = () => {
        if (vapi) {
            vapi.setMuted(!isMuted);
            setIsMuted(!isMuted);
        }
    };

    const initialCall = async () => {
        if (callType === "web") {
            startWebCall();
            return;
        }

        try {
            setInitialCallLoading(true);
            const data = {
                assistantId: selectedTemplate?.vapiId,
                customerNumber: phoneNumber,
                customerName: name
            }
            const response = await voiceBotService.testCall(data, {});
            console.log(response);
            setStep("simulating");
            getUnassignedNumbers();
        } catch (error) {
            // console.log(error);
            toast.danger("Failed to make initial call");
        }
        finally {
            setInitialCallLoading(false);
        }
    }


    // const publishAgent = async () => {
    //     try {
    //         setPublishLoading(true);
    //         const data = {
    //             assistantId: selectedTemplate?.vapiId,
    //             name: selectedTemplate?.name,
    //             phoneNumberId: selectedNumber
    //         }
    //         const response = await voiceBotService.publishAgent(data, {});
    //         console.log(response);
    //         toast.success("Agent published successfully");
    //         handleRetry();

    //     } catch (error) {
    //         toast.danger("Failed to publish agent");
    //     }
    //     finally {
    //         setPublishLoading(false);
    //     }
    // }

    useEffect(() => {

        if (activeTab === "new" && !templates) {
            getAgentTemplates();
        }

    }, [activeTab])



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
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">



                        {step === "select-template" && (
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
                                    ) : templates?.map((template: any) => (
                                        <button
                                            key={template.id}
                                            onClick={() => {
                                                setSelectedTemplate(template);
                                                setStep("input-number");
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

                        {step === "input-number" && (
                            <div className="space-y-6 duration-300">
                                <button
                                    onClick={() => setStep("select-template")}
                                    className="flex items-center gap-2 text-xs text-text-muted hover:text-primary transition-colors mb-2"
                                >
                                    <ArrowLeft className="w-3 h-3" />
                                    Back to Templates
                                </button>
                                <div className="flex flex-col items-center text-center space-y-4">
                                    <div className={`w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary`}>
                                        <Phone className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-text-main">Ready for Test Call?</h3>
                                        <p className="text-sm text-text-muted px-6">
                                            <span className="font-semibold text-text-main">{selectedTemplate?.name}</span> is ready to talk.
                                        </p>
                                    </div>
                                </div>

                                {/* <div className="flex p-1 bg-bg rounded-xl border border-border-subtle">
                                    <button
                                        onClick={() => setCallType("web")}
                                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${callType === "web" ? "bg-white text-primary shadow-sm" : "text-text-muted hover:text-text-main"}`}
                                    >
                                        Web Call
                                    </button>
                                    <button
                                        onClick={() => setCallType("outbound")}
                                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${callType === "outbound" ? "bg-white text-primary shadow-sm" : "text-text-muted hover:text-text-main"}`}
                                    >
                                        Phone Call
                                    </button>
                                </div> */}

                                <div className="space-y-4 pt-4">
                                    {callType === "outbound" && (
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


                                            <label className="text-xs font-semibold text-text-main flex items-center gap-2">
                                                Your Name
                                                <span className="text-[10px] font-normal text-text-muted px-1.5 py-0.5 bg-bg border border-border-subtle rounded text-primary">Required</span>
                                            </label>
                                            <div className="relative">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
                                                    <User2 className="w-4 h-4" />
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Enter your name"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    className="w-full bg-white border border-border-subtle rounded-xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        onClick={initialCall}
                                        className="btn btn-primary w-full py-4 rounded-xl text-sm font-bold shadow-glow-primary"
                                    >
                                        {initialCallLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : callType === "web" ? "Start Web Call" : "Start My Test Call"}
                                    </button>
                                </div>
                                <div className="flex items-center p-2 bg-bg rounded-xl border border-border-subtle gap-3">
                                    <div className="p-2 bg-white rounded-lg border border-border-subtle">
                                        <Clock className="w-4 h-4 text-primary" />
                                    </div>
                                    <p className="text-[11px] text-text-muted leading-relaxed">
                                        {callType === "web"
                                            ? "The call will start right here in your browser. Please allow microphone access when prompted."
                                            : "You'll receive an outbound call automatically. Please ensure your line is free to pick up."}
                                    </p>
                                </div>
                            </div>
                        )}


                        {step === "simulating" && (
                            <div className="flex flex-col items-center justify-center py-10 space-y-8 animate-in fade-in duration-500">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping scale-150" />
                                    <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse scale-125" />
                                    <div className="relative w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white shadow-glow">
                                        <PhoneCall className="w-10 h-10" />
                                    </div>
                                </div>

                                <div className="text-center space-y-2">
                                    <div className="flex items-center justify-center gap-2 text-primary font-bold uppercase tracking-widest text-[10px]">
                                        <Dot className="w-4 h-4 animate-bounce" />
                                        {callType === "web" ? (webCallStatus === "connecting" ? "Connecting..." : "Live Web Call") : "Initiated Call"}
                                    </div>
                                    <h3 className="text-xl font-bold text-text-main">{selectedTemplate?.name}</h3>
                                    <p className="text-sm text-text-muted">
                                        {callType === "web"
                                            ? (webCallStatus === "connecting" ? "Please wait while we connect you..." : "You are now talking to the agent")
                                            : "Please pick up the call"}
                                    </p>
                                    {callType === "outbound" && <p className="text-sm text-text-muted">{phoneNumber}</p>}
                                </div>

                                {callType === "web" && webCallStatus === "connected" && (
                                    <div className="flex gap-4">
                                        <button
                                            onClick={toggleMute}
                                            className={`p-4 rounded-full border transition-all ${isMuted ? "bg-danger/10 border-danger text-danger" : "bg-bg border-border-subtle text-text-main"}`}
                                        >
                                            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                                        </button>
                                        <button
                                            onClick={stopWebCall}
                                            className="p-4 rounded-full bg-danger text-white shadow-glow-danger"
                                        >
                                            <Phone className="w-6 h-6 rotate-[135deg]" />
                                        </button>
                                    </div>
                                )}



                                <div className="w-full flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => setActiveTab("history")}
                                        className="btn btn-secondary w-full py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                                    >
                                        <HistoryIcon className="w-4 h-4" />
                                        View History
                                    </button>
                                    <button
                                        onClick={handleRetry}
                                        className="btn btn-primary w-full py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" />
                                        New Test Call
                                    </button>
                                </div>

                                <hr className="my-4" />

                                {/* <div>
                                    <p className="text-lg font-bold text-text-main">Publish Agent</p>

                                </div>
                                <div className="w-full flex flex-col gap-2">
                                    <div>
                                        <p className="text-md font-bold text-text-main">Agent Name</p>
                                        <input type="text" value={selectedTemplate?.name} className="input input-bordered w-full disabled:opacity-50" disabled />
                                    </div>
                                    <div>
                                        <p className="text-md font-bold text-text-main">Select Number</p>

                                        <Select
                                            value={selectedNumber}
                                            onValueChange={(value) => setSelectedNumber(value)}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Number" />
                                            </SelectTrigger>
                                            <SelectContent>

                                                {unassignedNumbers.map((number: Number) => (
                                                    <SelectItem key={number?.id} value={number?.vapiId}>
                                                        {number?.number}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="w-full">
                                    <button
                                        onClick={publishAgent}
                                        className="btn btn-primary w-full py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                                    >
                                        <BookPlus className="w-4 h-4" />
                                        {publishLoading ? "Publishing..." : "Publish Agent"}
                                    </button>
                                </div> */}
                            </div>
                        )}
                        {step === "completed" && (
                            <div className="flex flex-col items-center justify-center py-10 space-y-6 animate-in fade-in duration-500">
                                <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center text-success">
                                    <BotMessageSquare className="w-10 h-10" />
                                </div>
                                <div className="text-center space-y-2">
                                    <h3 className="text-xl font-bold text-text-main">Test Call Completed</h3>
                                    <p className="text-sm text-text-muted">Thanks for testing our AI agent!</p>
                                </div>
                                <div className="w-full flex flex-col gap-3">
                                    <button
                                        onClick={handleRetry}
                                        className="btn btn-primary w-full py-4 rounded-xl text-sm font-bold shadow-glow-primary"
                                    >
                                        Try Another Template
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("history")}
                                        className="btn btn-secondary w-full py-4 rounded-xl text-sm font-bold"
                                    >
                                        View Call History
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
                                    <CallDetails call={selectedHistoryItem} />
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between px-1">
                                    <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Recent Test Calls</h3>
                                    <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">{history?.length} Total</span>
                                </div>

                                <>
                                    {
                                        historyLoading ? (
                                            <TableLoader rows={4} columns={3} />
                                        ) : (

                                            <>
                                                {history && history.length > 0 ? (
                                                    <>
                                                        <div className="overflow-x-auto rounded-2xl border border-border-subtle bg-white">
                                                            <table className="w-full text-left border-collapse">
                                                                <thead>
                                                                    <tr className="bg-bg/50 border-b border-border-subtle">
                                                                        <th className="py-3 px-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Agent</th>
                                                                        <th className="py-3 px-4 text-[10px] font-bold text-text-muted uppercase tracking-wider text-center">Duration</th>
                                                                        <th className="py-3 px-4 text-[10px] font-bold text-text-muted uppercase tracking-wider text-right">Status</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody className="divide-y divide-border-subtle">
                                                                    {history?.map((item: any) => (
                                                                        <tr
                                                                            key={item.id}
                                                                            onClick={() => setSelectedHistoryItem(item)}
                                                                            className="group hover:bg-bg/60 transition-all cursor-pointer"
                                                                        >
                                                                            <td className="py-4 px-4">
                                                                                <div className="flex flex-col">
                                                                                    <span className="text-xs font-bold text-text-main group-hover:text-primary transition-colors leading-tight">{item.assistantName || 'Unknown Agent'}</span>
                                                                                    <span className="text-[10px] text-text-muted flex items-center gap-1 mt-0.5">
                                                                                        <Phone className="w-2.5 h-2.5" />
                                                                                        {item.customerNumber}
                                                                                    </span>
                                                                                </div>
                                                                            </td>
                                                                            <td className="py-4 px-4 text-center">
                                                                                <div className="flex flex-col items-center">
                                                                                    <span className="text-xs font-medium text-text-main">{formatTime(item.durationSeconds)}</span>
                                                                                    <span className="text-[9px] text-text-muted mt-0.5">{new Date(item.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                                                </div>
                                                                            </td>
                                                                            <td className="py-4 px-4 text-right">
                                                                                <div className="flex flex-col items-end">
                                                                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-tighter ${item.status === 'completed' || item.status === 'customer-ended-call' || item.status === 'assistant-ended-call'
                                                                                        ? 'bg-success/10 text-success border border-success/20'
                                                                                        : 'bg-danger/10 text-danger border border-danger/20'
                                                                                        }`}>
                                                                                        {item.status?.replace(/-/g, ' ')}
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
                                                        {pagination && (
                                                            <Pagination
                                                                currentPage={pagination?.page}
                                                                totalPages={pagination?.totalPages}
                                                                pageSize={pagination?.pageSize}
                                                                totalCount={pagination?.totalCount}
                                                                onPageChange={handlePageChange}
                                                            />
                                                        )}
                                                    </>
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

                                        )
                                    }
                                </>
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
