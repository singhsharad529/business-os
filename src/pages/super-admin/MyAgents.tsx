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
    Filter,
    ChevronLeft,
    Layers,
    ArrowRight,
    User,
    Users,
    Phone
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { SideSheet } from "@/components/SideSheet";
import EditAdminAgent from "../../components/super-admin/voicebot/EditAdminAgent";
import AddAdminAgent from "../../components/super-admin/voicebot/AddAdminAgent";
import AgentUserManagement from "../../components/super-admin/voicebot/AgentUserManagement";
import TestCall from "@/components/voicebot/TestCall";

const categoriesData = [
    {
        id: "cat-1",
        name: "Technical Support",
        description: "Assitants specialized in troubleshooting and technical guidance",
        agentCount: 1,
        lastUpdated: "2026-01-08 11:59 AM"
    },
    {
        id: "cat-2",
        name: "Sales Representative",
        description: "Focuses on lead conversion and product demonstrations",
        agentCount: 1,
        lastUpdated: "2026-01-07 09:38 PM"
    },
    {
        id: "cat-3",
        name: "Marketing & Lead Gen",
        description: "Initial outreach and potential lead qualification",
        agentCount: 1,
        lastUpdated: "2026-01-07 09:08 PM"
    },
    {
        id: "cat-4",
        name: "Finance & Billing",
        description: "Handles payment queries and billing adjustments",
        agentCount: 1,
        lastUpdated: "2026-01-07 09:07 PM"
    }
];

