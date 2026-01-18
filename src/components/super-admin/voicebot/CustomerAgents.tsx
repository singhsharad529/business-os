import { SetStateAction, useEffect, useState } from "react";
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
    UserX,
    Loader2
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { SideSheet } from "@/components/SideSheet";
import EditAdminAgent from "./EditAdminAgent";
import CustomerAssignAgent from "./CustomerAssignAgent";
import adminCustomerService from "@/api/adminCustomerService";
import { AxiosRequestConfig } from "axios";
import CardsLoader from "@/components/common/CardsLoader";
import { useParams } from "react-router-dom";
import adminAgentService from "@/api/adminAgentService";
import { toast } from "@/hooks/useToast";
import { AlertDialog } from "@/components/ui/AlertDialog";




function CustomerAgents({
    isAddAgentSheetOpen,
    setIsAddAgentSheetOpen,
    userid
}: {
    isAddAgentSheetOpen: boolean;
    setIsAddAgentSheetOpen: React.Dispatch<SetStateAction<boolean>>;
    userid: string;
}) {
    const [agents, setAgents] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
    const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState<any>(null);
    const [agentLoader, setAgentLoader] = useState(false);
    const [unAssignLoader, setUnassignLoader] = useState(false);
    const [agentToUnassign, setAgentToUnassign] = useState<any>(null);
    const [agentToDelete, setAgentToDelete] = useState<any>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

    const handleEditAgent = (agent: any) => {
        setSelectedAgent(agent);
        setIsEditSheetOpen(true);
    };

    const { id } = useParams()




    const handleStatusChange = async (agentId: string) => {
        // Logic will be added later by the user
        // status will be 'active' or 'inactive'
        // console.log(`Status change for agent ${agentId}`);

        let isTogglled = false;

        try {

            const tempAgents = [...agents];
            const agentIndex = tempAgents.findIndex((agent: any) => agent.vapiId === agentId);
            if (agentIndex === -1) {
                toast.danger("Agent not found");
                return;
            }
            tempAgents[agentIndex].status = tempAgents[agentIndex].status === true ? false : true;
            setAgents(tempAgents);

            isTogglled = true;

            const response = await adminCustomerService.updateAgentStatus({
                assistantId: agentId,
                isActive: tempAgents[agentIndex].status === true ? true : false
            }, {});
            console.log(response);
            toast.success("Agent status updated successfully");
            fetchAgents();

            // setAgents(response);
        } catch (error) {
            // console.log(error);
            toast.danger("Failed to update agent status");
            if (isTogglled) {

                const tempAgents = [...agents];
                const agentIndex = tempAgents.findIndex((agent: any) => agent.vapiId === agentId);

                tempAgents[agentIndex].status = tempAgents[agentIndex].status === true ? false : true;
                setAgents(tempAgents);

            }
        } finally {

        }
    };


    const filteredAgentsInCategory = agents?.filter((agent: any) =>
    (agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.metadata.department.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const agentPageSize: number = 10;
    const fetchAgents = async (page: number = 1, pageSize: number = agentPageSize) => {
        try {
            setAgentLoader(true);
            const config: AxiosRequestConfig = {
                params: {
                    page,
                    page_size: pageSize
                }
            }
            const response = await adminCustomerService.getCustomerAgents(userid, config);
            // setAgents(response.data);
            if (response.assistants) {
                setAgents(response.assistants);
            }
        } catch (error) {
            console.error("Error fetching agents:", error);
        }
        finally {
            setAgentLoader(false);

        }
    };

    useEffect(() => {
        fetchAgents();
    }, []);


    const unAssignUser = async (assistant: any) => {
        try {

            setUnassignLoader(true);
            const payload: any = {
                assistantId: assistant.vapiId,
                userId: id,
            }
            setAgentToUnassign(assistant);

            const response = await adminAgentService.unassignAssistantToUser(payload);
            if (response) {
                toast.success("Agent unassigned successfully")
            }

            fetchAgents();

        } catch (error) {
            toast.danger("Failed to unassign agent")
        }
        finally {
            setUnassignLoader(false)
        }

    }


    const confirmDeleteAgent = async () => {
        if (!agentToDelete) return;

        try {
            setDeleteLoading(true);
            await adminAgentService.deleteAssistant(agentToDelete.vapiId, {});
            toast.success("Agent deleted successfully");
            await fetchAgents(); // Reload the list
            setIsDeleteAlertOpen(false);
            setAgentToDelete(null);
        } catch (error) {
            // console.error(error);
            toast.danger("Failed to delete agent");
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <div>
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
                    agentLoader ? (<CardsLoader />) :
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
                                                    <span className={`text-[10px] font-bold uppercase tracking-wider ${agent.status === true ? 'text-success' : 'text-text-muted'}`}>
                                                        {agent.status == true ? "Active" : "Inactive"}
                                                    </span>
                                                    <Switch
                                                        checked={agent.status === true}
                                                        onCheckedChange={() => handleStatusChange(agent.vapiId)}
                                                    />
                                                    <button className="btn btn-error btn-sm bg-danger/20 text-danger text-xs border border-danger/20 py-1.5 px-3" title="Unassign"
                                                        onClick={() => unAssignUser(agent)}
                                                    >
                                                        {unAssignLoader && agentToUnassign?.vapiId === agent.vapiId ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserX className="w-4 h-4" />}
                                                    </button>
                                                    {/* <button className="btn btn-secondary text-xs"
                                                        onClick={() => handleTestCall(agent)}
                                                    >
                                                        <Phone className="w-4 h-4" />
                                                        Test
                                                    </button> */}
                                                </div>
                                            </div>

                                            <h3 className="text-lg font-bold text-text-main mb-1 truncate group-hover:text-primary transition-colors">
                                                {agent.configurationLabel || agent.name}
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
                                                {/* <button className="btn btn-secondary flex items-center justify-center py-1.5 px-3 border-border-subtle hover:text-primary" title="Duplicate">
                                                    <Copy className="w-3.5 h-3.5" />
                                                </button> */}
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

            <SideSheet
                isOpen={isEditSheetOpen}
                onClose={() => setIsEditSheetOpen(false)}
                title="Edit AI Agent"
                size="md"
            >
                {selectedAgent && (
                    <EditAdminAgent
                        agent={selectedAgent}
                        onClose={() => {
                            setIsEditSheetOpen(false);

                        }}

                        onSuccess={() => {
                            fetchAgents();
                        }}
                    />
                )}
            </SideSheet>


            <SideSheet
                isOpen={isAddAgentSheetOpen}
                onClose={() => setIsAddAgentSheetOpen(false)}
                title="Assign AI Agent"
                size="md"
            >

                <CustomerAssignAgent
                    onClose={() => setIsAddAgentSheetOpen(false)}
                    onSuccess={() => {
                        setIsAddAgentSheetOpen(false);
                        fetchAgents();
                    }}
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

export default CustomerAgents;