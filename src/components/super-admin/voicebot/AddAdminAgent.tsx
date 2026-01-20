import { useState, useEffect } from "react";
import adminAgentService from "@/api/adminAgentService";
import { toast } from "@/hooks/useToast";
import {
    Cpu,
    Languages,
    Settings,
    Plus,
    X,
    Save,
    BotMessageSquare,
    Volume2,
    Zap,
    Tags,
    MessageSquare,
    VolumeX,
    ChevronRight,
    Search,
    Play,
    Pause
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { AxiosRequestConfig } from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import Pagination from "@/components/common/Pagination";

interface AddAdminAgentProps {
    onClose: () => void;
    onSuccess: () => void;
    category: any;
}



const MODELS_DATA = {
    "openai": {
        "provider": "openai",
        "type": "llm",
        "count": 9,
        "models": [
            "gpt-4o",
            "gpt-4o-mini",
            "gpt-4-turbo",
            "gpt-4-turbo-preview",
            "gpt-4-0125-preview",
            "gpt-4-1106-preview",
            "gpt-4",
            "gpt-3.5-turbo",
            "gpt-3.5-turbo-0125"
        ],
        "recommended": [
            "gpt-4o",
            "gpt-4o-mini",
            "gpt-4-turbo"
        ]
    }
};

const VOICES_DATA = [
    {
        "name": "Roger",
        "description": "Laid-Back, Casual, Resonant",
        "voiceId": "CwhRBWXzGAHq8TQ4Fs17",
        "provider": "11labs",
        "type": "premade",
        "preview": "https://storage.googleapis.com/eleven-public-prod/premade/voices/CwhRBWXzGAHq8TQ4Fs17/df6788f9-5c96-470d-8312-aab3b3d8f50a.mp3"
    },
    {
        "name": "Sarah",
        "description": "Mature, Reassuring, Confident",
        "voiceId": "EXAVITQu4vr4xnSDxMaL",
        "provider": "11labs",
        "type": "premade",
        "preview": "https://storage.googleapis.com/eleven-public-prod/premade/voices/EXAVITQu4vr4xnSDxMaL/01a3e33c-6e99-4ee7-8543-ff2216a32186.mp3"
    },
    {
        "name": "Laura",
        "description": "Enthusiast, Quirky Attitude",
        "voiceId": "FGY2WhTYpPnrIDTdsKH5",
        "provider": "11labs",
        "type": "premade"
    },
    {
        "name": "Charlie",
        "description": "Deep, Confident, Energetic",
        "voiceId": "IKne3meq5aSn9XLyUdCD",
        "provider": "11labs",
        "type": "premade"
    },
    {
        "name": "George",
        "description": "Warm, Captivating Storyteller",
        "voiceId": "JBFqnCBsd6RMkjVDRZzb",
        "provider": "11labs",
        "type": "premade"
    },
    {
        "name": "Callum",
        "description": "Husky Trickster",
        "voiceId": "N2lVS1w4EtoT3dr4eOWO",
        "provider": "11labs",
        "type": "premade"
    },
    {
        "name": "River",
        "description": "Relaxed, Neutral, Informative",
        "voiceId": "SAz9YHcvj6GT2YYXdXww",
        "provider": "11labs",
        "type": "premade"
    },
    {
        "name": "Harry",
        "description": "Fierce Warrior",
        "voiceId": "SOYHLrjzK2X1ezoPC6cr",
        "provider": "11labs",
        "type": "premade"
    },
    {
        "name": "Liam",
        "description": "Energetic, Social Media Creator",
        "voiceId": "TX3LPaxmHKxFdv7VOQHJ",
        "provider": "11labs",
        "type": "premade"
    },
    {
        "name": "Alice",
        "description": "Clear, Engaging Educator",
        "voiceId": "Xb7hH8MSUJpSbSDYk0k2",
        "provider": "11labs",
        "type": "premade"
    },
    {
        "name": "Matilda",
        "description": "Knowledgable, Professional",
        "voiceId": "XrExE9yKIg1WjnnlVkGX",
        "provider": "11labs",
        "type": "premade"
    }
];

const TRANSCRIBER_DATA = {
    "deepgram": {
        "provider": "deepgram",
        "type": "stt",
        "count": 2,
        "models": [
            "nova-2",
            "nova-3"
        ],
        "recommended": [
            "nova-2"
        ]
    }
};

const BACKGROUND_SOUNDS = [
    "off",
    "office",
    "cafe",
    "restaurant",
    "park",
    "street"
];

const DEFAULT_FORM_DATA = {
    name: "",
    department: "",
    version: "1.0",
    model: {
        provider: "openai",
        model: "gpt-4o",
        temperature: 0.7,
        maxTokens: 500,
        systemPrompt: "",
        toolIds: [] as string[]
    },
    voice: {
        provider: "11labs",
        voiceId: "21m00Tcm4TlvDq8ikWAM",
        speed: 1.0,
        cachingEnabled: true
    },
    transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: "en"
    },
    advanced: {
        firstMessage: "",
        firstMessageMode: "assistant-speaks-first",
        maxDurationSeconds: 1800,
        backgroundSound: "office",
        endCallMessage: "",
        endCallPhrases: [] as string[]
    }
};