const assistantsData = [
    {
        "id": "9fceab74-ae18-41ed-9e06-ed7ff25f2b22",
        "categoryId": "cat-1",
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
        "categoryId": "cat-2",
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
        "categoryId": "cat-3",
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
        "categoryId": "cat-4",
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
    const [activeTab, setActiveTab] = useState<"categories" | "active">("categories");
    const [view, setView] = useState<"categories" | "agents">("categories");
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [agents, setAgents] = useState(assistantsData);
    const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
    const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
    const [isUserSheetOpen, setIsUserSheetOpen] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState<any>(null);
    const [isTestCallOpen, setIsTestCallOpen] = useState(false);

    const handleEditAgent = (agent: any) => {
        setSelectedAgent(agent);
        setIsEditSheetOpen(true);
    };

    const handleManageUsers = (agent: any) => {
        setSelectedAgent(agent);
        setIsUserSheetOpen(true);
    };

    const handleStatusChange = (id: string) => {
        setAgents(prev => prev.map(agent =>
            agent.id === id
                ? { ...agent, status: agent.status === 'active' ? 'inactive' : 'active' }
                : agent
        ));
    };

    const handleSelectCategory = (category: any) => {
        setSelectedCategory(category);
        setSearchTerm("");
        setView("agents");
    };

    const filteredCategories = categoriesData.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredAgentsInCategory = agents.filter(agent =>
        agent.categoryId === selectedCategory?.id &&
        (agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            agent.metadata.department.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const activeAgents = agents.filter(agent =>
        agent.status === "active" &&
        (agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            agent.metadata.department.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            {
                                view === "agents" ? (
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => {
                                                setView("categories");
                                                setSearchTerm("");
                                            }}
                                            className="p-1 hover:bg-bg-alt rounded-lg transition-colors text-text-muted hover:text-primary mr-1"
                                        >
                                            <ChevronLeft className="w-5 h-5 text-primary" />
                                        </button>
                                        <h1 className="text-3xl font-bold text-text-main font-sans tracking-tight">
                                            {selectedCategory?.name}
                                        </h1>
                                    </div>
                                ) : (
                                    <h1 className="text-3xl font-bold text-text-main font-sans tracking-tight">
                                        All Agents
                                    </h1>
                                )
                            }
                        </div>
                        <p className="text-text-muted">
                            List of all currently active AI agents across all categories
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setIsAddSheetOpen(true)}
                            className="btn btn-primary flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add Agent
                        </button>
                        <button
                            onClick={() => setIsTestCallOpen(true)}
                            className="btn btn-primary flex items-center gap-1.5"
                        >
                            <Phone className="w-3.5 h-3.5" />
                            Test Call
                        </button>
                    </div>
                </div>

                {/* Tabs Switcher */}
                <div className="flex items-center justify-between border-b border-border-subtle">
                    <div className="flex gap-8">
                        <button
                            onClick={() => {
                                setActiveTab("categories");
                                setView("categories");
                                setSearchTerm("");
                            }}
                            className={`pb-2 text-sm font-bold transition-all relative ${activeTab === 'categories' ? 'text-primary' : 'text-text-muted hover:text-text-main'}`}
                        >
                            All Categories
                            {activeTab === 'categories' && (
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />
                            )}
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab("active");
                                setSearchTerm("");
                            }}
                            className={`pb-2 text-sm font-bold transition-all relative ${activeTab === 'active' ? 'text-primary' : 'text-text-muted hover:text-text-main'}`}
                        >
                            Active Agents
                            {activeTab === 'active' && (
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Content Rendering based on Tab and View */}
                {activeTab === "categories" ? (
                    view === "categories" ? (
                        <div className="space-y-4">
                            <div className="card p-4 w-full">

                                <div className="flex flex-col sm:flex-row gap-2 mb-4">
                                    <div className="flex-1 relative">
                                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                        <input
                                            type="text"
                                            placeholder="Search categories..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="input pl-8 w-full"
                                        />
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-border-subtle">
                                                <th className="py-4 px-3 text-xs font-semibold text-text-muted tracking-wider text-center">Sr.No.</th>
                                                <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Category Name</th>
                                                <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Description</th>
                                                <th className="text-center py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Total Agents</th>
                                                <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Last Updated</th>
                                                <th className="text-right py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border-subtle/50">
                                            {filteredCategories.map((cat, i) => (
                                                <tr key={cat.id} className="hover:bg-bg-alt/30 transition-colors group cursor-pointer" onClick={() => handleSelectCategory(cat)}>
                                                    <td className="py-4 px-3 text-center text-xs text-text-muted">{i + 1}</td>
                                                    <td className="py-4 px-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                                                <Layers className="w-4 h-4" />
                                                            </div>
                                                            <span className="text-sm text-text-main font-semibold group-hover:text-primary transition-colors">
                                                                {cat.name}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-3 text-sm text-text-muted">
                                                        {cat.description}
                                                    </td>
                                                    <td className="py-4 px-3 text-center">
                                                        <span className="px-2.5 py-1 bg-bg-alt text-text-main text-[10px] font-bold rounded-full border border-border-subtle">
                                                            {cat.agentCount} Agents
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-3 text-sm text-text-muted">
                                                        {cat.lastUpdated}
                                                    </td>
                                                    <td className="py-4 px-3 text-right">
                                                        <button
                                                            className="p-2 hover:bg-primary/10 rounded-lg transition-all text-text-muted hover:text-primary"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleSelectCategory(cat);
                                                            }}
                                                        >
                                                            <ArrowRight className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>



                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Search Bar */}
                            < div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                    <input
                                        type="text"
                                        placeholder="Search agents..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="input pl-10 w-full"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">



                                {filteredAgentsInCategory.length > 0 ? (
                                    filteredAgentsInCategory.map((agent) => (
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
                                                <button
                                                    onClick={() => handleManageUsers(agent)}
                                                    className="btn btn-secondary flex items-center justify-center py-1.5 px-3 border-border-subtle hover:text-primary"
                                                    title="Manage Users"
                                                >
                                                    <Users className="w-3.5 h-3.5" />
                                                </button>
                                                <button className="btn btn-secondary flex items-center justify-center py-1.5 px-3 border-border-subtle hover:text-primary" title="Duplicate">
                                                    <Copy className="w-3.5 h-3.5" />
                                                </button>
                                                <button className="btn btn-secondary flex items-center justify-center py-1.5 px-3 border-border-subtle hover:text-danger hover:bg-danger/5" title="Delete">
                                                    <Trash className="w-3.5 h-3.5 text-danger" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full py-12 text-center text-text-muted italic">
                                        No assistants found in this category.
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {activeAgents.length > 0 ? (
                            activeAgents.map((agent) => (
                                <div className="card p-5 group hover:shadow-glow transition-all duration-300 glass-morphism border-border-subtle" key={agent.id}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-2.5 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors shadow-sm">
                                            <BotMessageSquare className="w-5 h-5" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-success">
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
                                        <button
                                            onClick={() => handleManageUsers(agent)}
                                            className="btn btn-secondary flex items-center justify-center py-1.5 px-3 border-border-subtle hover:text-primary"
                                            title="Manage Users"
                                        >
                                            <Users className="w-3.5 h-3.5" />
                                        </button>
                                        <button className="btn btn-secondary flex items-center justify-center py-1.5 px-3 border-border-subtle hover:text-primary" title="Duplicate">
                                            <Copy className="w-3.5 h-3.5" />
                                        </button>
                                        <button className="btn btn-secondary flex items-center justify-center py-1.5 px-3 border-border-subtle hover:text-danger hover:bg-danger/5" title="Delete">
                                            <Trash className="w-3.5 h-3.5 text-danger" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-12 text-center text-text-muted italic">
                                No active assistants matching your search.
                            </div>
                        )}
                    </div>
                )}
            </div>
            {/* SideSheets */}
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

            <SideSheet
                isOpen={isAddSheetOpen}
                onClose={() => setIsAddSheetOpen(false)}
                title="Create AI Agent"
                size="md"
            >
                <AddAdminAgent
                    onClose={() => setIsAddSheetOpen(false)}
                />
            </SideSheet>

            <SideSheet
                isOpen={isUserSheetOpen}
                onClose={() => setIsUserSheetOpen(false)}
                title="Manage Agent Users"
                size="md"
            >
                {selectedAgent && (
                    <AgentUserManagement
                        agent={selectedAgent}
                        onClose={() => setIsUserSheetOpen(false)}
                    />
                )}
            </SideSheet>

            <SideSheet
                isOpen={isTestCallOpen}
                onClose={() => setIsTestCallOpen(false)}
                title="Test Call"
                size="md"
            >
                <TestCall onCancel={() => setIsTestCallOpen(false)} />
            </SideSheet>
        </div>
    );
}

export default MyAgents;
