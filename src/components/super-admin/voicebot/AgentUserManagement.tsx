import { useEffect, useState } from "react";
import { Search, UserPlus, UserMinus, Users, CheckCircle2, User, ArrowLeft, Phone } from "lucide-react";
import adminCustomerService from "@/api/adminCustomerService";
import { toast } from "@/hooks/useToast";
import { Skeleton } from "@/components/ui/skeleton";
import adminAgentService from "@/api/adminAgentService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AxiosRequestConfig } from "axios";
import Pagination from "@/components/common/Pagination";

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
    const [phoneNumbersLoading, setPhoneNumbersLoading] = useState<boolean>(false);
    const [users, setUsers] = useState<any>(null);
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [phoneNumbers, setPhoneNumbers] = useState<any>(null);
    const [selectedPhoneNumber, setSelectedPhoneNumber] = useState<any>(null);
    const [usersPagination, setUsersPagination] = useState<any>(null);

    const availableUsers = users?.filter((u: any) =>
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) || u.name.toLowerCase().includes(searchTerm.toLowerCase())
    );


    const fetchPhoneNumbers = async () => {
        try {
            setPhoneNumbersLoading(true);
            const response = await adminAgentService.getAllPhoneNumbers({});
            // console.log('response', response);
            if (response && response.phoneNumbers) {
                setPhoneNumbers(response.phoneNumbers);
                if (response.phoneNumbers.length > 0) {
                    setSelectedPhoneNumber(response.phoneNumbers[0].vapiId);
                }
            }
        } catch (error) {
            toast.danger("Failed to load phone numbers")
        }
        finally {
            setPhoneNumbersLoading(false);
        }
    };

    const handleAssign = (user: User) => {
        setSelectedUser(user);
        setCurrentStep(2);
        fetchPhoneNumbers();
    };


    const [assignLoading, setAssignLoading] = useState<boolean>(false);

    const confirmAssignment = async () => {
        if (!selectedUser || !selectedPhoneNumber) {
            toast.danger("Please select both a user and a phone number");
            return;
        }
        // console.log("agent", agent);
        // console.log("selectedUser", selectedUser);
        // console.log("selectedPhoneNumber", selectedPhoneNumber);


        try {
            setAssignLoading(true);
            const payload = {
                assistantId: agent.vapiId,
                userId: selectedUser.id,
                phoneNumberId: selectedPhoneNumber
            };

            await adminAgentService.assignAssistantToUser(payload, {});
            toast.success("Agent assigned successfully");
            // onClose();
            setCurrentStep(1);
        } catch (error) {
            console.error("Assignment error:", error);
            toast.danger("Failed to assign agent");
        } finally {
            setAssignLoading(false);
        }
    };

    const usersPageSize = 10;
    const fetchUsers = async (page: number = 1, pageSize: number = usersPageSize) => {

        try {
            setUsersLoading(true);
            const config: AxiosRequestConfig = {
                params: {
                    page,
                    page_size: pageSize
                }
            }
            const response = await adminCustomerService.getUsersList(config);
            console.log('response', response);
            if (response && response.users) {
                setUsers(response.users);
            }
            if (response && response.pagination) {
                setUsersPagination(response.pagination);
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

    const handleUsersPagination = (page: number) => {
        fetchUsers(page);
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

                                        {usersPagination && (
                                            <Pagination
                                                currentPage={usersPagination.page}
                                                totalPages={usersPagination.totalPages}
                                                pageSize={usersPagination.pageSize}
                                                totalCount={usersPagination.total}
                                                onPageChange={handleUsersPagination}
                                            />
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
                            className="flex items-center gap-2 text-xs text-text-muted hover:text-primary transition-colors mb-4"
                        >
                            <ArrowLeft className="w-3 h-3" />
                            Back to Users
                        </button>

                        <div className="grid grid-cols-1 gap-3">
                            <h4 className="text-sm font-bold text-text-main flex items-center gap-2">
                                <Phone className="w-4 h-4 text-primary" />
                                Select Number
                            </h4>
                            {
                                phoneNumbersLoading ? (
                                    <div className="flex items-center w-full">
                                        <Skeleton className="w-4 h-8 animate-spin w-full" />
                                    </div>
                                ) : (
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
                                                        {number.number}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <div className="p-2 text-xs text-center text-text-muted">
                                                    No unassigned numbers available
                                                </div>
                                            )}
                                        </SelectContent>
                                    </Select>
                                )
                            }
                        </div>

                        <div className="mt-8">
                            <button
                                onClick={confirmAssignment}
                                disabled={assignLoading || !selectedPhoneNumber}
                                className="btn btn-primary w-full py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {assignLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <CheckCircle2 className="w-5 h-5" />
                                )}
                                {assignLoading ? "Processing..." : "Assign"}
                            </button>
                            <p className="text-[10px] text-center text-text-muted mt-3 px-4">
                                This will link <b>{agent?.name}</b> to <b>{selectedUser?.email}</b> using the selected phone number.
                            </p>
                        </div>

                    </div>
                )
            }
        </div>
    );
}
