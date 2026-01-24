import { useState, useEffect } from "react";
import adminAgentService from "@/api/adminAgentService";
import apiService from "@/api/apiService";
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
    Loader2,
    Play,
    Pause,
    BrainCog,
    Upload
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface EditAdminAgentProps {
    agent: any;
    onClose: () => void;
    onSuccess?: () => void;
    isActive?: boolean;
    deleteFile?: () => void;
}



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

function EditAdminAgent({ agent, onClose, onSuccess, isActive, deleteFile }: EditAdminAgentProps) {
    const [activeTab, setActiveTab] = useState<"model" | "voice" | "transcriber" | "advanced">("model");
    const [formData, setFormData] = useState<any>(DEFAULT_FORM_DATA);
    const [modelsData, setModelsData] = useState<any>(null);
    const [voicesData, setVoicesData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
    const [selectedPhoneNumber, setSelectedPhoneNumber] = useState<any>(null);
    const [phoneNumbersLoading, setPhoneNumbersLoading] = useState<boolean>(false);
    const [phoneNumbers, setPhoneNumbers] = useState<any>(null);
    const [allFiles, setAllFiles] = useState<any>([]);
    const [deleteFileId, setDeleteFileId] = useState<string>("");
    const [fileUploaderLoader, setFileUploaderLoader] = useState<boolean>(false);

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



    const fetchPhoneNumbers = async () => {
        try {
            setPhoneNumbersLoading(true);
            const response = await adminAgentService.getAllPhoneNumbers({});
            // console.log('response', response);
            if (response && response.phoneNumbers) {
                let allNumbers = [...response.phoneNumbers];

                // If agent has assigned numbers, ensure they are in the list
                if (agent?.phoneNumbers && agent.phoneNumbers.length > 0) {
                    const existingIds = new Set(allNumbers.map((n: any) => n.vapiId));
                    agent.phoneNumbers.forEach((agentNum: any) => {
                        if (!existingIds.has(agentNum.vapiId)) {
                            allNumbers.unshift(agentNum);
                        }
                    });
                }

                setPhoneNumbers(allNumbers);

                if (allNumbers.length > 0 && (!agent?.phoneNumbers || agent.phoneNumbers.length === 0)) {
                    setSelectedPhoneNumber(allNumbers[0].vapiId);
                }
            }
        } catch (error) {
            toast.danger("Failed to load phone numbers")
        }
        finally {
            setPhoneNumbersLoading(false);
        }
    };


    useEffect(() => {

        // console.log('selected active agent', agent);


        const fetchInitialData = async () => {
            try {
                const [modelsRes, voicesRes] = await Promise.all([
                    adminAgentService.getListModels(),
                    adminAgentService.getVoices()
                ]);
                setModelsData(modelsRes);
                if (voicesRes && voicesRes.voices) {
                    setVoicesData(voicesRes.voices);
                } else if (Array.isArray(voicesRes)) {
                    setVoicesData(voicesRes);
                }
            } catch (error) {
                toast.danger("Error fetching initial data");
            }
        };
        fetchInitialData();
        if (isActive)
            fetchPhoneNumbers();
    }, []);

    useEffect(() => {
        if (agent) {
            const systemPrompt = agent.model?.messages
                ?.filter((m: any) => m.role === "system")
                .map((m: any) => m.content)
                .join("\n") || "";

            setFormData({
                name: agent.name || "",
                department: agent.metadata?.department || "",
                version: agent.metadata?.version || "1.0",
                model: {
                    provider: agent.model?.provider || "openai",
                    model: agent.model?.model || "gpt-4-turbo",
                    temperature: agent.model?.temperature || 0.6,
                    maxTokens: agent.model?.maxTokens || 1500,
                    systemPrompt: systemPrompt,
                    toolIds: agent.model?.toolIds || []
                },
                voice: {
                    provider: agent.voice?.provider || "11labs",
                    voiceId: agent.voice?.voiceId || "",
                    speed: agent.voice?.speed || 1,
                    cachingEnabled: agent.voice?.cachingEnabled !== undefined ? agent.voice?.cachingEnabled : true
                },
                transcriber: {
                    provider: agent.transcriber?.provider || "deepgram",
                    model: agent.transcriber?.model || "nova-2",
                    language: agent.transcriber?.language || "en"
                },
                advanced: {
                    firstMessage: agent.firstMessage || "",
                    firstMessageMode: agent.firstMessageMode || "assistant-speaks-first",
                    maxDurationSeconds: agent.maxDurationSeconds || 1800,
                    backgroundSound: agent.backgroundSound || "office",
                    endCallMessage: agent.endCallMessage || "",
                    endCallPhrases: agent.endCallPhrases || []
                }
            });

            if (agent.localFiles) {
                setAllFiles(agent.localFiles);
            }

            if (agent.phoneNumbers && agent.phoneNumbers.length > 0) {
                setSelectedPhoneNumber(agent.phoneNumbers[0].vapiId);
            }
        }
    }, [agent]);

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
        setIsSaving(true);
        try {
            const apiPayload = {
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

            // Only include phoneNumberId if it has changed
            const currentPhoneNumberId = agent.phoneNumbers?.[0]?.vapiId;
            if (selectedPhoneNumber && selectedPhoneNumber !== currentPhoneNumberId) {
                (apiPayload as any).phoneNumberId = selectedPhoneNumber;
            }

            // Since we can't edit adminAgentService.ts, we use apiService directly
            // We assume the endpoint is PATCH admin/assistants/:id
            await apiService.patch(`admin/assistants/${agent.vapiAssistantId || agent.vapiId}`, apiPayload, {});

            toast.success("Assistant updated successfully!");
            if (onSuccess) {
                onSuccess();
            }
            // onClose();
            // Optional: trigger a refresh in the parent component if needed
            // But we don't have a callback for that in props.
        } catch (error) {

            console.error("Error updating assistant:", error);
            toast.danger("Failed to update assistant");
        } finally {
            setIsSaving(false);
        }
    };

    const deleteFileHandler = async (fileId: string) => {
        try {
            setDeleteFileId(fileId);
            await adminAgentService.deleteFileFromAgent(agent.userId, agent.vapiId, fileId);
            setAllFiles((prev: any) => prev.filter((file: any) => file.vapiFileId !== fileId));
            toast.success("File deleted successfully!");
            if (deleteFile) {
                deleteFile();
            }
        } catch (error) {
            console.error("Error deleting file:", error);
            toast.danger("Failed to delete file");
        } finally {
            setDeleteFileId("");
        }
    }

    const uploadFileHandler = async (file: File) => {
        try {
            setFileUploaderLoader(true);
            const formData = new FormData();
            formData.append("files", file);

            const response = await adminAgentService.uploadFileToAgent(agent.userId, agent.vapiId, formData, {});
            if (response.uploadedFiles && response.uploadedFiles.length > 0) {
                setAllFiles((prev: any) => [...prev, ...response.uploadedFiles]);
            }
            toast.success("File uploaded successfully!");
            if (deleteFile) {
                deleteFile();
            }
        } catch (error) {

            toast.danger("Failed to upload file");
        } finally {
            setFileUploaderLoader(false);
        }
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

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6 px-2 mb-4">
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
                                                const providerModels = modelsData?.[formData.model.provider]?.models || [];
                                                const options = [...providerModels];
                                                if (formData.model.model && !options.includes(formData.model.model)) {
                                                    options.push(formData.model.model);
                                                }
                                                return options.map((m: any) => (
                                                    <SelectItem key={m} value={m}>{m}</SelectItem>
                                                ));
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
                                {voicesData?.map((v: any) => (
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
                                            const providerModels = modelsData?.[formData.transcriber.provider]?.models || [];
                                            const options = [...providerModels];
                                            if (formData.transcriber.model && !options.includes(formData.transcriber.model)) {
                                                options.push(formData.transcriber.model);
                                            }
                                            return options.map((m: any) => (
                                                <SelectItem key={m} value={m}>{m}</SelectItem>
                                            ));
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
                                        <Select
                                            value={formData.advanced.firstMessageMode}
                                            onValueChange={(v) => setFormData({ ...formData, advanced: { ...formData.advanced, firstMessageMode: v } })}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="assistant-speaks-first">Assistant Speaks First</SelectItem>
                                                {/* <SelectItem value="assistant-waits-for-user">Assistant Waits for User</SelectItem> */}
                                            </SelectContent>
                                        </Select>
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

                        {
                            isActive && (
                                <section className="space-y-4 pb-2">
                                    <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-2">
                                        <BrainCog className="w-3.5 h-3.5" />
                                        Connectivity & Knowledge Base
                                    </h3>

                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-text-main">Change Phone Number</label>

                                        <Select
                                            onValueChange={(value) => setSelectedPhoneNumber(value)}
                                            value={selectedPhoneNumber}
                                        >
                                            <SelectTrigger className="w-full bg-background border-border-subtle">
                                                <SelectValue placeholder="Select a number to link..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {phoneNumbers && phoneNumbers.length > 0 ? (
                                                    phoneNumbers.map((number: any) => (
                                                        <SelectItem key={number.id} value={number.vapiId}>
                                                            {number.formattedNumber}
                                                        </SelectItem>
                                                    ))
                                                ) : (
                                                    <div className="p-2 text-xs text-center text-text-muted">
                                                        No unassigned numbers available
                                                    </div>
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>


                                    <div className="max-h-[160px] overflow-y-auto space-y-2">
                                        <label className="text-xs font-semibold text-text-main">Upload Knowledge Base</label>

                                        {allFiles.map((doc: any, index: number) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-bg-muted/30 rounded-lg border border-border-subtle">
                                                <div className="flex flex-col gap-1">
                                                    {/* <div className="w-8 h-8 bg-white rounded flex items-center justify-center border border-border-subtle font-bold text-[10px] text-primary uppercase">
                                                    {doc.documentType}
                                                </div> */}
                                                    <p className="text-sm font-medium text-text-main">{doc.fileName}</p>
                                                    <p className="text-[10px] font-semibold text-text-muted ">  {doc?.uploadedAt
                                                        ? new Date(doc.uploadedAt).toLocaleString("en-IN", {
                                                            dateStyle: "medium",
                                                            timeStyle: "short",
                                                        })
                                                        : "-"}</p>

                                                </div>
                                                <button
                                                    onClick={() => deleteFileHandler(doc.vapiFileId)}
                                                    className="p-1.5 hover:bg-danger-soft text-text-muted hover:text-danger rounded-md transition-colors"
                                                >
                                                    {deleteFileId === doc.vapiFileId ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <X className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>
                                        ))}

                                    </div>

                                    <div className="space-y-2">
                                        {/* <label className="text-xs font-semibold text-text-main">Upload Knowledge Base</label> */}

                                        <div className="flex flex-col items-center justify-center border-2 border-dashed border-border-subtle rounded-2xl p-4 bg-bg-alt/20 hover:bg-bg-alt/40 transition-all group cursor-pointer relative">

                                            <input
                                                type="file"
                                                accept=".pdf"
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                onChange={(e) => {
                                                    if (e.target.files && e.target.files[0]) {
                                                        uploadFileHandler(e.target.files[0]);
                                                    }
                                                }}
                                            />
                                            {fileUploaderLoader ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <div className="w-12 h-12 bg-primary-soft rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform mb-4">
                                                    <Upload className="w-5 h-5" />
                                                </div>
                                            )}
                                            <div className="text-sm font-bold text-text-main">Click to upload or drag & drop</div>
                                            <div className="text-xs text-text-muted mt-1">PDF (max. 5MB)</div>
                                        </div>
                                    </div>

                                </section>
                            )
                        }
                    </div>
                )}
            </div>

            {/* Sticky Action Bar */}
            <div className="mt-auto pt-6 pb-2 border-t border-border-subtle flex items-center gap-3 sticky bottom-0 bg-white/95 backdrop-blur-xl z-20 -mx-2 px-2">
                <button
                    onClick={onClose}
                    className="flex-1 px-4 py-3 rounded-xl border border-border-subtle text-xs font-bold text-text-main hover:bg-bg transition-all active:scale-95 bg-white/50"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-[2] btn btn-primary py-3 rounded-xl text-xs font-bold shadow-glow-sm flex items-center justify-center gap-2 group transition-all"
                >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                </button>
            </div>
        </div>
    );
}

export default EditAdminAgent;