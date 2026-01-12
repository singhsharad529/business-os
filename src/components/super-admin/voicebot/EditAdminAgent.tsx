import { useState } from "react";
import {
    Cpu,
    Mic,
    Languages,
    Settings,
    Plus,
    X,
    Save,
    Trash,
    BotMessageSquare,
    Volume2,
    Type,
    Zap,
    History as HistoryIcon,
    Briefcase,
    Tags,
    MessageSquare,
    Clock,
    VolumeX
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface EditAdminAgentProps {
    onClose: () => void;
}

const DUMMY_AGENT_DATA = {
    "id": "9fceab74-ae18-41ed-9e06-ed7ff25f2b22",
    "orgId": "2b18e02a-bad5-493e-91eb-fdfeea7d1763",
    "name": "Technical Support Bot (Copy)  - Campaign",
    "model": {
        "model": "gpt-4-turbo",
        "messages": [
            {
                "role": "system",
                "content": "You are a technical support specialist for a SaaS platform."
            },
            {
                "role": "system",
                "content": "Always ask for the customer's account ID before troubleshooting."
            }
        ],
        "provider": "openai",
        "maxTokens": 1000,
        "temperature": 0.3,
        "knowledgeBase": {
            "fileIds": [
                "e52ebeec-38b2-4c0b-bc40-d0e61aea3da0"
            ],
            "provider": "google"
        }
    },
    "voice": {
        "speed": 1.1,
        "voiceId": "21m00Tcm4TlvDq8ikWAM",
        "provider": "11labs"
    },
    "transcriber": {
        "model": "nova-2",
        "language": "en",
        "provider": "deepgram"
    },
    "createdAt": "2026-01-08T11:59:30.955000Z",
    "updatedAt": "2026-01-08T11:59:30.955000Z",
    "firstMessage": "Hello! I'm your technical support assistant. May I have your account ID?",
    "maxDurationSeconds": 600,
    "metadata": {
        "version": "1.0",
        "department": "support"
    },
    "department": null
};

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
        "type": "premade"
    },
    {
        "name": "Sarah",
        "description": "Mature, Reassuring, Confident",
        "voiceId": "EXAVITQu4vr4xnSDxMaL",
        "provider": "11labs",
        "type": "premade"
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

function EditAdminAgent({ onClose }: EditAdminAgentProps) {
    const [activeTab, setActiveTab] = useState<"model" | "voice" | "transcriber" | "advanced">("model");
    const [formData, setFormData] = useState({
        name: DUMMY_AGENT_DATA.name,
        department: DUMMY_AGENT_DATA.metadata.department,
        version: DUMMY_AGENT_DATA.metadata.version || "1.0",
        model: {
            provider: DUMMY_AGENT_DATA.model.provider,
            model: DUMMY_AGENT_DATA.model.model,
            temperature: DUMMY_AGENT_DATA.model.temperature,
            maxTokens: DUMMY_AGENT_DATA.model.maxTokens,
            systemPrompt: DUMMY_AGENT_DATA.model.messages.filter((m: any) => m.role === "system").map((m: any) => m.content).join("\n"),
            toolIds: [] as string[]
        },
        voice: {
            provider: DUMMY_AGENT_DATA.voice.provider,
            voiceId: DUMMY_AGENT_DATA.voice.voiceId,
            speed: DUMMY_AGENT_DATA.voice.speed
        },
        transcriber: {
            provider: DUMMY_AGENT_DATA.transcriber.provider,
            model: DUMMY_AGENT_DATA.transcriber.model,
            language: DUMMY_AGENT_DATA.transcriber.language
        },
        advanced: {
            firstMessage: DUMMY_AGENT_DATA.firstMessage,
            firstMessageMode: "assistant",
            maxDurationSeconds: DUMMY_AGENT_DATA.maxDurationSeconds,
            backgroundSound: "office",
            endCallMessage: "Thank you for calling. Goodbye!",
            endCallPhrases: ["Bye bye", "Talk soon"] as string[]
        }
    });

    const [newToolId, setNewToolId] = useState("");
    const [newEndCallPhrase, setNewEndCallPhrase] = useState("");

    const handleAddToolId = () => {
        if (newToolId.trim()) {
            setFormData(prev => ({
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
        setFormData(prev => ({
            ...prev,
            model: {
                ...prev.model,
                toolIds: prev.model.toolIds.filter((_, i) => i !== index)
            }
        }));
    };

    const handleAddEndCallPhrase = () => {
        if (newEndCallPhrase.trim()) {
            setFormData(prev => ({
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
        setFormData(prev => ({
            ...prev,
            advanced: {
                ...prev.advanced,
                endCallPhrases: prev.advanced.endCallPhrases.filter((_, i) => i !== index)
            }
        }));
    };

    const handleSave = () => {
        console.log("Saving agent data:", formData);
        onClose();
    };

    return (
        <div className="flex flex-col h-full">
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
                                            <SelectItem value="anthropic">Anthropic</SelectItem>
                                            <SelectItem value="groq">Groq</SelectItem>
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
                                            {MODELS_DATA.openai.models.map((m: any) => (
                                                <SelectItem key={m} value={m}>{m}</SelectItem>
                                            ))}
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
                                {formData.model.toolIds?.map((id, index) => (
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
                                            <SelectItem value="google">Google Cloud</SelectItem>
                                            <SelectItem value="playht">Play.ht</SelectItem>
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
                                {VOICES_DATA.map((v: any) => (
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
                                            <p className="text-xs text-text-muted truncate">{v.description}</p>
                                        </div>
                                        {formData.voice.voiceId === v.voiceId && (
                                            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                                <X className="w-3 h-3 text-white rotate-45" />
                                            </div>
                                        )}
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
                                        <SelectItem value="google">Google Cloud</SelectItem>
                                        <SelectItem value="assemblyai">Assembly AI</SelectItem>
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
                                        {TRANSCRIBER_DATA.deepgram.models.map((m: any) => (
                                            <SelectItem key={m} value={m}>{m}</SelectItem>
                                        ))}
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
                                {formData.advanced.endCallPhrases?.map((phrase, index) => (
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
            <div className="mt-8 pt-6 border-t border-border-subtle flex items-center gap-3 sticky bottom-0">
                <button
                    onClick={onClose}
                    className="flex-1 px-4 py-3 rounded-xl border border-border-subtle text-xs font-bold text-text-main hover:bg-bg transition-all active:scale-9 bg-white/50 backdrop-blur-sm"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSave}
                    className="flex-[2] btn btn-primary py-3 rounded-xl text-xs font-bold shadow-glow-sm flex items-center justify-center gap-2 group transition-all"
                >
                    <Save className="w-4 h-4" />
                    Save Changes
                </button>
            </div>
        </div>
    );
}

export default EditAdminAgent;