import { useState } from "react";
import {
    Plus,
    BotMessageSquare,
    Briefcase,
    Languages,
    Cpu,
    Calendar,
    Edit,
    Copy,
    Trash,
    Search,
    Filter
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { SideSheet } from "@/components/SideSheet";
import EditAdminAgent from "./EditAdminAgent";

const assistantsData = [
    {
        "id": "9fceab74-ae18-41ed-9e06-ed7ff25f2b22",
        "name": "Technical Support Bot",
        "status": "active",
        "model": {
            "model": "gpt-4-turbo",
            "provider": "openai"
        },
        "voice": {
            "voiceId": "21m00Tcm4TlvDq8ikWAM",
            "provider": "11labs"
        },
        "transcriber": {
            "language": "en",
            "provider": "deepgram"
        },
        "createdAt": "2026-01-08T11:59:30.955000+00:00",
        "metadata": {
            "department": "support"
        }
    },
    {
        "id": "73eb016e-ca14-487b-adc4-33bc1c4bacfc",
        "name": "Sales Representative",
        "status": "active",
        "model": {
            "model": "gpt-4-turbo",
            "provider": "openai"
        },
        "voice": {
            "voiceId": "21m00Tcm4TlvDq8ikWAM",
            "provider": "11labs"
        },
        "transcriber": {
            "language": "es",
            "provider": "deepgram"
        },
        "createdAt": "2026-01-07T21:38:28.265000+00:00",
        "metadata": {
            "department": "sales"
        }
    },
    {
        "id": "f2b62b01-2443-4774-bef5-39aad21cbdb4",
        "name": "Lead Qualifier",
        "status": "inactive",
        "model": {
            "model": "gpt-3.5-turbo",
            "provider": "openai"
        },
        "voice": {
            "voiceId": "21m00Tcm4TlvDq8ikWAM",
            "provider": "11labs"
        },
        "transcriber": {
            "language": "en",
            "provider": "deepgram"
        },
        "createdAt": "2026-01-07T21:08:07.439000+00:00",
        "metadata": {
            "department": "marketing"
        }
    },
    {
        "id": "fffb174b-2a80-4d47-a68e-840d34a075fd",
        "name": "Billing Assistant",
        "status": "active",
        "model": {
            "model": "claude-3-opus",
            "provider": "anthropic"
        },
        "voice": {
            "voiceId": "21m00Tcm4TlvDq8ikWAM",
            "provider": "11labs"
        },
        "transcriber": {
            "language": "fr",
            "provider": "deepgram"
        },
        "createdAt": "2026-01-07T21:07:44.186000+00:00",
        "metadata": {
            "department": "finance"
        }
    }
];

function MyAgents() {
    const [agents, setAgents] = useState(assistantsData);
    const [searchTerm, setSearchTerm] = useState("");
    const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState<any>(null);

    const handleEditAgent = (agent: any) => {
        setSelectedAgent(agent);
        setIsEditSheetOpen(true);
    };

    const handleStatusChange = (id: string) => {
        setAgents(prev => prev.map(agent =>
            agent.id === id
                ? { ...agent, status: agent.status === 'active' ? 'inactive' : 'active' }
                : agent
        ));
    };



    return (
        <div>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-text-main font-sans tracking-tight">All Agents</h1>
                        <p className="text-text-muted mt-1">Manage all AI agents and their availability</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="btn btn-primary flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Add Agent
                        </button>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                        <input
                            type="text"
                            placeholder="Search agents by name or department..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input pl-10 w-full"
                        />
                    </div>
                    <button className="btn btn-secondary flex items-center gap-2 border-border-subtle">
                        <Filter className="w-4 h-4" />
                        <span>Filters</span>
                    </button>
                </div>

                {/* Agent Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {agents.map((agent) => (
                        <div className="card p-5 group hover:shadow-glow transition-all duration-300 glass-morphism border-border-subtle" key={agent.id}>
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2.5 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors shadow-sm">
                                    <BotMessageSquare className="w-5 h-5" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`text-[10px] font-bold uppercase tracking-wider ${agent.status === 'active' ? 'text-success' : 'text-text-muted'}`}>
                                        {agent.status}
                                    </span>
                                    <Switch
                                        checked={agent.status === 'active'}
                                        onCheckedChange={() => handleStatusChange(agent.id)}
                                    />
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-text-main mb-1 truncate group-hover:text-primary transition-colors">
                                {agent.name}
                            </h3>
                            <div className="flex items-center gap-2 text-text-muted mb-4 text-xs font-medium tracking-tight">
                                <Briefcase className="w-3 h-3" />
                                <span>{agent.metadata.department.charAt(0).toUpperCase() + agent.metadata.department.slice(1)}</span>
                            </div>

                            <div className="space-y-3 mb-6 bg-white/40 p-3 rounded-lg border border-border-subtle/30">
                                <div className="flex items-center justify-between text-text-main">
                                    <div className="flex items-center gap-2">
                                        <Languages className="w-3.5 h-3.5 text-text-muted" />
                                        <span className="text-xs">Language</span>
                                    </div>
                                    <span className="text-xs font-semibold uppercase">{agent.transcriber.language}</span>
                                </div>

                                <div className="flex items-center justify-between text-text-main">
                                    <div className="flex items-center gap-2">
                                        <Cpu className="w-3.5 h-3.5 text-text-muted" />
                                        <span className="text-xs">Model</span>
                                    </div>
                                    <span className="text-xs font-semibold">{agent.model.model}</span>
                                </div>

                                <div className="flex items-center justify-between text-text-main">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-3.5 h-3.5 text-text-muted" />
                                        <span className="text-xs">Created</span>
                                    </div>
                                    <span className="text-xs font-semibold">
                                        {new Date(agent.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEditAgent(agent)}
                                    className="btn btn-primary flex-1 py-1.5 text-xs font-bold uppercase tracking-wider shadow-sm"
                                >
                                    <Edit className="w-3.5 h-3.5" />
                                    Edit Agent
                                </button>
                                <button className="btn btn-secondary flex items-center justify-center py-1.5 px-3 border-border-subtle hover:text-primary" title="Duplicate">
                                    <Copy className="w-3.5 h-3.5" />
                                </button>
                                <button className="btn btn-secondary flex items-center justify-center py-1.5 px-3 border-border-subtle hover:text-danger hover:bg-danger/5" title="Delete">
                                    <Trash className="w-3.5 h-3.5 text-danger" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>


            </div>
            <SideSheet
                isOpen={isEditSheetOpen}
                onClose={() => setIsEditSheetOpen(false)}
                title="Edit AI Agent"
                size="md"
            >
                {selectedAgent && (
                    <EditAdminAgent
                        onClose={() => setIsEditSheetOpen(false)}
                    />
                )}
            </SideSheet>
        </div>
    );
}

export default MyAgents;