import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { BotMessageSquare, Phone, Briefcase, Languages, ArrowLeft, Copy, Check } from "lucide-react";
import { toast } from "@/hooks/useToast";

interface TestCallProps {
    onCancel: () => void;
}

type Step = "select" | "instruction";

export default function TestCall({ onCancel }: TestCallProps) {
    const { agents } = useData();
    const [step, setStep] = useState<Step>("select");
    const [selectedAgent, setSelectedAgent] = useState<any>(null);
    const [copied, setCopied] = useState(false);

    const handleSelectAgent = (agent: any) => {
        setSelectedAgent(agent);
        setStep("instruction");
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.info("Phone number copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
    };

    if (step === "select") {
        return (
            <div className="space-y-4">
                <div className="mb-4">
                    <h3 className="text-sm font-semibold text-text-main">Choose an Agent to test</h3>
                    <p className="text-xs text-text-muted">Select an agent to see their dedicated testing number.</p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    {agents?.agents?.map((agent: any) => (
                        <div
                            key={agent.id}
                            className="card p-4 hover:border-primary cursor-pointer transition-all group relative overflow-hidden"
                            onClick={() => handleSelectAgent(agent)}
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex gap-3">
                                    <div className="p-2 bg-primary-soft rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                        <BotMessageSquare className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-text-main">{agent.name}</h4>
                                        <div className="flex items-center gap-2 text-[10px] text-text-muted uppercase mt-0.5">
                                            <Briefcase className="w-2.5 h-2.5" />
                                            <span>{agent.metadata?.department}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Phone className="w-4 h-4 fill-current" />
                                </div>
                            </div>
                            <div className="mt-3 flex items-center gap-3">
                                <div className="flex items-center gap-1.5 text-[10px] text-text-main">
                                    <Languages className="w-2.5 h-2.5 text-text-muted" />
                                    <span>{agent.metadata?.language}</span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {(!agents?.agents || agents.agents.length === 0) && (
                        <div className="text-center py-12 bg-bg rounded-xl border border-dashed border-border">
                            <BotMessageSquare className="w-10 h-10 text-text-muted mx-auto mb-2 opacity-50" />
                            <p className="text-sm text-text-muted">No agents available to test.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    const phoneNumber = selectedAgent?.phoneNumbers?.[0]?.number || "Number not assigned";

    return (
        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
            <button
                onClick={() => setStep("select")}
                className="flex items-center gap-2 text-xs text-text-muted hover:text-primary transition-colors"
            >
                <ArrowLeft className="w-3 h-3" />
                Back to agent list
            </button>

            <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <Phone className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                    <h3 className="text-xl font-bold text-text-main">Call your Agent</h3>
                    <p className="text-sm text-text-muted max-w-[280px] mx-auto">
                        Please dial the number below to start a test conversation with <span className="text-primary font-semibold">{selectedAgent.name}</span>.
                    </p>
                </div>

                <div className="w-full bg-bg border border-border-subtle rounded-2xl p-6 space-y-4">
                    <div className="space-y-1">
                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Dedicated Test Number</span>
                        <div className="flex items-center justify-center gap-3">
                            <div className="text-2xl font-mono font-bold text-primary tracking-tight">
                                {phoneNumber}
                            </div>
                            <button
                                onClick={() => copyToClipboard(phoneNumber)}
                                className="p-2 hover:bg-white rounded-lg transition-colors text-text-muted hover:text-primary"
                                title="Copy number"
                            >
                                {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 w-full">
                    <p className="text-xs text-text-main leading-relaxed">
                        <strong>Note:</strong> Once your call is disconnected, you can view the detailed call logs, transcript, and AI analysis in the <span className="font-bold">Call History</span> section of the dashboard.
                    </p>
                </div>
            </div>

            <div className="pt-4">
                <button
                    onClick={onCancel}
                    className="btn btn-primary w-full rounded-xl"
                >
                    Done
                </button>
            </div>
        </div>
    );
}

