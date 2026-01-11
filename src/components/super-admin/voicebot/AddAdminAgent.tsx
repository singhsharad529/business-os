import { useState } from "react";
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
    Search
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface AddAdminAgentProps {
    onClose: () => void;
}

const TEMPLATES_DATA = [
    {
        "id": "974337cf-4abf-4ddc-88c4-7ef217f2af89",
        "userId": "e14d0d6e-d081-462b-ab44-382758738b92",
        "vapiAssistantId": "50b9534e-6a04-4270-ad82-22787aadb6db",
        "agentRole": "realty",
        "configuration": "rental_specialist",
        "configurationLabel": "Rental Specialist",
        "language": "en",
        "status": "success",
        "createdAt": "2026-01-02T11:44:26.561",
        "updatedAt": "2026-01-02T11:44:26.561",
        "backgroundSound": "office",
        "firstMessage": "Hello! I specialize in rental properties. Are you looking to rent or list a rental property?",
        "metadata": {
            "version": "1.0",
            "subdomain": "rental_specialist",
            "department": "realty"
        },
        "model": {
            "model": "gpt-4-turbo",
            "messages": [
                {
                    "role": "system",
                    "content": "You are a rental property specialist. You help clients find rental properties or manage rental listings. You must communicate exclusively in English. All responses should be in English."
                },
                {
                    "role": "system",
                    "content": "Understand rental requirements, budget, lease terms, and help match clients with suitable rental properties."
                }
            ],
            "provider": "openai",
            "maxTokens": 1500,
            "temperature": 0.6
        },
        "name": "Realty - Rental Specialist",
        "orgId": "2b18e02a-bad5-493e-91eb-fdfeea7d1763",
        "serverUrl": "https://buisnessosapi.spongeboblabs.ai/vapi/vapi-webhook",
        "transcriber": {
            "model": "nova-2",
            "language": "en",
            "provider": "deepgram"
        },
        "voice": {
            "speed": 1,
            "voiceId": "iP95p4xoKVk53GoZ742B",
            "provider": "11labs"
        }
    },
    {
        "id": "1a2e526f-4417-4ece-960c-3b1e464495f3",
        "userId": "e14d0d6e-d081-462b-ab44-382758738b92",
        "vapiAssistantId": "7386ad1a-298e-4c46-a1e2-b337a725704a",
        "agentRole": "realty",
        "configuration": "buyer_agent",
        "configurationLabel": "Buyer's Agent",
        "language": "en",
        "status": "success",
        "createdAt": "2026-01-02T11:44:26.197",
        "updatedAt": "2026-01-02T11:44:26.197",
        "backgroundSound": "office",
        "firstMessage": "Hi! I'm your buyer's agent. Let's find your dream property. What are you looking for?",
        "metadata": {
            "version": "1.0",
            "subdomain": "buyer_agent",
            "department": "realty"
        },
        "model": {
            "model": "gpt-4-turbo",
            "messages": [
                {
                    "role": "system",
                    "content": "You are a buyer's agent specialist. You help clients find and purchase their ideal property. You must communicate exclusively in English. All responses should be in English."
                },
                {
                    "role": "system",
                    "content": "Ask about location preferences, budget, property type, and must-have features to provide the best property recommendations."
                }
            ],
            "provider": "openai",
            "maxTokens": 1500,
            "temperature": 0.6
        },
        "name": "Realty - Buyer's Agent",
        "orgId": "2b18e02a-bad5-493e-91eb-fdfeea7d1763",
        "serverUrl": "https://buisnessosapi.spongeboblabs.ai/vapi/vapi-webhook",
        "transcriber": {
            "model": "nova-2",
            "language": "en",
            "provider": "deepgram"
        },
        "voice": {
            "speed": 1,
            "voiceId": "iP95p4xoKVk53GoZ742B",
            "provider": "11labs"
        }
    },
    {
        "id": "f2148da1-db34-43f6-8f77-42bd93681203",
        "userId": "e14d0d6e-d081-462b-ab44-382758738b92",
        "vapiAssistantId": "e79342b3-31ac-46b4-9fc8-f8110c29308c",
        "agentRole": "realty",
        "configuration": "property_listing",
        "configurationLabel": "Property Listing Agent",
        "language": "en",
        "status": "success",
        "createdAt": "2026-01-02T11:44:25.794",
        "updatedAt": "2026-01-02T11:44:25.794",
        "backgroundSound": "office",
        "firstMessage": "Hello! I'm here to help you list your property. Can you tell me about the property you'd like to list?",
        "metadata": {
            "version": "1.0",
            "subdomain": "property_listing",
            "department": "realty"
        },
        "model": {
            "model": "gpt-4-turbo",
            "messages": [
                {
                    "role": "system",
                    "content": "You are a property listing specialist. You help clients list their properties for sale or rent and provide market insights. You must communicate exclusively in English. All responses should be in English."
                },
                {
                    "role": "system",
                    "content": "Gather property details, provide valuation guidance, and explain the listing process clearly and professionally."
                }
            ],
            "provider": "openai",
            "maxTokens": 1500,
            "temperature": 0.6
        },
        "name": "Realty - Property Listing Agent",
        "orgId": "2b18e02a-bad5-493e-91eb-fdfeea7d1763",
        "serverUrl": "https://buisnessosapi.spongeboblabs.ai/vapi/vapi-webhook",
        "transcriber": {
            "model": "nova-2",
            "language": "en",
            "provider": "deepgram"
        },
        "voice": {
            "speed": 1,
            "voiceId": "iP95p4xoKVk53GoZ742B",
            "provider": "11labs"
        }
    },
    {
        "id": "9ee32c17-7e03-4d47-a528-4a12ee50b24a",
        "userId": "e14d0d6e-d081-462b-ab44-382758738b92",
        "vapiAssistantId": "110a8f43-5d5c-4358-8091-bf2755ce677a",
        "agentRole": "finance",
        "configuration": "investment_consultant",
        "configurationLabel": "Investment Consultant",
        "language": "en",
        "status": "success",
        "createdAt": "2026-01-02T11:44:25.48",
        "updatedAt": "2026-01-02T11:44:25.48",
        "backgroundSound": "office",
        "firstMessage": "Welcome! I'm your investment consultant. Let's discuss your financial goals and investment options.",
        "metadata": {
            "version": "1.0",
            "subdomain": "investment_consultant",
            "department": "finance"
        },
        "model": {
            "model": "gpt-4-turbo",
            "messages": [
                {
                    "role": "system",
                    "content": "You are an investment consultant. You provide guidance on investment options, portfolio management, and financial planning. You must communicate exclusively in English. All responses should be in English."
                },
                {
                    "role": "system",
                    "content": "Assess risk tolerance, understand financial goals, and provide informed recommendations while being clear about risks."
                }
            ],
            "provider": "openai",
            "maxTokens": 1500,
            "temperature": 0.4
        },
        "name": "Finance - Investment Consultant",
        "orgId": "2b18e02a-bad5-493e-91eb-fdfeea7d1763",
        "serverUrl": "https://buisnessosapi.spongeboblabs.ai/vapi/vapi-webhook",
        "transcriber": {
            "model": "nova-2",
            "language": "en",
            "provider": "deepgram"
        },
        "voice": {
            "speed": 1,
            "voiceId": "pNInz6obpgDQGcFmaJgB",
            "provider": "11labs"
        }
    },
    {
        "id": "a205a9d1-6547-49f3-96ab-26cad45562e8",
        "userId": "e14d0d6e-d081-462b-ab44-382758738b92",
        "vapiAssistantId": "e887b8a0-3f15-4176-ad07-2643f8f22bc5",
        "agentRole": "finance",
        "configuration": "loan_advisor",
        "configurationLabel": "Loan Advisor",
        "language": "en",
        "status": "success",
        "createdAt": "2026-01-02T11:44:25.104",
        "updatedAt": "2026-01-02T11:44:25.104",
        "backgroundSound": "office",
        "firstMessage": "Hello! I'm here to help you with loan options. What type of loan are you interested in?",
        "metadata": {
            "version": "1.0",
            "subdomain": "loan_advisor",
            "department": "finance"
        },
        "model": {
            "model": "gpt-4-turbo",
            "messages": [
                {
                    "role": "system",
                    "content": "You are a loan advisor specialist. You provide information about loan products, eligibility, and application processes. You must communicate exclusively in English. All responses should be in English."
                },
                {
                    "role": "system",
                    "content": "Explain loan terms clearly, assess customer needs, and guide them through the application process professionally."
                }
            ],
            "provider": "openai",
            "maxTokens": 1500,
            "temperature": 0.4
        },
        "name": "Finance - Loan Advisor",
        "orgId": "2b18e02a-bad5-493e-91eb-fdfeea7d1763",
        "serverUrl": "https://buisnessosapi.spongeboblabs.ai/vapi/vapi-webhook",
        "transcriber": {
            "model": "nova-2",
            "language": "en",
            "provider": "deepgram"
        },
        "voice": {
            "speed": 1,
            "voiceId": "pNInz6obpgDQGcFmaJgB",
            "provider": "11labs"
        }
    },
    {
        "id": "0092c646-62c1-4e8c-b517-4fd4d042f5e2",
        "userId": "e14d0d6e-d081-462b-ab44-382758738b92",
        "vapiAssistantId": "4413b821-fb18-4271-b92f-09c9816129fc",
        "agentRole": "finance",
        "configuration": "account_support",
        "configurationLabel": "Account Support",
        "language": "en",
        "status": "success",
        "createdAt": "2026-01-02T11:44:24.78",
        "updatedAt": "2026-01-02T11:44:24.78",
        "backgroundSound": "office",
        "firstMessage": "Good day! I'm your account support specialist. May I have your account ID to assist you?",
        "metadata": {
            "version": "1.0",
            "subdomain": "account_support",
            "department": "finance"
        },
        "model": {
            "model": "gpt-4-turbo",
            "messages": [
                {
                    "role": "system",
                    "content": "You are a financial account support specialist. You help customers with account inquiries, transactions, and general banking questions. You must communicate exclusively in English. All responses should be in English."
                },
                {
                    "role": "system",
                    "content": "Always verify customer identity before discussing sensitive information. Be clear, accurate, and professional."
                }
            ],
            "provider": "openai",
            "maxTokens": 1200,
            "temperature": 0.3
        },
        "name": "Finance - Account Support",
        "orgId": "2b18e02a-bad5-493e-91eb-fdfeea7d1763",
        "serverUrl": "https://buisnessosapi.spongeboblabs.ai/vapi/vapi-webhook",
        "transcriber": {
            "model": "nova-2",
            "language": "en",
            "provider": "deepgram"
        },
        "voice": {
            "speed": 1,
            "voiceId": "pNInz6obpgDQGcFmaJgB",
            "provider": "11labs"
        }
    },
    {
        "id": "84fa0e0b-0ac8-44d0-b2df-bc3f8f9ba12e",
        "userId": "e14d0d6e-d081-462b-ab44-382758738b92",
        "vapiAssistantId": "15256fa7-9461-4d7a-b6fa-a8135a09d70d",
        "agentRole": "sales",
        "configuration": "sales_followup",
        "configurationLabel": "Follow-up Agent",
        "language": "en",
        "status": "success",
        "createdAt": "2026-01-02T11:44:24.463",
        "updatedAt": "2026-01-02T11:44:24.463",
        "backgroundSound": "office",
        "firstMessage": "Hi! I'm following up on our previous conversation. Do you have any questions I can help with?",
        "metadata": {
            "version": "1.0",
            "subdomain": "sales_followup",
            "department": "sales"
        },
        "model": {
            "model": "gpt-4-turbo",
            "messages": [
                {
                    "role": "system",
                    "content": "You are a sales follow-up agent. You follow up with leads and existing customers to nurture relationships and close deals. You must communicate exclusively in English. All responses should be in English."
                },
                {
                    "role": "system",
                    "content": "Be persistent but respectful. Reference previous conversations and show that you value their business."
                }
            ],
            "provider": "openai",
            "maxTokens": 1500,
            "temperature": 0.7
        },
        "name": "Sales - Follow-up Agent",
        "orgId": "2b18e02a-bad5-493e-91eb-fdfeea7d1763",
        "serverUrl": "https://buisnessosapi.spongeboblabs.ai/vapi/vapi-webhook",
        "transcriber": {
            "model": "nova-2",
            "language": "en",
            "provider": "deepgram"
        },
        "voice": {
            "speed": 1,
            "voiceId": "21m00Tcm4TlvDq8ikWAM",
            "provider": "11labs"
        }
    },
    {
        "id": "a64cefa3-a4c9-457d-af11-9f7c7dca6167",
        "userId": "e14d0d6e-d081-462b-ab44-382758738b92",
        "vapiAssistantId": "b60f9eb9-a327-49d8-b8ec-f5619abc4fd6",
        "agentRole": "sales",
        "configuration": "inbound_sales",
        "configurationLabel": "Inbound Support",
        "language": "en",
        "status": "success",
        "createdAt": "2026-01-02T11:44:24.151",
        "updatedAt": "2026-01-02T11:44:24.151",
        "backgroundSound": "office",
        "firstMessage": "Hello! Thank you for reaching out. How can I help you today?",
        "metadata": {
            "version": "1.0",
            "subdomain": "inbound_sales",
            "department": "sales"
        },
        "model": {
            "model": "gpt-4-turbo",
            "messages": [
                {
                    "role": "system",
                    "content": "You are an inbound sales support agent. You handle incoming inquiries and help customers find the right products/services. You must communicate exclusively in English. All responses should be in English."
                },
                {
                    "role": "system",
                    "content": "Listen actively to customer needs, ask clarifying questions, and provide personalized recommendations."
                }
            ],
            "provider": "openai",
            "maxTokens": 1500,
            "temperature": 0.7
        },
        "name": "Sales - Inbound Support",
        "orgId": "2b18e02a-bad5-493e-91eb-fdfeea7d1763",
        "serverUrl": "https://buisnessosapi.spongeboblabs.ai/vapi/vapi-webhook",
        "transcriber": {
            "model": "nova-2",
            "language": "en",
            "provider": "deepgram"
        },
        "voice": {
            "speed": 1,
            "voiceId": "21m00Tcm4TlvDq8ikWAM",
            "provider": "11labs"
        }
    },
    {
        "id": "46ba7a40-7535-4829-b124-08b892734ff2",
        "userId": "e14d0d6e-d081-462b-ab44-382758738b92",
        "vapiAssistantId": "94bcf17a-6fc5-49b8-8209-3829ff7b14f7",
        "agentRole": "sales",
        "configuration": "outbound_sales",
        "configurationLabel": "Outbound Sales",
        "language": "en",
        "status": "success",
        "createdAt": "2026-01-02T11:44:23.739",
        "updatedAt": "2026-01-02T11:44:23.739",
        "backgroundSound": "office",
        "firstMessage": "Hello! I'm calling to share some exciting opportunities with you. Do you have a moment?",
        "metadata": {
            "version": "1.0",
            "subdomain": "outbound_sales",
            "department": "sales"
        },
        "model": {
            "model": "gpt-4-turbo",
            "messages": [
                {
                    "role": "system",
                    "content": "You are a professional outbound sales agent. Your goal is to reach out to potential customers and generate interest in products/services. You must communicate exclusively in English. All responses should be in English."
                },
                {
                    "role": "system",
                    "content": "Always be friendly, enthusiastic, and respect if someone is not interested. Focus on building relationships."
                }
            ],
            "provider": "openai",
            "maxTokens": 1500,
            "temperature": 0.7
        },
        "name": "Sales - Outbound Agent",
        "orgId": "2b18e02a-bad5-493e-91eb-fdfeea7d1763",
        "serverUrl": "https://buisnessosapi.spongeboblabs.ai/vapi/vapi-webhook",
        "transcriber": {
            "model": "nova-2",
            "language": "en",
            "provider": "deepgram"
        },
        "voice": {
            "speed": 1,
            "voiceId": "21m00Tcm4TlvDq8ikWAM",
            "provider": "11labs"
        }
    }
];

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

