import { Calendar, Phone, Plus, Star, User, Eye, Search, Filter } from "lucide-react"

const dummyLeads = [
    {
        id: "1",
        leadEmail: "john.doe@example.com",
        leadName: "John Doe",
        leadCompany: "Innovate Inc",
        leadPhoneNumber: "+1 234 567 8901",
        leadExpertiseDomain: "Software Development",
        lastCalledAt: "2024-03-20T10:00:00Z"
    },
    {
        id: "2",
        leadEmail: "jane.smith@designcorp.net",
        leadName: "Jane Smith",
        leadCompany: "DesignCorp",
        leadPhoneNumber: "+1 987 654 3210",
        leadExpertiseDomain: "UI/UX Design",
        lastCalledAt: "2024-03-19T15:30:00Z"
    },
    {
        id: "3",
        leadEmail: "m.wilson@marketinghive.com",
        leadName: "Mike Wilson",
        leadCompany: "Marketing Hive",
        leadPhoneNumber: "+1 555 012 3456",
        leadExpertiseDomain: "Digital Marketing",
        lastCalledAt: null
    },
    {
        id: "4",
        leadEmail: "s.brown@fintechsol.io",
        leadName: "Sarah Brown",
        leadCompany: "FinTech Sol",
        leadPhoneNumber: "+1 444 777 8888",
        leadExpertiseDomain: "Finance",
        lastCalledAt: "2024-03-18T09:15:00Z"
    },
    {
        id: "5",
        leadEmail: "alex.g@techventures.co",
        leadName: "Alex Garcia",
        leadCompany: "Tech Ventures",
        leadPhoneNumber: "+1 222 333 4444",
        leadExpertiseDomain: "Product Management",
        lastCalledAt: "2024-03-21T11:45:00Z"
    }
];

function AllLeads() {


    const currentPage = 1;
    const pageSize = 10;

    return (
        <div className="space-y-6">

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-text-main">Leads Database</h1>
                    <p className="text-text-muted mt-1">Manage your all customer's leads and schedule automated call campaigns</p>
                </div>
                <div className="flex gap-4">
                    <button className="btn btn-primary flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Add Lead
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="card rounded-xl p-6 border border-border-subtle hover:shadow-glow hover:-translate-y-0.5 transition-all">
                    <div className="flex justify-between items-start mb-2">
                        <div className="text-sm text-text-muted">Users</div>
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <User className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-text-main">152</div>
                    <div className="text-xs text-success mt-2 font-medium">+12 this week</div>
                </div>

                <div className="card rounded-xl p-6 border border-border-subtle hover:shadow-glow hover:-translate-y-0.5 transition-all">
                    <div className="flex justify-between items-start mb-2">
                        <div className="text-sm text-text-muted">Called</div>
                        <div className="p-2 bg-success/10 rounded-lg text-success">
                            <Phone className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-text-main">10</div>
                    <div className="text-xs text-success mt-2 font-medium">Outbound attempts</div>
                </div>

                <div className="card rounded-xl p-6 border border-border-subtle hover:shadow-glow hover:-translate-y-0.5 transition-all">
                    <div className="flex justify-between items-start mb-2">
                        <div className="text-sm text-text-muted">This Month</div>
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <Calendar className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-text-main">1.2k</div>
                    <div className="text-xs text-success mt-2 font-medium">Total leads synced</div>
                </div>

                <div className="card rounded-xl p-6 border border-border-subtle hover:shadow-glow hover:-translate-y-0.5 transition-all">
                    <div className="flex justify-between items-start mb-2">
                        <div className="text-sm text-text-muted">New Leads</div>
                        <div className="p-2 bg-warning/10 rounded-lg text-warning">
                            <Star className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-text-main">0</div>
                    <div className="text-xs text-text-muted mt-2 font-medium">Since last 24h</div>
                </div>
            </div>

            {/* Leads Table Card */}
            <div className="card p-4 border border-border-subtle overflow-hidden">

                <div className="flex flex-col sm:flex-row gap-2 mb-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                        <input
                            type="text"
                            placeholder="Search customers..."

                            className="input pl-8 w-full"
                        />
                    </div>

                    <div className="flex gap-2">
                        <select
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
                                <th className="py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Sr.No.</th>
                                <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Email</th>
                                <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Full Name</th>
                                <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Company</th>
                                <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Phone</th>
                                <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Expertise</th>
                                <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Call Time</th>
                                <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-subtle/50">
                            {dummyLeads.map((user, i) => (
                                <tr key={user.id} className="hover:bg-bg-alt/30 transition-colors">
                                    <td className="py-4 px-3 text-center text-xs text-text-muted">{(currentPage - 1) * pageSize + i + 1}</td>
                                    <td className="py-4 px-3 text-sm text-text-main font-medium">{user.leadEmail}</td>
                                    <td className="py-4 px-3 text-sm text-text-muted">{user.leadName}</td>
                                    <td className="py-4 px-3 text-sm text-text-muted">{user.leadCompany}</td>
                                    <td className="py-4 px-3 text-sm text-text-muted">{user.leadPhoneNumber}</td>
                                    <td className="py-4 px-3">
                                        <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-bg-alt text-text-muted">
                                            {user.leadExpertiseDomain}
                                        </span>
                                    </td>
                                    <td className="py-4 px-3 text-sm text-text-muted">
                                        {new Date().toLocaleString()}
                                    </td>
                                    <td className="py-4 px-3 text-sm text-text-muted">
                                        <button className="p-2 hover:bg-primary/10 rounded-lg transition-all cursor-pointer">
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default AllLeads