function AddAdminAgent({ onClose, onSuccess, category }: AddAdminAgentProps) {
    const [step, setStep] = useState<"selection" | "templates" | "form">("selection");
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState<"model" | "voice" | "transcriber" | "advanced">("model");
    const [formData, setFormData] = useState<any>(DEFAULT_FORM_DATA);
    const [templates, setTemplates] = useState<any[]>([]);
    const [templatesPagination, setTemplatesPagination] = useState<any>(null);
    const [modelsData, setModelsData] = useState<any>(null);
    const [voicesData, setVoicesData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [createagentLoading, setcreateagentLoading] = useState(false);
    const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

    const handleTogglePlay = (voice: any, e: React.MouseEvent) => {
        e.stopPropagation();
        if (playingVoiceId === voice.voiceId) {
            audio?.pause();
            setPlayingVoiceId(null);
        } else {
            if (audio) {
                audio.pause();
            }
            const newAudio = new Audio(voice.preview);
            newAudio.play();
            newAudio.onended = () => setPlayingVoiceId(null);
            setAudio(newAudio);
            setPlayingVoiceId(voice.voiceId);
        }
    };

    useEffect(() => {
        return () => {
            if (audio) {
                audio.pause();
            }
        };
    }, [audio]);

    useEffect(() => {
        if (audio) {
            audio.pause();
            setPlayingVoiceId(null);
        }
    }, [activeTab]);

    // console.log('category', category);


    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [modelsRes, voicesRes] = await Promise.all([
                    adminAgentService.getListModels(),
                    adminAgentService.getVoices()
                ]);
                setModelsData(modelsRes);
                // Extract voices array from the response object
                if (voicesRes && voicesRes.voices) {
                    setVoicesData(voicesRes.voices);
                } else if (Array.isArray(voicesRes)) {
                    setVoicesData(voicesRes);
                }
            } catch (error) {
                console.error("Error fetching initial data:", error);
                toast.danger("Error fetching initial data");
                // Fallback to hardcoded data if API fails or use local constants
                // setModelsData(MODELS_DATA);
                // setVoicesData(VOICES_DATA);
            }
        };
        fetchInitialData();
    }, []);

    const templatesPageSize: number = 10;
    const fetchTemplates = async (page: number = 1, pageSize: number = templatesPageSize) => {
        setIsLoading(true);
        try {
            const config: AxiosRequestConfig = {
                params: {
                    type: "TEMPLATE",
                    page: page,
                    page_size: pageSize
                }
            }
            const res = await adminAgentService.getAllTemplates(config);
            if (res.data && res.data.assistants) {
                setTemplates(res.data.assistants);
            }
            if (res.data && res.data.pagination) {
                setTemplatesPagination(res.data.pagination);
            }
        } catch (error) {
            console.error("Error fetching templates:", error);
            // setTemplates(TEMPLATES_DATA);
            toast.danger("Error fetching templates");
        } finally {
            setIsLoading(false);
        }
    };

    const handleTemplatesPagination = (page: number) => {
        fetchTemplates(page);
    };

    const handleCreateFromScratch = () => {
        setFormData(DEFAULT_FORM_DATA);
        setStep("form");
    };

    const handleSelectFromTemplate = () => {
        fetchTemplates();
        setStep("templates");
    };

    const handleSelectTemplate = (template: any) => {
        const systemPrompt = template.model.messages
            ?.filter((m: any) => m.role === "system")
            .map((m: any) => m.content)
            .join("\n") || "";

        setFormData({
            name: template.name,
            department: template.metadata?.department || "",
            version: template.metadata?.version || "1.0",
            model: {
                provider: template.model?.provider || "openai",
                model: template.model?.model || "gpt-4-turbo",
                temperature: template.model?.temperature || 0.6,
                maxTokens: template.model?.maxTokens || 1500,
                systemPrompt: systemPrompt,
                toolIds: template.model?.toolIds || []
            },
            voice: {
                provider: template.voice?.provider || "11labs",
                voiceId: template.voice?.voiceId || "",
                speed: template.voice?.speed || 1,
                cachingEnabled: true
            },
            transcriber: {
                provider: template.transcriber?.provider || "deepgram",
                model: template.transcriber?.model || "nova-2",
                language: template.transcriber?.language || "en"
            },
            advanced: {
                firstMessage: template.firstMessage || "",
                firstMessageMode: "assistant-speaks-first",
                maxDurationSeconds: 1800,
                backgroundSound: template.backgroundSound || "office",
                endCallMessage: template.endCallMessage || "Thank you for calling. Goodbye!",
                endCallPhrases: template.endCallPhrases || []
            }
        });
        setStep("form");
    };

    const [newToolId, setNewToolId] = useState("");
    const [newEndCallPhrase, setNewEndCallPhrase] = useState("");

    const handleAddToolId = () => {
        if (newToolId.trim()) {
            setFormData((prev: any) => ({
                ...prev,
                model: {
                    ...prev.model,
                    toolIds: [...(prev.model.toolIds || []), newToolId.trim()]
                }
            }));
            setNewToolId("");
        }
    };

    const handleRemoveToolId = (index: number) => {
        setFormData((prev: any) => ({
            ...prev,
            model: {
                ...prev.model,
                toolIds: prev.model.toolIds.filter((_: any, i: number) => i !== index)
            }
        }));
    };

    const handleAddEndCallPhrase = () => {
        if (newEndCallPhrase.trim()) {
            setFormData((prev: any) => ({
                ...prev,
                advanced: {
                    ...prev.advanced,
                    endCallPhrases: [...(prev.advanced.endCallPhrases || []), newEndCallPhrase.trim()]
                }
            }));
            setNewEndCallPhrase("");
        }
    };

    const handleRemoveEndCallPhrase = (index: number) => {
        setFormData((prev: any) => ({
            ...prev,
            advanced: {
                ...prev.advanced,
                endCallPhrases: prev.advanced.endCallPhrases.filter((_: any, i: number) => i !== index)
            }
        }));
    };

    const handleSave = async () => {
        setcreateagentLoading(true);
        try {
            // Transform formData for API
            const apiPayload = {
                categoryId: category.id,
                name: formData.name,
                model: {
                    provider: formData.model.provider,
                    model: formData.model.model,
                    messages: [
                        {
                            role: "system",
                            content: formData.model.systemPrompt
                        }
                    ],
                    temperature: formData.model.temperature,
                    maxTokens: formData.model.maxTokens,
                    toolIds: formData.model.toolIds
                },
                voice: {
                    provider: formData.voice.provider,
                    voiceId: formData.voice.voiceId,
                    speed: formData.voice.speed,
                    cachingEnabled: formData.voice.cachingEnabled
                },
                transcriber: {
                    provider: formData.transcriber.provider,
                    model: formData.transcriber.model,
                    language: formData.transcriber.language
                },
                firstMessage: formData.advanced.firstMessage,
                firstMessageMode: formData.advanced.firstMessageMode,
                maxDurationSeconds: formData.advanced.maxDurationSeconds,
                backgroundSound: formData.advanced.backgroundSound,
                endCallMessage: formData.advanced.endCallMessage,
                endCallPhrases: formData.advanced.endCallPhrases,
                metadata: {
                    department: formData.department,
                    version: formData.version
                }
            };

            await adminAgentService.createAssistant(apiPayload);
            toast.success("Assistant created successfully!");
            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            console.error("Error creating assistant:", error);
            toast.danger("Failed to create assistant");
        } finally {
            setcreateagentLoading(false);
        }
    };

    const filteredTemplates = templates.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.configurationLabel?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );


    if (step === "selection") {
        return (
            <div className="flex flex-col gap-6 p-4">
                <div className="text-center space-y-2 mb-4">
                    <h3 className="text-xl font-bold text-text-main">Welcome!</h3>
                    <p className="text-sm text-text-muted">How would you like to build your new agent?</p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <button
                        onClick={handleCreateFromScratch}
                        className="group relative overflow-hidden card p-6 hover:border-primary/50 transition-all text-left"
                    >
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-primary/10 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                <Plus className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-text-main group-hover:text-primary transition-colors">
                                    Create from Scratch
                                </h4>
                                <p className="text-sm text-text-muted mt-1 leading-relaxed">
                                    Start with a blank canvas and configure every detail of your agent manually.
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                            Continue <ChevronRight className="w-4 h-4 ml-1" />
                        </div>
                    </button>

                    <button
                        onClick={handleSelectFromTemplate}
                        className="group relative overflow-hidden card p-6 hover:border-primary/50 transition-all text-left"
                    >
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-primary/10 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                <Zap className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-text-main group-hover:text-primary transition-colors">
                                    Use a Template
                                </h4>
                                <p className="text-sm text-text-muted mt-1 leading-relaxed">
                                    Choose from predefined industry blueprints and customize them to fit your needs.
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                            Browse Templates <ChevronRight className="w-4 h-4 ml-1" />
                        </div>
                    </button>
                </div>
            </div>
        );
    }

    if (step === "templates") {
        return (
            <div className="flex flex-col h-full overflow-hidden">
                <div className="mb-6 space-y-4 px-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                        <input
                            type="text"
                            placeholder="Search templates..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input pl-10 w-full"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar px-2">
                    {isLoading ? (
                        <div className="flex flex-col gap-4">
                            <Skeleton className="w-full h-20" />
                            <Skeleton className="w-full h-20" />
                            <Skeleton className="w-full h-20" />
                            <Skeleton className="w-full h-20" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {filteredTemplates.map((template) => (
                                <button
                                    key={template.id}
                                    onClick={() => handleSelectTemplate(template)}
                                    className="card p-4 hover:border-primary/50 group transition-all text-left flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-2.5 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                            <BotMessageSquare className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-text-main group-hover:text-primary transition-colors">
                                                {template.name}
                                            </h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] font-bold tracking-wider text-text-muted bg-bg px-1.5 py-0.5 rounded border border-border-subtle">
                                                    {template.metadata?.agentRole ? template.metadata?.agentRole?.charAt(0).toUpperCase() + template.metadata?.agentRole?.slice(1) : template.metadata?.department?.charAt(0).toUpperCase() + template.metadata?.department?.slice(1)}
                                                </span>
                                                <span className="text-[10px] font-medium text-text-muted flex items-center gap-1">
                                                    <Languages className="w-3 h-3" />
                                                    {template.metadata?.language ? template.metadata?.language?.charAt(0).toUpperCase() + template.metadata?.language?.slice(1) : "No Language"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-primary transition-all" />
                                </button>
                            ))}
                            {templatesPagination && (
                                <Pagination
                                    currentPage={templatesPagination.page}
                                    totalPages={templatesPagination.totalPages}
                                    pageSize={templatesPagination.pageSize}
                                    totalCount={templatesPagination.total}
                                    onPageChange={handleTemplatesPagination}
                                />
                            )}
                        </div>
                    )}
                </div>

                <div className="mt-2 pt-4 px-2 border-t flex items-center gap-3 sticky bottom-2 bg-white/80 backdrop-blur-md">
                    <button
                        onClick={() => setStep("selection")}
                        className="flex-1 px-4 py-3 rounded-xl border border-border-subtle text-xs font-bold text-text-main hover:bg-bg transition-all active:scale-95"
                    >
                        Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Custom Tabs */}
            <div className="flex border-b border-border-subtle mb-4 shrink-0">
                <button
                    onClick={() => setActiveTab("model")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all relative ${activeTab === "model" ? "text-primary" : "text-text-muted hover:text-text-main"
                        }`}
                >
                    <Cpu className="w-4 h-4" />
                    Model
                    {activeTab === "model" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />}
                </button>
                <button
                    onClick={() => setActiveTab("voice")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all relative ${activeTab === "voice" ? "text-primary" : "text-text-muted hover:text-text-main"
                        }`}
                >
                    <Volume2 className="w-4 h-4" />
                    Voice
                    {activeTab === "voice" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />}
                </button>
                <button
                    onClick={() => setActiveTab("transcriber")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all relative ${activeTab === "transcriber" ? "text-primary" : "text-text-muted hover:text-text-main"
                        }`}
                >
                    <Languages className="w-4 h-4" />
                    Transcriber
                    {activeTab === "transcriber" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />}
                </button>
                <button
                    onClick={() => setActiveTab("advanced")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all relative ${activeTab === "advanced" ? "text-primary" : "text-text-muted hover:text-text-main"
                        }`}
                >
                    <Settings className="w-4 h-4" />
                    Advanced
                    {activeTab === "advanced" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />}
                </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6 px-2">
                {activeTab === "model" && (
                    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <section className="space-y-4">
                            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-2">
                                <BotMessageSquare className="w-3.5 h-3.5" />
                                Basic Information
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-text-main">Agent Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="input w-full"
                                        placeholder="Enter agent name"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-text-main">Department</label>
                                    <input
                                        type="text"
                                        value={formData.department}
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                        className="input w-full"
                                        placeholder="e.g. Support"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-text-main">Version</label>
                                    <input
                                        type="text"
                                        value={formData.version}
                                        onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                                        className="input w-full"
                                        placeholder="e.g. 1.0"
                                    />
                                </div>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-2">
                                <Zap className="w-3.5 h-3.5" />
                                LLM Configuration
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-text-main">Provider</label>
                                    <Select
                                        value={formData.model.provider}
                                        onValueChange={(v) => setFormData({ ...formData, model: { ...formData.model, provider: v } })}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="openai">OpenAI</SelectItem>
                                            {/* <SelectItem value="anthropic">Anthropic</SelectItem>
                                            <SelectItem value="groq">Groq</SelectItem> */}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-text-main">Model</label>
                                    <Select
                                        value={formData.model.model}
                                        onValueChange={(v) => setFormData({ ...formData, model: { ...formData.model, model: v } })}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {(() => {
                                                const providerModels = modelsData?.[formData.model.provider]?.models || (MODELS_DATA as any)[formData.model.provider]?.models;
                                                return providerModels?.map((m: any) => (
                                                    <SelectItem key={m} value={m}>{m}</SelectItem>
                                                )) || <SelectItem value={formData.model.model}>{formData.model.model}</SelectItem>;
                                            })()}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-text-main">Temperature</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max="1"
                                        value={formData.model.temperature}
                                        onChange={(e) => setFormData({ ...formData, model: { ...formData.model, temperature: parseFloat(e.target.value) } })}
                                        className="input w-full"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-text-main">Max Tokens</label>
                                    <input
                                        type="number"
                                        value={formData.model.maxTokens}
                                        onChange={(e) => setFormData({ ...formData, model: { ...formData.model, maxTokens: parseInt(e.target.value) } })}
                                        className="input w-full"
                                    />
                                </div>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-2">
                                <Tags className="w-3.5 h-3.5" />
                                Tool IDs
                            </h3>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newToolId}
                                    onChange={(e) => setNewToolId(e.target.value)}
                                    className="input flex-1"
                                    placeholder="Enter tool ID"
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddToolId()}
                                />
                                <button
                                    onClick={handleAddToolId}
                                    className="btn btn-secondary px-3"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.model.toolIds?.map((id: string, index: number) => (
                                    <div key={index} className="flex items-center gap-2 bg-primary/10 text-primary px-2.5 py-1 rounded-lg text-xs font-bold border border-primary/20">
                                        {id}
                                        <button onClick={() => handleRemoveToolId(index)} className="hover:text-danger">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="space-y-1.5">
                            <label className="text-xs font-semibold text-text-main flex items-center gap-2">
                                <MessageSquare className="w-3.5 h-3.5" />
                                System Prompt
                            </label>
                            <textarea
                                value={formData.model.systemPrompt}
                                onChange={(e) => setFormData({ ...formData, model: { ...formData.model, systemPrompt: e.target.value } })}
                                className="input w-full min-h-[150px] py-3 resize-none"
                                placeholder="Instructions for the AI agent..."
                            />
                        </section>
                    </div>
                )}

                {activeTab === "voice" && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <section className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-text-main">Provider</label>
                                    <Select
                                        value={formData.voice.provider}
                                        onValueChange={(v) => setFormData({ ...formData, voice: { ...formData.voice, provider: v } })}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="11labs">Eleven Labs</SelectItem>
                                            {/* <SelectItem value="google">Google Cloud</SelectItem>
                                            <SelectItem value="playht">Play.ht</SelectItem> */}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-text-main">Speed</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="0.5"
                                        max="2"
                                        value={formData.voice.speed}
                                        onChange={(e) => setFormData({ ...formData, voice: { ...formData.voice, speed: parseFloat(e.target.value) } })}
                                        className="input w-full"
                                    />
                                </div>
                            </div>
                        </section>

                        <section className="space-y-3">
                            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">Select Voice</h3>
                            <div className="grid grid-cols-1 gap-3">
                                {((voicesData && voicesData.length > 0) ? voicesData : VOICES_DATA).map((v: any) => (
                                    <button
                                        key={v.voiceId}
                                        onClick={() => setFormData({ ...formData, voice: { ...formData.voice, voiceId: v.voiceId } })}
                                        className={`flex items-center gap-4 p-4 rounded-xl border transition-all text-left group ${formData.voice.voiceId === v.voiceId
                                            ? "border-primary bg-primary/5 shadow-sm"
                                            : "border-border-subtle hover:border-primary/50 hover:bg-bg/50"
                                            }`}
                                    >
                                        <div className={`p-2.5 rounded-lg transition-colors ${formData.voice.voiceId === v.voiceId ? "bg-primary text-white" : "bg-bg text-text-muted group-hover:text-primary"}`}>
                                            <Volume2 className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-bold text-text-main">{v.name}</h4>
                                            <p className="text-xs text-text-muted truncate">{v.description || v.voiceId}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {v.preview && (
                                                <button
                                                    onClick={(e) => handleTogglePlay(v, e)}
                                                    className={`p-2 rounded-full transition-all ${playingVoiceId === v.voiceId
                                                        ? "bg-primary text-white"
                                                        : "bg-bg text-text-muted hover:text-primary hover:bg-primary/10"
                                                        }`}
                                                >
                                                    {playingVoiceId === v.voiceId ? (
                                                        <Pause className="w-4 h-4" />
                                                    ) : (
                                                        <Play className="w-4 h-4" />
                                                    )}
                                                </button>
                                            )}
                                            {/* {formData.voice.voiceId === v.voiceId && (
                                                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                                    <X className="w-3 h-3 text-white rotate-45" />
                                                </div>
                                            )} */}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === "transcriber" && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-text-main">Provider</label>
                                <Select
                                    value={formData.transcriber.provider}
                                    onValueChange={(v) => setFormData({ ...formData, transcriber: { ...formData.transcriber, provider: v } })}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="deepgram">Deepgram</SelectItem>
                                        {/* <SelectItem value="google">Google Cloud</SelectItem>
                                        <SelectItem value="assemblyai">Assembly AI</SelectItem> */}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-text-main">Model</label>
                                <Select
                                    value={formData.transcriber.model}
                                    onValueChange={(v) => setFormData({ ...formData, transcriber: { ...formData.transcriber, model: v } })}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {(() => {
                                            const providerModels = modelsData?.[formData.transcriber.provider]?.models || (TRANSCRIBER_DATA as any)[formData.transcriber.provider]?.models;
                                            return providerModels?.map((m: any) => (
                                                <SelectItem key={m} value={m}>{m}</SelectItem>
                                            )) || <SelectItem value={formData.transcriber.model}>{formData.transcriber.model}</SelectItem>;
                                        })()}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-text-main flex items-center gap-2">
                                    <Languages className="w-3.5 h-3.5" />
                                    Language (e.g. en)
                                </label>
                                <input
                                    type="text"
                                    value={formData.transcriber.language}
                                    onChange={(e) => setFormData({ ...formData, transcriber: { ...formData.transcriber, language: e.target.value } })}
                                    className="input w-full"
                                    placeholder="en"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "advanced" && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <section className="space-y-4">
                            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-2">
                                <MessageSquare className="w-3.5 h-3.5" />
                                Conversation Flow
                            </h3>
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-text-main">First Message</label>
                                    <textarea
                                        value={formData.advanced.firstMessage}
                                        onChange={(e) => setFormData({ ...formData, advanced: { ...formData.advanced, firstMessage: e.target.value } })}
                                        className="input w-full min-h-[80px] py-3 resize-none"
                                        placeholder="Hello! This is..."
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-text-main">First Message Mode</label>
                                        <input
                                            type="text"
                                            value={formData.advanced.firstMessageMode}
                                            onChange={(e) => setFormData({ ...formData, advanced: { ...formData.advanced, firstMessageMode: e.target.value } })}
                                            className="input w-full"
                                            placeholder="assistant"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-text-main">Max Duration (seconds)</label>
                                        <input
                                            type="number"
                                            value={formData.advanced.maxDurationSeconds}
                                            onChange={(e) => setFormData({ ...formData, advanced: { ...formData.advanced, maxDurationSeconds: parseInt(e.target.value) } })}
                                            className="input w-full"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-2">
                                <VolumeX className="w-3.5 h-3.5" />
                                Ambiance & Ending
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-text-main">Background Sound</label>
                                    <Select
                                        value={formData.advanced.backgroundSound}
                                        onValueChange={(v) => setFormData({ ...formData, advanced: { ...formData.advanced, backgroundSound: v } })}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {BACKGROUND_SOUNDS.map((s: any) => (
                                                <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-text-main">End Call Message</label>
                                    <input
                                        type="text"
                                        value={formData.advanced.endCallMessage}
                                        onChange={(e) => setFormData({ ...formData, advanced: { ...formData.advanced, endCallMessage: e.target.value } })}
                                        className="input w-full"
                                        placeholder="Goodbye!"
                                    />
                                </div>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-2">
                                <X className="w-3.5 h-3.5" />
                                End Call Phrases
                            </h3>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newEndCallPhrase}
                                    onChange={(e) => setNewEndCallPhrase(e.target.value)}
                                    className="input flex-1"
                                    placeholder="Enter end phrase"
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddEndCallPhrase()}
                                />
                                <button
                                    onClick={handleAddEndCallPhrase}
                                    className="btn btn-secondary px-3"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.advanced.endCallPhrases?.map((phrase: string, index: number) => (
                                    <div key={index} className="flex items-center gap-2 bg-bg border border-border-subtle px-2.5 py-1 rounded-lg text-xs font-medium text-text-main">
                                        {phrase}
                                        <button onClick={() => handleRemoveEndCallPhrase(index)} className="text-text-muted hover:text-danger">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                )}
            </div>

            {/* Sticky Action Bar */}
            <div className="mt-8 pt-6 px-2 border-t border-border-subtle flex items-center gap-3 sticky bottom-1">
                <button
                    onClick={() => {
                        // Go back to the previous logical step
                        if (templates.length > 0) {
                            setStep("templates");
                        } else {
                            setStep("selection");
                        }
                    }}
                    className="flex-1 px-4 py-3 rounded-xl border border-border-subtle text-xs font-bold text-text-main hover:bg-bg transition-all active:scale-95"
                >
                    Back
                </button>
                <button
                    onClick={handleSave}
                    className="flex-[2] btn btn-primary py-3 rounded-xl text-xs font-bold shadow-glow-sm flex items-center justify-center gap-2 group transition-all"
                >
                    <Save className="w-4 h-4" />
                    {createagentLoading ? "Creating..." : "Create Agent"}
                </button>
            </div>
        </div>
    );
}

export default AddAdminAgent;