function AddAdminAgent({ onClose }: AddAdminAgentProps) {
    const [step, setStep] = useState<"templates" | "form">("templates");
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState<"model" | "voice" | "transcriber" | "advanced">("model");
    const [formData, setFormData] = useState<any>(null);

    const handleSelectTemplate = (template: any) => {
        const systemPrompt = template.model.messages
            .filter((m: any) => m.role === "system")
            .map((m: any) => m.content)
            .join("\n");

        setFormData({
            name: template.name,
            department: template.metadata.department || "",
            version: template.metadata.version || "1.0",
            model: {
                provider: template.model.provider || "openai",
                model: template.model.model || "gpt-4-turbo",
                temperature: template.model.temperature || 0.6,
                maxTokens: template.model.maxTokens || 1500,
                systemPrompt: systemPrompt,
                toolIds: [] as string[]
            },
            voice: {
                provider: template.voice.provider || "11labs",
                voiceId: template.voice.voiceId || "",
                speed: template.voice.speed || 1
            },
            transcriber: {
                provider: template.transcriber.provider || "deepgram",
                model: template.transcriber.model || "nova-2",
                language: template.transcriber.language || "en"
            },
            advanced: {
                firstMessage: template.firstMessage || "",
                firstMessageMode: "assistant",
                maxDurationSeconds: 600,
                backgroundSound: template.backgroundSound || "office",
                endCallMessage: "Thank you for calling. Goodbye!",
                endCallPhrases: ["Bye bye", "Talk soon"] as string[]
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

    const handleSave = () => {
        console.log("Creating new agent from template:", formData);
        onClose();
    };

    const filteredTemplates = TEMPLATES_DATA.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.configurationLabel.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted bg-bg px-1.5 py-0.5 rounded border border-border-subtle">
                                                {template.agentRole}
                                            </span>
                                            <span className="text-[10px] font-medium text-text-muted flex items-center gap-1">
                                                <Languages className="w-3 h-3" />
                                                {template.language.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-primary transition-all" />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-2 pt-4 px-2 border-t flex items-center gap-3 bg-white/50 backdrop-blur-sm sticky bottom-2">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 rounded-xl border border-border-subtle text-xs font-bold text-text-main hover:bg-bg transition-all active:scale-9"
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
            <div className="mt-8 pt-6 px-2 border-t border-border-subtle flex items-center gap-3 bg-white/50 backdrop-blur-sm sticky bottom-1">
                <button
                    onClick={() => setStep("templates")}
                    className="flex-1 px-4 py-3 rounded-xl border border-border-subtle text-xs font-bold text-text-main hover:bg-bg transition-all active:scale-9"
                >
                    Back to Templates
                </button>
                <button
                    onClick={handleSave}
                    className="flex-[2] btn btn-primary py-3 rounded-xl text-xs font-bold shadow-glow-sm flex items-center justify-center gap-2 group transition-all"
                >
                    <Save className="w-4 h-4" />
                    Create Agent
                </button>
            </div>
        </div>
    );
}

export default AddAdminAgent;