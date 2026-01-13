import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Users,
    Briefcase,
    UserCheck,
    Activity,
    Search,
    Filter,
    Edit,
    Eye,
    UserPlus,
    Edit2,
} from "lucide-react";
import CreateUser from "@/components/super-admin/voicebot/CreateUser";
import { SideSheet } from "@/components/SideSheet";
import adminCustomerService from "@/api/adminCustomerService";

const dummyCustomers = [
    {
        id: "1",
        username: "josh_tech_24",
        fullName: "Josh Anderson",
        email: "josh@techflow.io",
        company: "TechFlow Systems",
        assignedAgent: "Sarah Miller",
        status: "active",
        plan: "Enterprise",
        joinedDate: "2023-10-12",
    },
    {
        id: "2",
        username: "melissa_ops",
        fullName: "Melissa Chen",
        email: "m.chen@globalreach.com",
        company: "GlobalReach Inc.",
        assignedAgent: "David Wilson",
        status: "active",
        plan: "Professional",
        joinedDate: "2023-11-05",
    },
    {
        id: "3",
        username: "robert_b",
        fullName: "Robert Blackwood",
        email: "robert@blacksun.net",
        company: "BlackSun Agency",
        assignedAgent: "Sarah Miller",
        status: "pending",
        plan: "Starter",
        joinedDate: "2024-01-20",
    },
    {
        id: "4",
        username: "emma_v",
        fullName: "Emma Villarreal",
        email: "emma.v@nexus.co",
        company: "Nexus Solutions",
        assignedAgent: "Michael Rodriquez",
        status: "active",
        plan: "Enterprise",
        joinedDate: "2023-09-15",
    },
    {
        id: "5",
        username: "kevin_hr",
        fullName: "Kevin Wright",
        email: "k.wright@peakhr.org",
        company: "Peak HR Group",
        assignedAgent: "David Wilson",
        status: "inactive",
        plan: "Professional",
        joinedDate: "2023-08-30",
    }
];

function Customers() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const navigate = useNavigate();
    const [usersList, setUsersList] = useState<any>(null);

    const [isCreateUserSheetOpen, setIsCreateUserSheetOpen] = useState(false);


    useEffect(() => {
        try {
            const response = adminCustomerService.getUsersList({});
            console.log('user list', response);

            setUsersList(response);
        } catch (error) {
            console.log(error);
        }
    }, [])


    return (
        <div>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-text-main">Customers</h1>
                        <p className="text-text-muted mt-1">Manage and monitor customer account provisioning</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="btn btn-primary flex items-center gap-1.5"
                            onClick={() => setIsCreateUserSheetOpen(true)}
                        >
                            <UserPlus className="w-3.5 h-3.5" />
                            Create User
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="card rounded-xl p-6 border border-border-subtle hover:shadow-glow hover:-translate-y-0.5 transition-all">
                        <div className="flex justify-between items-start mb-2">
                            <div className="text-sm text-text-muted">Total Clients</div>
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <Briefcase className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-text-main">42</div>
                        <div className="text-xs text-success mt-2 font-medium">Active organizations</div>
                    </div>

                    <div className="card rounded-xl p-6 border border-border-subtle hover:shadow-glow hover:-translate-y-0.5 transition-all">
                        <div className="flex justify-between items-start mb-2">
                            <div className="text-sm text-text-muted">Agents Distributed</div>
                            <div className="p-2 bg-success/10 rounded-lg text-success">
                                <Users className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-text-main">142</div>
                        <div className="text-xs text-success mt-2 font-medium">~3.4 agents per client</div>
                    </div>

                    <div className="card rounded-xl p-6 border border-border-subtle hover:shadow-glow hover:-translate-y-0.5 transition-all">
                        <div className="flex justify-between items-start mb-2">
                            <div className="text-sm text-text-muted">Setup Completion</div>
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <UserCheck className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-text-main">92%</div>
                        <div className="text-xs text-success mt-2 font-medium">Successful password changes</div>
                    </div>

                    <div className="card rounded-xl p-6 border border-border-subtle hover:shadow-glow hover:-translate-y-0.5 transition-all">
                        <div className="flex justify-between items-start mb-2">
                            <div className="text-sm text-text-muted">Avg. Engagement</div>
                            <div className="p-2 bg-warning/10 rounded-lg text-warning">
                                <Activity className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-text-main">74%</div>
                        <div className="text-xs text-text-muted mt-2 font-medium">Daily active agents</div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="card p-4">
                    <div className="flex flex-col sm:flex-row gap-2 mb-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                            <input
                                type="text"
                                placeholder="Search customers..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input pl-8 w-full"
                            />
                        </div>

                        <div className="flex gap-2">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="input min-w-[120px]"
                            >
                                <option value="all">All Statuses</option>
                                <option value="active">Active</option>
                                <option value="pending">Pending</option>
                                <option value="inactive">Inactive</option>
                            </select>

                            <button className="btn btn-secondary flex items-center gap-1.5">
                                <Filter className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Filter</span>
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border-subtle">
                                    <th className="py-4 px-3 text-xs font-semibold text-text-muted tracking-wider text-center">Sr.No.</th>
                                    <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Email</th>
                                    <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Full Name</th>
                                    <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Company</th>
                                    <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Assigned Agent</th>
                                    <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Status</th>
                                    <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-subtle/50">
                                {dummyCustomers.map((user, i) => (
                                    <tr key={user.id} className="hover:bg-bg-alt/30 transition-colors">
                                        <td className="py-4 px-3 text-center text-xs text-text-muted">{i + 1}</td>
                                        <td className="py-4 px-3 text-sm text-text-main font-medium">{user.email}</td>
                                        <td className="py-4 px-3 text-sm text-text-muted">{user.fullName}</td>
                                        <td className="py-4 px-3 text-sm text-text-muted">{user.company}</td>
                                        <td className="py-4 px-3 text-sm text-text-muted">{user.assignedAgent}</td>
                                        <td className="py-4 px-3">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${user.status === 'active' ? 'bg-success/10 text-success' :
                                                user.status === 'pending' ? 'bg-warning/10 text-warning' :
                                                    'bg-bg-alt text-text-muted'
                                                }`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-3 text-sm text-text-muted">
                                            <div className="flex items-center gap-2">
                                                <button className="p-2 hover:bg-primary/10 rounded-lg transition-all cursor-pointer">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => navigate(`/app/super-admin/customers/${user.id}`)}
                                                    className="p-2 hover:bg-primary/10 rounded-lg transition-all cursor-pointer"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {/* Add Lead SideSheet */}
            <SideSheet
                isOpen={isCreateUserSheetOpen}
                onClose={() => setIsCreateUserSheetOpen(false)}
                title="Add New Customer"
                size="md"
            >
                <CreateUser
                    onClose={() => setIsCreateUserSheetOpen(false)}
                    onSuccess={() => { }}
                />
            </SideSheet>
        </div>

    );
}

export default Customers;