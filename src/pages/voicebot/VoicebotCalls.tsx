import { useEffect, useMemo, useState } from "react";
import { Search, Filter, RotateCcw, X, BotMessageSquare, Phone, Languages, Briefcase, MoveLeft, Trash, Loader2, Eye, Edit } from "lucide-react";
import { SideSheet } from "@/components/SideSheet";
import { AlertDialog } from "@/components/ui/AlertDialog";
import { Switch } from "@/components/ui/switch";
import { CallDetails } from "@/components/voicebot/CallDetails";
import NewAgent from "@/components/voicebot/NewAgent";
import voiceBotService from "@/api/voicebotService";
import { useData } from "@/contexts/DataContext";
import CardsLoader from "@/components/common/CardsLoader";
import TableLoader from "@/components/common/TableLoader";
import EditAgent from "@/components/voicebot/EditAgent";
import TestCall from "@/components/voicebot/TestCall";
import { toast } from "@/hooks/useToast";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { AxiosRequestConfig } from "axios";

export default function VoicebotCalls() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sentimentFilter, setSentimentFilter] = useState<string[]>([]);
    const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
    const [selectedCall, setSelectedCall] = useState<any>(null);
    const [isSideSheetOpen, setIsSideSheetOpen] = useState<boolean>(false);
    const [isOpenedCalls, setIsOpenedCalls] = useState<boolean>(false);
    const [isNewAgentOpen, setIsNewAgentOpen] = useState<boolean>(false);
    const [isTestCallOpen, setIsTestCallOpen] = useState<boolean>(false);
    const [selectedAgentToEdit, setSelectedAgentToEdit] = useState<any>(null);
    const [isEditAgentOpen, setIsEditAgentOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState<boolean>(false);
    const [agentToDelete, setAgentToDelete] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
    const [callLogs, setCallLogs] = useState<any[]>([]);
    const [detailLoading, setDetailLoading] = useState<boolean>(false);
    const { user } = useAuth();
    const { agents, setAgents } = useData();

    const sentiments = ["positive", "neutral", "negative"];
    const statuses = ["completed", "missed", "failed", "ongoing"];

    const statusColors: Record<string, string> = {
        completed: "badge-success",
        missed: "badge-warning",
        failed: "badge-danger",
        ongoing: "badge-primary",
        ended: "badge-success"
    };



    const getAllAgents = async (returnAll: boolean = true) => {
        try {
            setLoading(true);
            const requestConfig: AxiosRequestConfig = {
                params: {
                    returnAll
                }
            }
            const response = await voiceBotService.getAllAgents(requestConfig);
            // console.log(response);
            setAgents(response);

        } catch (error) {
            // console.log(error);
            toast.danger("Failed to get agents");
        } finally {
            setLoading(false);
        }
    }

    const handleStatusChange = async (agentId: string) => {
        // Logic will be added later by the user
        // status will be 'active' or 'inactive'
        console.log(`Status change for agent ${agentId}`);

        let isTogglled = false;

        try {

            const tempAgents = [...agents.agents];
            const agentIndex = tempAgents.findIndex((agent: any) => agent.vapiId === agentId);
            if (agentIndex === -1) {
                toast.danger("Agent not found");
                return;
            }
            tempAgents[agentIndex].status = tempAgents[agentIndex].status === 'active' ? 'inactive' : 'active';
            setAgents({
                agents: tempAgents
            });

            isTogglled = true;

            const response = await voiceBotService.updateAgentStatus(agentId, {}, {});
            console.log(response);
            toast.success("Agent status updated successfully");


            // setAgents(response);
        } catch (error) {
            // console.log(error);
            toast.danger("Failed to update agent status");
            if (isTogglled) {

                const tempAgents = [...agents.agents];
                const agentIndex = tempAgents.findIndex((agent: any) => agent.vapiId === agentId);

                tempAgents[agentIndex].status = tempAgents[agentIndex].status === 'active' ? 'inactive' : 'active';
                setAgents({
                    agents: tempAgents
                });

            }
        } finally {

        }
    };


    const handleDeleteAgent = (agentId: string) => {
        setAgentToDelete(agentId);
        setIsDeleteAlertOpen(true);
    };

    const confirmDeleteAgent = async () => {
        if (!agentToDelete) return;

        try {
            setDeleteLoading(true);
            await voiceBotService.deleteAgent(agentToDelete, {});
            toast.success("Agent deleted successfully");
            await getAllAgents(); // Reload the list
            setIsDeleteAlertOpen(false);
            setAgentToDelete(null);
        } catch (error) {
            // console.error(error);
            toast.danger("Failed to delete agent");
        } finally {
            setDeleteLoading(false);
        }
    };


    const handleCallClick = async (call: any) => {
        if (!call.vapiId) return;
        try {
            setDetailLoading(true);
            const response = await voiceBotService.getCallDetail(call.vapiId, {});
            setSelectedCall(response);
            setIsSideSheetOpen(true);
        } catch (error) {
            // console.error(error);
            toast.danger("Failed to load call details");
        } finally {
            setDetailLoading(false);
        }
    };

    const getCallReports = async (agent: any) => {
        // if (!agent.vapiId || !agent.phoneNumbers?.[0]?.vapiId) {
        //     toast.danger("Agent or Phone Number ID missing");
        //     return;
        // }

        try {
            setLoading(true);
            setIsOpenedCalls(true);
            // Reset filters when opening new agent reports
            setSearchTerm("");
            setStatusFilter("all");
            setSentimentFilter([]);
            const response = await voiceBotService.getAgentCallReports({
                assistantId: agent.vapiId,
                phoneNumberId: agent.phoneNumbers?.[0]?.vapiId,
                page: 1,
                page_size: 20
            }, {});
            setCallLogs(response.reports || []);
        } catch (error) {
            console.error(error);
            toast.danger("Failed to get call reports");
        } finally {
            setLoading(false);
        }
    }

    const getCallLogs = async () => {
        try {
            setLoading(true);
            const response = await voiceBotService.getCallLogs({});
            // console.log(response);
            // setCalls(response);

        } catch (error) {
            // console.log(error);
            toast.danger("Failed to get call logs");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getAllAgents();
    }, []);

    const filteredCallLogs = useMemo(() => {
        return callLogs.filter((call) => {
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch =
                (call.customerNumber?.toLowerCase() || "").includes(searchLower) ||
                (call.phoneNumber?.toLowerCase() || "").includes(searchLower) ||
                (call.id?.toLowerCase() || "").includes(searchLower);

            const matchesStatus = statusFilter === "all" || call.status === statusFilter;

            // Optional: Filter by sentiment if it exists in the data
            const callSentiment = call.analysis?.sentiment?.toLowerCase();
            const matchesSentiment =
                sentimentFilter.length === 0 ||
                (callSentiment && sentimentFilter.includes(callSentiment));

            return matchesSearch && matchesStatus && matchesSentiment;
        });
    }, [callLogs, searchTerm, statusFilter, sentimentFilter]);


    return (
        <div>
            <div className="space-y-6 my-2">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-text-main">Agents & Calls History</h1>
                        <p className="text-text-muted mt-1">View and analyze all your AI agents & calls</p>
                    </div>
                    {
                        !isOpenedCalls && (
                            <div className="flex gap-4">
                                <button
                                    onClick={() => {
                                        if (user && !user.companyId) {
                                            toast.danger("Please create a company from Company section to start using the voicebot");

                                            return;
                                        }
                                        setIsNewAgentOpen(true)
                                    }}
                                    className="btn btn-primary flex items-center gap-1.5"
                                >
                                    <BotMessageSquare className="w-3.5 h-3.5" />
                                    Create Agent
                                </button>
                                <button
                                    onClick={() => setIsTestCallOpen(true)}
                                    className="btn btn-primary flex items-center gap-1.5"
                                >
                                    <Phone className="w-3.5 h-3.5" />
                                    Test Call
                                </button>
                            </div>
                        )
                    }
                </div>

                {loading ? (
                    isOpenedCalls ? <TableLoader rows={5} columns={5} /> : <CardsLoader />
                ) : (
                    <div className="flex flex-col min-h-[500px]">
                        {
                            agents && agents.agents && agents.agents.length > 0 ? (
                                <div>
                                    {!isOpenedCalls && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {agents.agents.map((agent: any) => (
                                                <div className="card p-5 group hover:shadow-glow transition-all duration-300" key={agent.id}>
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className="p-2.5 bg-primary-soft rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                                            <BotMessageSquare className="w-5 h-5" />
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className={`text-xs font-medium ${agent.status === 'active' ? 'text-primary' : 'text-text-muted'}`}>
                                                                {agent.status ? agent.status.charAt(0).toUpperCase() + agent.status.slice(1) : "Inactive"}
                                                            </span>
                                                            <Switch
                                                                checked={agent.status === 'active'}
                                                                onCheckedChange={(checked) => handleStatusChange(agent.vapiId)}
                                                            />
                                                        </div>
                                                    </div>

                                                    <h3 className="text-lg font-bold text-text-main mb-1 truncate">{agent.name}</h3>
                                                    <div className="flex items-center gap-2 text-text-muted mb-4 text-xs">
                                                        <Briefcase className="w-3 h-3" />
                                                        <span >{agent.metadata.department.charAt(0).toUpperCase() + agent.metadata.department.slice(1)}</span>
                                                    </div>

                                                    <div className="space-y-2.5 mb-6">
                                                        <div className="flex items-center gap-2 text-text-main">
                                                            <Languages className="w-3.5 h-3.5 text-text-muted" />
                                                            <span className="text-xs">{agent.metadata.language}</span>
                                                        </div>
                                                        {/* <div className="flex items-center gap-2 text-text-main">
                                                            <Globe className="w-3.5 h-3.5 text-text-muted" />
                                                            <span className="text-xs">{agent.metadata.region}</span>
                                                        </div> */}
                                                        <div className="flex items-center gap-2 text-text-main font-medium">
                                                            <Phone className="w-3.5 h-3.5 text-primary" />
                                                            <span className="text-xs">{agent && agent.phoneNumbers && agent.phoneNumbers.length > 0 ? agent.phoneNumbers[0].number : "Number Not Linked"}</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <button
                                                            className="btn btn-primary flex-1 py-1.5 text-xs"
                                                            onClick={() => {
                                                                setSelectedAgentToEdit(agent);
                                                                setIsEditAgentOpen(true);
                                                            }}
                                                        >
                                                            <Edit className="w-3 h-3" />
                                                            Edit Agent
                                                        </button>
                                                        <button
                                                            className="btn btn-secondary flex items-center gap-1.5 py-1.5 text-xs px-3"
                                                            onClick={() => getCallReports(agent)}
                                                        >
                                                            <Phone className="w-3 h-3" />
                                                            Calls
                                                        </button>
                                                        <button
                                                            className="btn btn-secondary flex items-center gap-1.5 py-1.5 text-xs px-3"
                                                            onClick={() => handleDeleteAgent(agent.vapiId)}
                                                        >
                                                            <Trash className="w-3 h-3" />

                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {isOpenedCalls && (
                                        <div className="card p-4">
                                            <div className="flex flex-col sm:flex-row gap-2 mb-4">
                                                <button
                                                    className="btn btn-secondary bg-primary-soft text-primary flex items-center gap-1.5 py-1.5 text-xs px-3 border-primary"
                                                    onClick={() => {
                                                        setIsOpenedCalls(false);
                                                        setSearchTerm("");
                                                        setStatusFilter("all");
                                                        setSentimentFilter([]);
                                                    }}
                                                >
                                                    <MoveLeft className="w-3 h-3" />
                                                    Agents
                                                </button>
                                                <div className="flex-1 relative">
                                                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                                    <input
                                                        type="text"
                                                        placeholder="Search calls..."
                                                        value={searchTerm}
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                        className="input pl-8 w-full"
                                                    />
                                                </div>

                                                <div className="flex gap-2 relative">
                                                    <select
                                                        value={statusFilter}
                                                        onChange={(e) => setStatusFilter(e.target.value)}
                                                        className="input min-w-[120px]"
                                                    >
                                                        <option value="all">All Statuses</option>
                                                        {statuses.map((s) => (
                                                            <option key={s} value={s} className="capitalize">
                                                                {s}
                                                            </option>
                                                        ))}
                                                    </select>

                                                    <button
                                                        className="btn btn-secondary flex items-center gap-1.5"
                                                        onClick={() => setIsFilterOpen((v) => !v)}
                                                    >
                                                        <Filter className="w-3.5 h-3.5" />
                                                        <span className="hidden sm:inline">Filter</span>
                                                    </button>

                                                    {isFilterOpen && (
                                                        <div className="absolute right-0 top-10 z-10 w-64 rounded-md border border-border bg-white shadow-lg p-3 space-y-2">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-sm font-semibold text-text-main">
                                                                    Sentiment
                                                                </span>
                                                                <div className="flex items-center gap-1.5">
                                                                    <button
                                                                        className="p-1 rounded hover:bg-bg"
                                                                        onClick={() => setSentimentFilter([])}
                                                                    >
                                                                        <RotateCcw className="w-3.5 h-3.5 text-primary" />
                                                                    </button>
                                                                    <button
                                                                        className="p-1 rounded hover:bg-bg"
                                                                        onClick={() => setIsFilterOpen(false)}
                                                                    >
                                                                        <X className="w-3.5 h-3.5 text-text-muted" />
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            {sentiments.map((s) => {
                                                                const checked = sentimentFilter.includes(s);
                                                                return (
                                                                    <label
                                                                        key={s}
                                                                        className="flex items-center gap-2 text-xs"
                                                                    >
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={checked}
                                                                            onChange={() =>
                                                                                setSentimentFilter((prev) =>
                                                                                    checked
                                                                                        ? prev.filter((x) => x !== s)
                                                                                        : [...prev, s]
                                                                                )
                                                                            }
                                                                        />
                                                                        <span className="capitalize">{s}</span>
                                                                    </label>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {callLogs.length === 0 ? (
                                                <div className="text-center py-12 text-text-muted text-xs">
                                                    No call reports found for this agent
                                                </div>
                                            ) : filteredCallLogs.length === 0 ? (
                                                <div className="text-center py-12 text-text-muted text-xs">
                                                    No calls found matching your filters
                                                </div>
                                            ) : (
                                                <div className="overflow-x-auto">
                                                    <table className="w-full">
                                                        <thead>
                                                            <tr className="bg-bg">
                                                                <th className="text-left py-2 px-3 text-xs font-semibold">Customer</th>
                                                                <th className="text-left py-2 px-3 text-xs font-semibold">Status</th>
                                                                <th className="text-left py-2 px-3 text-xs font-semibold">Duration</th>
                                                                <th className="text-left py-2 px-3 text-xs font-semibold">Type</th>
                                                                <th className="text-left py-2 px-3 text-xs font-semibold">Date</th>
                                                                <th className="text-left py-2 px-3 text-xs font-semibold">Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {filteredCallLogs.map((call) => (
                                                                <tr
                                                                    key={call.id}
                                                                    className={`hover:bg-bg transition-colors ${detailLoading ? 'opacity-50 pointer-events-none' : ''}`}
                                                                // onClick={() => handleCallClick(call)}
                                                                >
                                                                    <td className="py-2.5 px-3">
                                                                        <div className="text-xs font-medium">
                                                                            {call.customerNumber || "Unknown"}
                                                                        </div>
                                                                        <div className="text-[10px] text-text-muted">
                                                                            {call.phoneNumber || ""}
                                                                        </div>
                                                                    </td>

                                                                    <td className="py-2.5 px-3">
                                                                        <span className={`badge ${statusColors[call.status] || 'badge-primary'}`}>
                                                                            {call.status}
                                                                        </span>
                                                                    </td>

                                                                    <td className="py-2.5 px-3 text-xs">
                                                                        {Math.floor(call.durationSeconds / 60)}m {Math.floor(call.durationSeconds % 60)}s
                                                                    </td>

                                                                    <td className="py-2.5 px-3 text-xs capitalize">
                                                                        {call.type?.replace(/([A-Z])/g, ' $1').trim()}
                                                                    </td>

                                                                    <td className="py-2.5 px-3 text-xs text-text-muted">
                                                                        {new Date(call.startedAt).toLocaleString()}
                                                                    </td>
                                                                    <td className="py-2.5 px-3 text-xs text-text-muted">
                                                                        {
                                                                            detailLoading ? (
                                                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                            ) : (
                                                                                <button className="p-2 hover:bg-primary/10 rounded-lg transition-all cursor-pointer" onClick={() => handleCallClick(call)}>
                                                                                    <Eye className="w-4 h-4" />
                                                                                </button>
                                                                            )
                                                                        }
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div
                                    className="flex flex-col items-center justify-center flex-1 py-12"
                                >
                                    <h2 className="text-2xl font-semibold">Agents are not available</h2>
                                    <p className="text-text-muted">Please add an agent to start using the voicebot</p>
                                </div>
                            )
                        }
                    </div>

                )}
            </div>

            <SideSheet
                isOpen={isSideSheetOpen}
                onClose={() => setIsSideSheetOpen(false)}
                title="Call History"
                size="md"
            >
                {selectedCall && <CallDetails call={selectedCall} />}
            </SideSheet>

            <SideSheet
                isOpen={isNewAgentOpen}
                onClose={() => setIsNewAgentOpen(false)}
                title="Add New Agent"
                size="md"
            >
                <NewAgent
                    onCancel={() => setIsNewAgentOpen(false)}
                    getAllAgents={getAllAgents}
                />
            </SideSheet>

            <SideSheet
                isOpen={isEditAgentOpen}
                onClose={() => setIsEditAgentOpen(false)}
                title="Edit Agent"
                size="md"
            >
                {selectedAgentToEdit && (
                    <EditAgent
                        agent={selectedAgentToEdit}
                        setSelectedAgentToEdit={setSelectedAgentToEdit}
                        onSuccess={() => {
                            // setIsEditAgentOpen(false);
                            getAllAgents();
                        }}
                        onCancel={() => setIsEditAgentOpen(false)}
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
