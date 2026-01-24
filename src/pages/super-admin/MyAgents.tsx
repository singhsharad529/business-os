import { useEffect, useState } from "react";
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
    ChevronLeft,
    Layers,
    ArrowRight,
    User,
    Phone,
    Eye,
    UserX,
    UserPlus,
    Component,
    Loader2,
    BarChart3,
    Edit2
} from "lucide-react";
import { SideSheet } from "@/components/SideSheet";
import EditAdminAgent from "../../components/super-admin/voicebot/EditAdminAgent";
import AddAdminAgent from "../../components/super-admin/voicebot/AddAdminAgent";
import AgentUserManagement from "../../components/super-admin/voicebot/AgentUserManagement";
import TestCall from "@/components/voicebot/TestCall";
import adminAgentService from "@/api/adminAgentService";
import { toast } from "@/hooks/useToast";
import TableLoader from "@/components/common/TableLoader";
import { AxiosRequestConfig } from "axios";
import CardsLoader from "@/components/common/CardsLoader";
import AddCategory from "@/components/super-admin/voicebot/AddCategory";
import Pagination from "@/components/common/Pagination";
import { AlertDialog } from "@/components/ui/AlertDialog";
import AgentStats from "./AgentStats";




function MyAgents() {
    const [activeTab, setActiveTab] = useState<"categories" | "active">("categories");
    const [view, setView] = useState<"categories" | "agents" | "stats">("categories");
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoriesData, setCategoriesData] = useState<any>(null);
    const [agents, setAgents] = useState<any>(null);
    const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
    const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
    const [isUserSheetOpen, setIsUserSheetOpen] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState<any>(null);
    const [selectedActiveAgent, setSelectedActiveAgent] = useState<any>(null);
    const [isTestCallOpen, setIsTestCallOpen] = useState(false);
    const [isActiveDetailsOpen, setIsActiveDetailsOpen] = useState(false);
    const [isAddCategoryOpen, setIsAddCategoryOpen] = useState<boolean>(false);

    const [agentToDelete, setAgentToDelete] = useState<any>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

    const [allActiveAgents, setAllActiveAgents] = useState<any>(null);
    const [activateAgentsPagination, setActivateAgentsPagination] = useState<any>(null);
    const [activateAgentLoading, setActivateAgentLoading] = useState(false);

    // all loaders
    const [categoriesLoader, setCategoriesLoader] = useState(false);
    const [agentsLoader, setAgentsLoader] = useState(false);
    const [unAssignLoader, setUnassignLoader] = useState(false);
    const [duplicateAgentId, setDuplicateAgentId] = useState<any>(null);

    const handleEditAgent = (agent: any) => {
        setSelectedAgent(agent);
        setIsEditSheetOpen(true);
    };

    const handleViewActiveDetails = (agent: any) => {
        setSelectedActiveAgent(agent);
        setIsActiveDetailsOpen(true);
    };

    const handleManageUsers = (agent: any) => {
        setSelectedAgent(agent);
        setIsUserSheetOpen(true);
    };

    const handleTestCall = (agent: any) => {
        setSelectedAgent(agent);
        setIsTestCallOpen(true);
    }



    // add duplicate agent
    const addDuplicateAgent = async (copyAgent: any) => {
        try {
            setDuplicateAgentId(copyAgent.vapiId);
            const payload: any = {
                assistantId: copyAgent.vapiId,
                name: copyAgent.name,
                description: copyAgent.description,
                categoryId: selectedCategory.id,

            }

            const config: AxiosRequestConfig = {
                params: {
                    type: "TEMPLATE"
                }
            }

            const response = await adminAgentService.duplicateAssistant(copyAgent.vapiId, payload, config);
            if (response) {
                toast.success("Agent duplicated successfully");
                fetchAgents(selectedCategory, 1);
            }
        } catch (error) {
            // console.log(error);
            toast.danger("Failed to duplicate agent")
        }
        finally {
            setDuplicateAgentId(null);
        }
    }



    const filteredCategories = categoriesData?.filter((cat: any) =>
        cat.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredAgentsInCategory = agents?.filter((agent: any) =>
    (agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.metadata.department.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const filteredActiveAgents = allActiveAgents?.filter((agent: any) =>
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.metadata.department.toLowerCase().includes(searchTerm.toLowerCase())
    );



    const activeAgentsPageSize = 10;
    const fetchAllActiveAgents = async (page: number = 1, pageSize: number = activeAgentsPageSize) => {
        try {
            setActivateAgentLoading(true);
            const config: AxiosRequestConfig = {
                params: {
                    page: page,
                    page_size: pageSize
                }
            }
            const response = await adminAgentService.getAllActiveAssistants(config);
            if (response.data && response.data.assistants) {
                setAllActiveAgents(response.data.assistants);
            }
            if (response.data && response.data.pagination) {
                setActivateAgentsPagination(response.data.pagination);
            }
        } catch (error) {
            toast.danger("Failed to fetch active agents");
        }
        finally {
            setActivateAgentLoading(false);
        }
    }

    const handleActiveAgentPageChange = (page: number) => {
        fetchAllActiveAgents(page);
    };

    const unAssignUser = async () => {
        try {

            setUnassignLoader(true);
            const payload: any = {
                assistantId: selectedActiveAgent.vapiId,
                userId: selectedActiveAgent.userId,
                phoneNumberVapiId: selectedActiveAgent.phoneNumberVapiId
            }

            const response = await adminAgentService.unassignAssistantToUser(payload);
            if (response) {
                toast.success("Agent unassigned successfully")
            }
            setIsActiveDetailsOpen(false);
            fetchAllActiveAgents();

        } catch (error) {
            toast.danger("Failed to unassign agent")
        }
        finally {
            setUnassignLoader(false)
        }

    }


    const agentPageSize = 10;
    const fetchAgents = async (cat: any, page: number, pageSize: number = agentPageSize) => {

        // console.log('cateory is', cat);
        setSelectedCategory(cat);
        setSearchTerm("");
        setView("agents");

        const config: AxiosRequestConfig = {
            params: {
                page: page,
                page_size: pageSize,
                type: "TEMPLATE",
                categoryId: cat?.id
            }
        }

        try {
            setAgentsLoader(true);
            const response = await adminAgentService.getAgentsByCategory(config);
            // console.log('response', response);
            if (response.data && response.data.assistants)
                setAgents(response.data.assistants);


        } catch (error) {
            toast.danger("Failed to fetch agents")
        }
        finally {
            setAgentsLoader(false);
        }
    }

    // fetch all agent categories
    const fetchAgentCategories = async () => {
        try {
            setCategoriesLoader(true);
            const response = await adminAgentService.getAgentCategories({});
            // console.log('response', response);
            setCategoriesData(response.data.categories)
        } catch (error) {
            toast.danger("Failed to fetch agent categories")
        }
        finally {
            setCategoriesLoader(false);
        }
    }

    useEffect(() => {
        fetchAgentCategories();
    }, [])

    useEffect(() => {
        if (activeTab === "active") {
            fetchAllActiveAgents();
        }
    }, [activeTab]);


    const confirmDeleteAgent = async () => {
        if (!agentToDelete) return;

        try {
            setDeleteLoading(true);
            await adminAgentService.deleteAssistant(agentToDelete.vapiId || agentToDelete?.vapiAssistantId, {});
            toast.success("Agent deleted successfully");
            await fetchAgents(selectedCategory, 1); // Reload the list
            setIsDeleteAlertOpen(false);
            setAgentToDelete(null);
        } catch (error) {
            // console.error(error);
            toast.danger("Failed to delete agent");
        } finally {
            setDeleteLoading(false);
        }
    };


    if (view === "stats") {
        return (
            <AgentStats
                agent={selectedActiveAgent}
                onBack={() => setView("categories")}
            />
        )
    }

    return (
        <div>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            {
                                view === "agents" && (
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => {
                                                setView("categories");
                                                setSearchTerm("");
                                                setSelectedCategory(null);
                                            }}
                                            className="p-1 hover:bg-bg-alt rounded-lg transition-colors text-text-muted hover:text-primary mr-1"
                                        >
                                            <ChevronLeft className="w-5 h-5 text-primary" />
                                        </button>
                                        <h1 className="text-3xl font-bold text-text-main font-sans tracking-tight">
                                            {selectedCategory?.label}
                                        </h1>
                                    </div>
                                )
                            }
                            {
                                view === "categories" && activeTab === "categories" && (
                                    <h1 className="text-3xl font-bold text-text-main font-sans tracking-tight">
                                        All Categories
                                    </h1>
                                )
                            }
                            {
                                activeTab === "active" && (
                                    <h1 className="text-3xl font-bold text-text-main font-sans tracking-tight">
                                        All Active Agents
                                    </h1>
                                )
                            }
                        </div>
                        <p className="text-text-muted">
                            {
                                activeTab === "categories" && view === "categories" && (
                                    "List of all categories"
                                )
                            }
                            {
                                activeTab === "categories" && view === "agents" && (
                                    `List of all ${selectedCategory?.label} templates`
                                )
                            }
                            {
                                activeTab === "active" && (
                                    "List of all currently active agents assigned to clients"
                                )
                            }
                        </p>
                    </div>
                    <div className="flex gap-4">
                        {
                            selectedCategory && (
                                <button
                                    onClick={() => setIsAddSheetOpen(true)}
                                    className="btn btn-primary flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Agent
                                </button>
                            )
                        }
                        {/* <button
                            onClick={() => setIsTestCallOpen(true)}
                            className="btn btn-primary flex items-center gap-1.5"
                        >
                            <Phone className="w-3.5 h-3.5" />
                            Test Call
                        </button> */}
                        <button
                            onClick={() => setIsAddCategoryOpen(true)}
                            className="btn btn-primary flex items-center gap-1.5"
                        >
                            <Component className="w-3.5 h-3.5" />
                            Add Category
                        </button>
                    </div>
                </div>

                {/* Tabs Switcher */}
                <div className="flex items-center justify-between border-b border-border-subtle">
                    <div className="flex gap-8">
                        <button
                            onClick={() => {
                                {
                                    if (selectedCategory) {
                                        setActiveTab("categories");
                                        setView("agents");
                                        setSearchTerm("");

                                    } else {
                                        setActiveTab("categories");
                                        setView("categories");
                                        setSearchTerm("");

                                    }
                                }
                            }}
                            className={`pb-2 text-sm font-bold transition-all relative ${activeTab === 'categories' ? 'text-primary' : 'text-text-muted hover:text-text-main'}`}
                        >
                            {selectedCategory ? "All Templates" : "All Categories"}
                            {activeTab === 'categories' && (
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />
                            )}
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab("active");
                                setView("categories")
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
                        <div>
                            {
                                categoriesLoader ? (<TableLoader rows={3} columns={5} />) :
                                    (
                                        <div>
                                            {

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

                                                        {
                                                            filteredCategories && filteredCategories.length > 0 ? (
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
                                                                            {filteredCategories.map((cat: any, i: number) => (
                                                                                <tr key={cat.id} className="hover:bg-bg-alt/30 transition-colors group cursor-pointer" onClick={() => fetchAgents(cat, 1, agentPageSize)}>
                                                                                    <td className="py-4 px-3 text-center text-xs text-text-muted">{i + 1}</td>
                                                                                    <td className="py-4 px-3">
                                                                                        <div className="flex items-center gap-3">
                                                                                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                                                                                <Layers className="w-4 h-4" />
                                                                                            </div>
                                                                                            <span className="text-sm text-text-main font-semibold group-hover:text-primary transition-colors">
                                                                                                {cat.label}
                                                                                            </span>
                                                                                        </div>
                                                                                    </td>
                                                                                    <td className="py-4 px-3 text-sm text-text-muted">
                                                                                        {cat.description}
                                                                                    </td>
                                                                                    <td className="py-4 px-3 text-center">
                                                                                        <span className="px-2.5 py-1 bg-bg-alt text-text-main text-[10px] font-bold rounded-full border border-border-subtle">
                                                                                            {cat.totalAgents} Agents
                                                                                        </span>
                                                                                    </td>
                                                                                    <td className="py-4 px-3 text-sm text-text-muted">
                                                                                        {cat.lastUpdated ? new Date(cat.lastUpdated).toLocaleString('en-US', {
                                                                                            year: 'numeric',
                                                                                            month: 'short',
                                                                                            day: 'numeric',
                                                                                            hour: '2-digit',
                                                                                            minute: '2-digit'
                                                                                        }) : '-'}
                                                                                    </td>
                                                                                    <td className="py-4 px-3 text-right">
                                                                                        <button
                                                                                            className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-all hover:text-primary"
                                                                                            onClick={(e) => {
                                                                                                e.stopPropagation();
                                                                                                fetchAgents(cat, 1, agentPageSize);
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
                                                            )
                                                                :
                                                                (<div className="flex items-center justify-center h-full">
                                                                    <p className="text-text-muted">No categories found</p>
                                                                </div>)
                                                        }
                                                    </div>



                                                </div>


                                            }

                                        </div>
                                    )
                            }
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
                            {
                                agentsLoader ? (<CardsLoader />) :
                                    (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {filteredAgentsInCategory && filteredAgentsInCategory.length > 0 ? (
                                                filteredAgentsInCategory.map((agent: any) => (
                                                    <div className="card p-5 group hover:shadow-glow transition-all duration-300 glass-morphism border-border-subtle" key={agent.id}>
                                                        <div className="flex justify-between items-start mb-4">
                                                            <div className="p-2.5 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors shadow-sm">
                                                                <BotMessageSquare className="w-5 h-5" />
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                {/* <span className={`text-[10px] font-bold uppercase tracking-wider ${agent.status === 'active' ? 'text-success' : 'text-text-muted'}`}>
                                                        {agent.status}
                                                    </span> */}
                                                                {/* <Switch
                                                        checked={agent.status === 'active'}
                                                        onCheckedChange={() => handleStatusChange(agent.id)}
                                                    /> */}
                                                                <button className="btn btn-secondary text-xs"
                                                                    onClick={() => handleTestCall(agent)}
                                                                >
                                                                    <Phone className="w-4 h-4" />
                                                                    Test
                                                                </button>
                                                                <button className="btn btn-success btn-sm bg-success/10 text-success text-xs border border-success/10"
                                                                    onClick={() => handleManageUsers(agent)}
                                                                >
                                                                    <UserPlus className="w-4 h-4" />
                                                                </button>

                                                            </div>
                                                        </div>

                                                        <h3 className="text-lg font-bold text-text-main mb-1 truncate group-hover:text-primary transition-colors">
                                                            {agent?.name}
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
                                                                <span className="text-xs font-semibold uppercase">{agent.language}</span>
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

                                                        {/* <div className="flex gap-2 mb-4">
                                                            <button
                                                                onClick={() => navigate(`/app/super-admin/agent/${agent.vapiId}`)}
                                                                className="btn btn-secondary flex-1 py-1.5 text-xs font-bold uppercase tracking-wider border-primary/20 text-primary hover:bg-primary hover:text-white transition-all duration-300"
                                                            >
                                                                <BarChart3 className="w-3.5 h-3.5" />
                                                                View Stats
                                                            </button>
                                                        </div> */}

                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleEditAgent(agent)}
                                                                className="btn btn-primary flex-1 py-1.5 text-xs font-bold uppercase tracking-wider shadow-sm"
                                                            >
                                                                <Edit className="w-3.5 h-3.5" />
                                                                Edit Agent
                                                            </button>
                                                            {/* <button
                                                    onClick={() => handleManageUsers(agent)}
                                                    className="btn btn-secondary flex items-center justify-center py-1.5 px-3 border-border-subtle hover:text-primary"
                                                    title="Manage Users"
                                                >
                                                    <Users className="w-3.5 h-3.5" />
                                                </button> */}
                                                            <button className="btn btn-secondary flex items-center justify-center py-1.5 px-3 border-border-subtle hover:text-primary" title="Duplicate"
                                                                onClick={() =>
                                                                    addDuplicateAgent(agent)
                                                                }
                                                            >
                                                                {duplicateAgentId && duplicateAgentId === agent.vapiId ? (
                                                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                                ) : (
                                                                    <Copy className="w-3.5 h-3.5" />
                                                                )}
                                                            </button>
                                                            <button className="btn btn-secondary flex items-center justify-center py-1.5 px-3 border-border-subtle hover:text-danger hover:bg-danger/5" title="Delete"
                                                                onClick={() => {
                                                                    setAgentToDelete(agent);
                                                                    setIsDeleteAlertOpen(true)
                                                                }}
                                                            >
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
                                    )
                            }

                        </div>
                    )
                ) : (
                    <div>
                        {
                            activateAgentLoading ? (
                                <div className="flex items-center justify-center h-full">
                                    <TableLoader rows={3} columns={5} />
                                </div>
                            ) : (
                                <div>
                                    <div className="card p-4">
                                        <div className="flex flex-col sm:flex-row gap-4 mb-4">
                                            <div className="flex-1 relative">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                                <input
                                                    type="text"
                                                    placeholder="Search active agents..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className="input pl-10 w-full"
                                                />
                                            </div>
                                        </div>
                                        {
                                            allActiveAgents && allActiveAgents.length > 0 ? (
                                                <div className="overflow-x-auto">
                                                    <table className="w-full">
                                                        <thead>
                                                            <tr className="border-b border-border-subtle">
                                                                <th className="py-4 px-3 text-xs font-semibold text-text-muted tracking-wider text-center">Sr. No.</th>
                                                                <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Agent Name</th>
                                                                <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Client Name</th>
                                                                <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Assigned Date</th>
                                                                {/* <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Status</th> */}
                                                                <th className="text-right py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Actions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-border-subtle/50">
                                                            {filteredActiveAgents.map((agent: any, i: number) => (
                                                                <tr key={agent.id} className="hover:bg-bg-alt/30 transition-colors">
                                                                    <td className="py-4 px-3 text-center text-xs text-text-muted">
                                                                        {(activateAgentsPagination?.page - 1) * (activateAgentsPagination?.pageSize || agentPageSize) + i + 1}
                                                                    </td>
                                                                    <td className="py-4 px-3 text-sm text-text-main font-medium">{agent.name}</td>
                                                                    <td className="py-4 px-3 text-sm text-text-muted">{agent.clientName}</td>
                                                                    <td className="py-4 px-3 text-sm text-text-muted">{new Date(agent.createdAt).toLocaleString("en-IN", {
                                                                        day: "2-digit",
                                                                        month: "short",
                                                                        year: "numeric",
                                                                    })}</td>
                                                                    {/* <td className="py-4 px-3">
                                                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${agent.status === 'In Use' ? 'bg-success/10 text-success' :
                                                                            agent.status === 'Idle' ? 'bg-warning/10 text-warning' :
                                                                                'bg-bg-alt text-text-muted'
                                                                            }`}>
                                                                            {agent.status}
                                                                        </span>
                                                                    </td> */}

                                                                    <td className="py-4 px-3 text-right">
                                                                        <button
                                                                            onClick={() => {
                                                                                setSelectedActiveAgent(agent);
                                                                                setView("stats");
                                                                            }}
                                                                            className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-all cursor-pointer hover:text-primary"
                                                                            title="View Stats"
                                                                        >
                                                                            <BarChart3 className="w-4 h-4" />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleViewActiveDetails(agent)}
                                                                            className="p-2 text-success hover:bg-success/10 rounded-lg transition-all cursor-pointer hover:text-success"
                                                                            title="View Details"
                                                                        >
                                                                            <Edit2 className="w-4 h-4" />
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                    {filteredActiveAgents.length === 0 && (
                                                        <div className="py-12 text-center text-text-muted italic">
                                                            No active agents matching your search.
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                                :
                                                (
                                                    (<div className="flex items-center justify-center h-full">
                                                        <p className="text-text-muted">No active agents found</p>
                                                    </div>)
                                                )
                                        }
                                        {activateAgentsPagination && (
                                            <Pagination
                                                currentPage={activateAgentsPagination.page}
                                                totalPages={activateAgentsPagination.totalPages}
                                                pageSize={activateAgentsPagination.pageSize}
                                                totalCount={activateAgentsPagination.total}
                                                onPageChange={handleActiveAgentPageChange}
                                            />
                                        )}
                                    </div>
                                </div>
                            )
                        }
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
                        agent={selectedAgent}
                        onClose={() => setIsEditSheetOpen(false)}
                        onSuccess={() => {
                            setIsEditSheetOpen(false);
                            fetchAgents(selectedCategory, 1);
                        }}
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
                    onSuccess={() => {
                        setIsAddSheetOpen(false);
                        fetchAgents(selectedCategory, 1);
                    }}
                    category={selectedCategory}
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
                isOpen={isActiveDetailsOpen}
                onClose={() => setIsActiveDetailsOpen(false)}
                title="Active Agent Details"
                size="md"
            >
                {selectedActiveAgent && (
                    <div className="space-y-8 p-1">
                        {/* Client Info Section */}
                        <div className="relative z-10 bg-bg-alt/20 p-6 rounded-2xl border border-border-subtle shadow-sm overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />

                            <div className="relative z-10">
                                <div className="flex items-center gap-5">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white shadow-glow shrink-0">
                                        <User className="w-8 h-8" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                                                {selectedActiveAgent.clientName}
                                            </h2>
                                            {/* <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold uppercase rounded-md border border-primary/20">
                                                {selectedActiveAgent?.clientInfo.industry}
                                            </span> */}
                                        </div>
                                        {/* <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-text-muted font-medium">
                                            <span className="flex items-center gap-1.5">
                                                <Mail className="w-3.5 h-3.5 text-primary/70" />
                                                {selectedActiveAgent.clientInfo.email}
                                            </span>
                                            <span className="hidden sm:block w-1 h-1 rounded-full bg-border-subtle" />
                                            <span className="flex items-center gap-1.5">
                                                <Phone className="w-3.5 h-3.5 text-primary/70" />
                                                {selectedActiveAgent.clientInfo.phone}
                                            </span>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Agent Details Section - Simplified for this view */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                                    <BotMessageSquare className="w-5 h-5 text-primary" />
                                    Agent Configuration
                                </h3>
                                {/* <button className="btn btn-error btn-sm bg-danger/20 text-danger text-xs border border-danger/20"
                                    onClick={unAssignUser}
                                >
                                    <UserX className="w-4 h-4" />
                                    {unAssignLoader ? <Loader2 className="w-4 h-4 animate-spin" /> : "Unassign"}
                                </button> */}
                            </div>
                            <EditAdminAgent
                                agent={selectedActiveAgent}
                                onClose={() => setIsActiveDetailsOpen(false)}
                                isActive={true}
                                onSuccess={() => {
                                    setIsEditSheetOpen(false);
                                    fetchAllActiveAgents();
                                }}
                                deleteFile={() => {
                                    fetchAllActiveAgents();

                                }}
                            />
                        </div>
                    </div>
                )}
            </SideSheet>

            <SideSheet
                isOpen={isTestCallOpen}
                onClose={() => { setIsTestCallOpen(false); setSelectedAgent(null); }}
                title="Test Call"
                size="md"
            >
                <TestCall onCancel={() => {
                    setIsTestCallOpen(false);

                }}
                    agent={selectedAgent}
                />
            </SideSheet>

            <SideSheet
                isOpen={isAddCategoryOpen}
                onClose={() => setIsAddCategoryOpen(false)}
                title="Add Category"
                size="md"
            >
                <AddCategory onClose={() => setIsAddCategoryOpen(false)}
                    onSuccess={() => fetchAgentCategories()}
                />
            </SideSheet>

            <AlertDialog
                isOpen={isDeleteAlertOpen}
                onClose={() => setIsDeleteAlertOpen(false)}
                onConfirm={confirmDeleteAgent}
                title="Delete Agent"
                description="Are you sure you want to delete this agent? This action cannot be undone and will remove the agent from your list."
                confirmText="Delete Agent"
                isLoading={deleteLoading}
            />
        </div>
    );
}

export default MyAgents;
