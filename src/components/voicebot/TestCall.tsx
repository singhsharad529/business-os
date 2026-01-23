import { useState, useEffect, useRef } from "react";
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
    agent: any;
}

type Step = "select-template" | "prepare-call" | "simulating" | "completed";
type Tab = "new" | "history";



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


export default function TestCall({ onCancel, agent }: TestCallProps) {
    const [activeTab, setActiveTab] = useState<Tab>("new");
    const [step, setStep] = useState<Step>("prepare-call");
    // const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [history, setHistory] = useState<any>(null);
    const [selectedHistoryItem, setSelectedHistoryItem] = useState<any | null>(null);
    const [pagination, setPagination] = useState<any>(null);
    const [historyLoading, setHistoryLoading] = useState<boolean>(false);
    const [vapi, setVapi] = useState<Vapi | null>(null);
    const [isWebCallActive, setIsWebCallActive] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [webCallStatus, setWebCallStatus] = useState<"idle" | "connecting" | "connected">("idle");
    const [transcripts, setTranscripts] = useState<{
        role: string;
        text: string;
        isFinal?: boolean;
        finalizedText?: string;
        lastFinalizedSegment?: string;
    }[]>([]);
    const transcriptEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (webCallStatus === "connected") {
            scrollToBottom();
        }
    }, [transcripts]);

    const defaultPageSize = 10;
    const fetchHistoryTestCalls = async (page: number = 1, pageSize: number = defaultPageSize) => {
        try {
            const config = {
                params: {
                    page,
                    page_size: pageSize
                }
            };
            setHistoryLoading(true);
            const response = await adminAgentService.getHistoryTestCalls(config);
            // console.log('response', response);
            if (response.data && response.data.reports) {
                setHistory(response.data.reports);

            }
            if (response.data && response.data.pagination) {
                setPagination(response.data.pagination);
            }
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

        // vapiInstance.on("call-start", () => {
        //     setWebCallStatus("connected");
        //     setIsWebCallActive(true);
        // });

        // vapiInstance.on("call-end", () => {
        //     setWebCallStatus("idle");
        //     setIsWebCallActive(false);
        //     setStep("completed");
        // });

        // vapiInstance.on("error", (error) => {
        //     console.error("Vapi Error:", error);
        //     toast.danger("Call error occurred");
        //     setWebCallStatus("idle");
        //     setIsWebCallActive(false);
        // });

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
        setStep("prepare-call");
        // setPhoneNumber("");
        setTranscripts([]);
        vapi?.stop();
        fetchHistoryTestCalls();
    };


    // const agentTemplateSize = 10;
    // const getAgentTemplates = async (page: number = 1, pageSize: number = agentTemplateSize) => {
    //     try {
    //         setTemplatesLoading(true);
    //         const config: AxiosRequestConfig = {
    //             params: {
    //                 include_inactive: false,
    //                 page,
    //                 page_size: pageSize
    //             }
    //         };
    //         const response = await adminAgentService.getAllAssistants(config);
    //         console.log(response.data.assistants);
    //         setTemplates(response.data.assistants);
    //     } catch (error) {
    //         // console.log(error);
    //         toast.danger("Failed to fetch agent templates");
    //     }
    //     finally {
    //         setTemplatesLoading(false);
    //     }
    // }


    const getUnassignedNumbers = async () => {
        try {
            const response = await voiceBotService.getNumbers({});
            console.log(response.unassignedPhoneNumbers);
            // setUnassignedNumbers(response.unassignedPhoneNumbers);
        } catch (error) {
            // console.log(error);
            toast.danger("Failed to fetch unassigned numbers");
        }
        finally {

        }
    }

    const setCallId = async (callId: string) => {
        try {
            const response = await adminAgentService.setCallId(callId, {});
            console.log(response);
        } catch (error) {
            toast.danger("Failed to set call ID");
        }
    }

    const startWebCall = async () => {
        if (!vapi || !agent?.vapiId) {
            toast.danger("Vapi not initialized or assistant ID missing");
            return;
        }

        try {
            setWebCallStatus("connecting");
            setStep("simulating");
            setTranscripts([]);
            const vapiconnected = await vapi.start(agent.vapiId);
            console.log('vapiconnected', vapiconnected);


            // Listen for events
            vapi.on('call-start', () => {
                console.log('Call started');
                setWebCallStatus("connected");
            });
            vapi.on('call-end', () => {
                console.log('Call ended');
                setWebCallStatus("idle");
                setIsWebCallActive(false);
                setStep("completed");
            });
            vapi.on('message', (message) => {
                if (message.type === 'transcript') {
                    const role = message.role;
                    const text = message.transcript;
                    const isFinal = message.transcriptType === 'final';

                    setTranscripts(prev => {
                        if (prev.length > 0) {
                            const lastIndex = prev.length - 1;
                            const last = prev[lastIndex];

                            if (last.role === role) {
                                // Same person speaking, update the current bubble
                                const newTranscripts = [...prev];
                                const updatedMsg = {
                                    ...last,
                                    finalizedText: last.finalizedText || "",
                                    lastFinalizedSegment: last.lastFinalizedSegment || ""
                                };

                                if (isFinal) {
                                    // Append this segment to the finalized portion if it's new
                                    if (updatedMsg.lastFinalizedSegment !== text) {
                                        updatedMsg.finalizedText = (updatedMsg.finalizedText ? updatedMsg.finalizedText + " " : "") + text;
                                        updatedMsg.lastFinalizedSegment = text;
                                    }
                                    updatedMsg.text = updatedMsg.finalizedText;
                                } else {
                                    // Append the current partial segment to the finalized portion for display
                                    updatedMsg.text = (updatedMsg.finalizedText ? updatedMsg.finalizedText + " " : "") + text;
                                }

                                updatedMsg.isFinal = isFinal;
                                newTranscripts[lastIndex] = updatedMsg;
                                return newTranscripts;
                            }
                        }

                        // Otherwise, append a new message bubble (new role turn)
                        return [...prev, {
                            role,
                            text,
                            isFinal,
                            finalizedText: isFinal ? text : "",
                            lastFinalizedSegment: isFinal ? text : ""
                        }];
                    });
                }
            });

            await setCallId(vapiconnected?.id as string);

        } catch (error) {
            console.error("Failed to start web call", error);
            toast.danger("Failed to start web call");
            setWebCallStatus("idle");
            setStep("prepare-call");
        }
    }

    // console.log('call and callstatus', webCallStatus);


    const stopWebCall = () => {
        if (vapi) {
            vapi.stop();
            fetchHistoryTestCalls();
        }
    };

    const toggleMute = () => {
        if (vapi) {
            vapi.setMuted(!isMuted);
            setIsMuted(!isMuted);
        }
    };

    const initialCall = async () => {
        startWebCall();
    };


    // const publishAgent = async () => {
    //     try {
    //         setPublishLoading(true);
    //         const data = {
    //             assistantId: agent?.vapiId,
    //             name: agent?.name,
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

    // useEffect(() => {

    //     if (activeTab === "new" && !templates) {
    //         getAgentTemplates();
    //     }

    // }, [activeTab])



    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Tab Header */}
            {!selectedHistoryItem && (
                <div className="flex border-b border-border-subtle mb-6">
                    <button
                        onClick={() => {
                            setActiveTab("new");
                            vapi?.stop();
                            setStep("prepare-call");
                            setTranscripts([]);
                            fetchHistoryTestCalls();

                        }}
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
                        {/* {step === "select-template" && (
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <h3 className="text-lg font-bold text-text-main">Select Agent</h3>
                                    <p className="text-sm text-text-muted">Choose an agent for your test call.</p>
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
                                                setStep("prepare-call");
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
                        )} */}
                        {step === "prepare-call" && (
                            <div className="space-y-6 duration-300">
                                {/* <button
                                    onClick={() => setStep("select-template")}
                                    className="flex items-center gap-2 text-xs text-text-muted hover:text-primary transition-colors mb-2"
                                >
                                    <ArrowLeft className="w-3 h-3" />
                                    Back to Templates
                                </button> */}
                                <div className="flex flex-col items-center text-center space-y-4">
                                    <div className={`w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary`}>
                                        <BotMessageSquare className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-text-main">Ready for Test Call?</h3>
                                        <p className="text-sm text-text-muted px-6">
                                            <span className="font-semibold text-text-main">{agent?.name}</span> is ready to talk.
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4">

                                    <button
                                        onClick={initialCall}
                                        className="btn btn-primary w-full py-4 rounded-xl text-sm font-bold shadow-glow-primary"
                                    >
                                        Start Web Call
                                    </button>
                                </div>
                                <div className="flex items-center p-2 bg-bg rounded-xl border border-border-subtle gap-3">
                                    <div className="p-2 bg-white rounded-lg border border-border-subtle">
                                        <Clock className="w-4 h-4 text-primary" />
                                    </div>
                                    <p className="text-[11px] text-text-muted leading-relaxed">
                                        The call will start right here in your browser. Please allow microphone access when prompted.
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
                                        {webCallStatus === "connecting" ? "Connecting..." : "Live Web Call"}
                                    </div>
                                    <h3 className="text-xl font-bold text-text-main">{agent?.name}</h3>
                                    <p className="text-sm text-text-muted">
                                        {webCallStatus === "connecting" ? "Please wait while we connect you..." : "You are now talking to the agent"}
                                    </p>
                                </div>

                                <div className="w-full max-h-[300px] overflow-y-auto space-y-3 p-4 bg-bg rounded-2xl border border-border-subtle custom-scrollbar">
                                    {transcripts.length === 0 ? (
                                        <p className="text-xs text-text-muted text-center italic py-4">Waiting for agent to speak...</p>
                                    ) : (
                                        <>
                                            {transcripts.map((t, i) => (
                                                <div key={i} className={`flex flex-col ${t.role === 'user' ? 'items-end' : 'items-start'}`}>
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1 px-1">
                                                        {t.role === 'user' ? 'You' : agent?.name}
                                                    </span>
                                                    <div className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${t.role === 'user'
                                                        ? 'bg-primary text-white rounded-tr-none'
                                                        : 'bg-white border border-border-subtle text-text-main rounded-tl-none'
                                                        }`}>
                                                        {t.text}
                                                    </div>
                                                </div>
                                            ))}
                                            <div ref={transcriptEndRef} />
                                        </>
                                    )}
                                </div>

                                {webCallStatus === "connected" && (
                                    <div className="flex gap-4">
                                        {/* <button
                                            onClick={toggleMute}
                                            className={`p-4 rounded-full border transition-all ${isMuted ? "bg-danger/10 border-danger text-danger" : "bg-bg border-border-subtle text-text-main"}`}
                                        >
                                            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                                        </button> */}
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
                            </div>
                        )}
                        {step === "completed" && (
                            <div className="flex flex-col items-center justify-center py-6 space-y-6 animate-in fade-in duration-500">
                                <div className="flex flex-col items-center space-y-3">
                                    <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center text-success">
                                        <BotMessageSquare className="w-8 h-8" />
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-xl font-bold text-text-main">Call Summary</h3>
                                        <p className="text-sm text-text-muted">The call has ended. You can review the transcript below.</p>
                                    </div>
                                </div>

                                <div className="w-full max-h-[350px] overflow-y-auto space-y-3 p-4 bg-bg rounded-2xl border border-border-subtle custom-scrollbar">
                                    {transcripts.length === 0 ? (
                                        <p className="text-xs text-text-muted text-center italic py-4">No transcript available.</p>
                                    ) : (
                                        <>
                                            {transcripts.map((t, i) => (
                                                <div key={i} className={`flex flex-col ${t.role === 'user' ? 'items-end' : 'items-start'}`}>
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1 px-1">
                                                        {t.role === 'user' ? 'You' : (agent?.name || 'Agent')}
                                                    </span>
                                                    <div className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${t.role === 'user'
                                                        ? 'bg-primary text-white rounded-tr-none'
                                                        : 'bg-white border border-border-subtle text-text-main rounded-tl-none'
                                                        }`}>
                                                        {t.text}
                                                    </div>
                                                </div>
                                            ))}
                                        </>
                                    )}
                                </div>

                                <div className="w-full grid grid-cols-2 gap-3">
                                    <button
                                        onClick={handleRetry}
                                        className="btn btn-primary py-2 rounded-xl text-sm font-bold shadow-glow-primary"
                                    >
                                        Try Another
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("history")}
                                        className="btn btn-secondary py-2 rounded-xl text-sm font-bold"
                                    >
                                        History
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
                                                                            onClick={() => setSelectedHistoryItem({
                                                                                ...item,
                                                                                customerNumber: item.customerNumber || (item.type === 'webCall' ? 'Web User' : (item.status === 'initiated' ? 'Pending' : 'N/A')),
                                                                                status: (item.status?.split('.').pop() || item.status || 'Ended').replace(/-/g, ' '),
                                                                                phoneNumber: item.phoneNumber || (item.type === 'webCall' ? 'Browser' : 'N/A')
                                                                            })}
                                                                            className="group hover:bg-bg/60 transition-all cursor-pointer"
                                                                        >
                                                                            <td className="py-4 px-4">
                                                                                <div className="flex flex-col">
                                                                                    <span className="text-xs font-bold text-text-main group-hover:text-primary transition-colors leading-tight">{item.assistantName || 'Untitled Assistant'}</span>
                                                                                    <span className="text-[10px] text-text-muted flex items-center gap-1 mt-0.5">
                                                                                        {item.type === 'webCall' ? <BotMessageSquare className="w-2.5 h-2.5 text-primary" /> : <Phone className="w-2.5 h-2.5 text-primary/60" />}
                                                                                        <span className="capitalize">{item.customerNumber || item.type?.replace(/([A-Z])/g, ' $1') || (item.status === 'initiated' ? 'Initiated' : 'N/A')}</span>
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
                                                                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-tighter ${item.status?.includes('ended') || item.status === 'completed'
                                                                                        ? 'bg-success/10 text-success border border-success/20'
                                                                                        : item.status?.includes('error') || item.status === 'failed'
                                                                                            ? 'bg-danger/10 text-danger border border-danger/20'
                                                                                            : 'bg-primary/10 text-primary border border-primary/20'
                                                                                        }`}>
                                                                                        {(item.status?.split('.').pop() || 'Ended').replace(/-/g, ' ')}
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
                                                                totalCount={pagination?.total}
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
