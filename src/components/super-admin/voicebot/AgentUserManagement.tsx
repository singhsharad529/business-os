import { useEffect, useState } from "react";
import { Search, UserPlus, UserMinus, Users, CheckCircle2, User, ArrowLeft } from "lucide-react";
import adminCustomerService from "@/api/adminCustomerService";
import { toast } from "@/hooks/useToast";
import { Skeleton } from "@/components/ui/skeleton";

interface User {
    id: string;
    name: string;
    email: string;
    company: string;
    avatar: string;
}

const dummyAllUsers: User[] = [
    { id: "1", name: "Josh Anderson", email: "josh@techflow.io", company: "TechFlow Systems", avatar: "https://i.pravatar.cc/150?u=1" },
    { id: "2", name: "Melissa Chen", email: "m.chen@globalreach.com", company: "GlobalReach Inc.", avatar: "https://i.pravatar.cc/150?u=2" },
    { id: "3", name: "Robert Blackwood", email: "robert@blacksun.net", company: "BlackSun Agency", avatar: "https://i.pravatar.cc/150?u=3" },
    { id: "4", name: "Emma Villarreal", email: "emma.v@nexus.co", company: "Nexus Solutions", avatar: "https://i.pravatar.cc/150?u=4" },
    { id: "5", name: "Kevin Wright", email: "k.wright@peakhr.org", company: "Peak HR Group", avatar: "https://i.pravatar.cc/150?u=5" },
    { id: "6", name: "Sarah Miller", email: "sarah@miller.com", company: "Miller Design", avatar: "https://i.pravatar.cc/150?u=6" },
];

interface AgentUserManagementProps {
    agent: any;
    onClose: () => void;
}

export default function AgentUserManagement({ agent, onClose }: AgentUserManagementProps) {
    const [assignedUsers, setAssignedUsers] = useState<User[]>(dummyAllUsers.slice(0, 2));
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState<"assigned" | "assign">("assigned");
    const [usersLoading, setUsersLoading] = useState<boolean>(false);
    const [users, setUsers] = useState<any>(null);
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [selectedUser, setSelectedUser] = useState<any>(null)

    const availableUsers = users?.filter((u: any) =>
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAssign = (user: User) => {
        setSelectedUser(user);
        setCurrentStep(2);
    };

    const handleUnassign = (userId: string) => {
        setAssignedUsers(assignedUsers.filter(u => u.id !== userId));
    };

    const fetchUsers = async () => {

        try {
            setUsersLoading(true);
            const response = await adminCustomerService.getUsersList({});
            console.log('response', response);
            if (response && response.users) {
                setUsers(response.users);
            }
            // setUsers(response.data);
            console.log(response);

        } catch (error) {
            toast.danger("Failed to load users")
        }
        finally {
            setUsersLoading(false);
        }

    };

    useEffect(() => {
        fetchUsers();
    }, [])


    return (
        <div className="flex flex-col h-full">
            {/* Header / Info */}
            <div className="mb-6 p-4 bg-bg-alt rounded-2xl border border-border-subtle flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                    <Users className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-text-main">{agent?.name}</h3>
                    <p className="text-sm text-text-muted">Assign this agent to users</p>
                </div>
            </div>
            {
                currentStep === 1 && (
                    <div className="space-y-4 px-2 py-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                            <input
                                type="text"
                                placeholder="Search users by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input pl-10 w-full"
                            />
                        </div>

                        <div className="space-y-3">
                            {
                                usersLoading ? (<div className="w-full h-[120px] space-y-4">
                                    {[1, 2, 3, 4, 5, 6].map((item: number) => (
                                        <Skeleton key={item} className="w-full h-[60px] rounded-xl" />
                                    ))}
                                </div>) : (
                                    <>
                                        {availableUsers && availableUsers.length > 0 ? (
                                            availableUsers.map((user: any) => (
                                                <div key={user.id} className="flex items-center justify-between p-3 rounded-xl border border-border-subtle hover:bg-bg-alt/30 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full border border-border-subtle overflow-hidden bg-bg-alt flex items-center justify-center">
                                                            <div className="w-9 h-9 bg-gradient-to-br from-primary-strong via-primary to-accent rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-primary/30 ring-2 ring-white/50">
                                                                {user?.email?.charAt(0).toUpperCase()}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-bold text-text-main">{user.name}</h4>
                                                            <p className="text-xs text-text-muted">{user.email}</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleAssign(user)}
                                                        className="btn btn-secondary py-1.5 px-3 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider"
                                                    >
                                                        <UserPlus className="w-3.5 h-3.5" />
                                                        Select
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="py-12 text-center text-text-muted italic bg-bg-alt/20 rounded-2xl border border-dashed border-border-subtle">
                                                {searchTerm ? "No users found matching your search." : "All available users have been assigned."}
                                            </div>
                                        )}
                                    </>
                                )

                            }
                        </div>
                    </div>
                )
            }
            {
                currentStep === 2 && (
                    <div>
                        <button
                            onClick={() => setCurrentStep(1)}
                            className="flex items-center gap-2 text-xs text-text-muted hover:text-primary transition-colors mb-2"
                        >
                            <ArrowLeft className="w-3 h-3" />
                            Back to Users
                        </button>

                    </div>
                )
            }
        </div>
    );
}
