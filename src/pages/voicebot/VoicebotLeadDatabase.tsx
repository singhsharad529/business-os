import { useState, useMemo, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Phone, User, BarChart, Activity, Mail, XCircle, Calendar, Database, Download, Upload, Plus, Search, ChevronRight, Check, X, Clock, Zap, Eye, FileSpreadsheet, Trash2, Star } from "lucide-react"
import { mockCallSessions, mockAnalyses, mockVoicebotActions } from "@/data/mockData"
import { mockAgents } from "@/data/agentMockData"
import { SideSheet } from "@/components/SideSheet"
import type { Agent } from "@/types"
import { useData } from "@/contexts/DataContext"
import voiceBotService from "@/api/voicebotService"
import TableLoader from "@/components/common/TableLoader"
import Pagination from "@/components/common/Pagination"
import { LeadDatabaseResponse, Lead } from "@/types/voicebotTypes";
import sampleFile from "@/assets/files/leads_data_sample.xlsx";
import { toast } from "@/hooks/useToast"
import Modal from "@/components/common/Modal"
import { LeadDetails } from "@/components/voicebot/LeadDetails"
import AddLead from "@/components/voicebot/AddLead"

function VoicebotLeadDatabase() {
    const [searchQuery, setSearchQuery] = useState("");

    // Column Visibility State
    const [visibleColumns, setVisibleColumns] = useState({
        email: true,
        name: true,
        company: true,
        phone: true,
        expertise: true,
        lastCalled: true
    });
    const { leadDatabaseData, setLeadDatabaseData } = useData();
    const [userdataLoading, setUserDataLoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [callsPage, setCallsPage] = useState(1);
    const [analysesPage, setAnalysesPage] = useState(1);
    const [actionsPage, setActionsPage] = useState(1);
    const [leaddbfile, setLeaddbfile] = useState<File | null>(null);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);

    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

    const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
    const [isAddLeadSheetOpen, setIsAddLeadSheetOpen] = useState(false);


    const pageSize = 10;

    const leads = (leadDatabaseData as LeadDatabaseResponse)?.leads || [];
    const pagination = (leadDatabaseData as LeadDatabaseResponse)?.pagination;

    const filteredUsers = useMemo(() => {
        return leads.filter(user =>
            user.leadName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.leadEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.leadCompany.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [leads, searchQuery]);

    const getSampleFile = () => {
        const link = document.createElement("a");
        link.href = sampleFile;
        link.download = "business_os_sample.xlsx"; // file name shown to user
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getLeadDatabaseData = async (page: number, size: number) => {

        try {
            setUserDataLoading(true);
            const response = await voiceBotService.getLeadDatabaseData({
                page: page,
                page_size: size
            }, {});
            setLeadDatabaseData(response);
        } catch (error) {
            console.log(error);
        }
        finally {
            setUserDataLoading(false);
        }

    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        getLeadDatabaseData(page, pageSize);
    };

    const handleImportLeadDatabaseData = async () => {
        if (!leaddbfile) return;
        try {
            setUserDataLoading(true);
            const response = await voiceBotService.importLeadDatabaseData({}, leaddbfile);

            if (response) {
                toast.success("Lead database imported successfully");
                getLeadDatabaseData(currentPage, pageSize);
                setLeaddbfile(null);
                setIsImportModalOpen(false);
            }
        } catch (error) {
            console.log(error);
            toast.danger("Failed to import lead database");
        }
        finally {
            setUserDataLoading(false);
        }
    };



    useEffect(() => {
        getLeadDatabaseData(currentPage, pageSize);
    }, [])


    return (
        <div>
            <div className="space-y-6 my-2">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-text-main">Leads Database</h1>
                        <p className="text-text-muted mt-1">Manage your leads and schedule automated call campaigns</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="btn btn-secondary flex items-center gap-2"
                            onClick={getSampleFile}
                        >
                            <Download className="w-4 h-4" />
                            Sample CSV</button>
                        <button className="btn btn-secondary flex items-center gap-2"
                            onClick={() => setIsImportModalOpen(true)}
                        >
                            <Upload className="w-4 h-4" />
                            Import Leads</button>
                        <button className="btn btn-primary flex items-center gap-2"
                            onClick={() => setIsAddLeadSheetOpen(true)}
                        >
                            <Plus className="w-4 h-4" />
                            Add Lead</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="card flex items-center justify-between rounded-xl p-6 border border-border-subtle hover:shadow-glow hover:-translate-y-0.5 transition-all">
                        <div>
                            <div className="text-3xl font-bold text-text-main">152</div>
                            <div className="text-xs text-text-muted mt-2">Users</div>
                        </div>
                        <div className="text-sm mb-2"><User className="w-6 h-6 text-primary opacity-80" /></div>

                    </div>
                    <div className="card flex items-center justify-between rounded-xl p-6 border border-border-subtle hover:shadow-glow hover:-translate-y-0.5 transition-all">
                        <div>
                            <div className="text-3xl font-bold text-text-main">10</div>
                            <div className="text-xs text-text-muted mt-2">Called</div>
                        </div>
                        <div className="text-sm mb-2"><Phone className="w-6 h-6 text-primary opacity-80" /></div>
                    </div>

                    <div className="card flex items-center justify-between rounded-xl p-6 border border-border-subtle hover:shadow-glow hover:-translate-y-0.5 transition-all">
                        <div>
                            <div className="text-3xl font-bold text-text-main">0</div>
                            <div className="text-xs text-text-muted mt-2">This Month</div>
                        </div>
                        <div className="text-sm mb-2"><Calendar className="w-6 h-6 text-primary opacity-80" /></div>
                    </div>

                    <div className="card flex items-center justify-between rounded-xl p-6 border border-border-subtle hover:shadow-glow hover:-translate-y-0.5 transition-all">
                        <div>
                            <div className="text-3xl font-bold text-text-main">0</div>
                            <div className="text-xs text-text-muted mt-2">New Leads</div>
                        </div>
                        <div className="text-sm mb-2"><Star className="w-6 h-6 text-primary opacity-80" /></div>
                    </div>

                </div>

                <div className="card rounded-xl p-6 border border-border-subtle hover:shadow-glow transition-all" >
                    <Tabs defaultValue="users" className="w-full">
                        <TabsList className="bg-primary-soft/50 p-1 mb-2">
                            <TabsTrigger value="users" className="px-6">Users ({pagination?.totalCount || filteredUsers.length})</TabsTrigger>
                            <TabsTrigger value="calls" className="px-6">Call Sessions ({mockCallSessions.length})</TabsTrigger>
                        </TabsList>

                        <TabsContent value="users">
                            {
                                userdataLoading ? (
                                    <TableLoader rows={5} columns={8} />
                                ) :
                                    (
                                        <>
                                            <div className="overflow-x-auto">
                                                <table className="w-full">
                                                    <thead>
                                                        <tr className="border-b border-border-subtle">
                                                            <th className="py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Sr.No.</th>
                                                            {visibleColumns.email && <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Email</th>}
                                                            {visibleColumns.name && <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Full Name</th>}
                                                            {visibleColumns.company && <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Company</th>}
                                                            {visibleColumns.phone && <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Phone</th>}
                                                            {visibleColumns.expertise && <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Expertise</th>}
                                                            {<th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Call Time</th>}
                                                            {/* {visibleColumns.lastCalled && <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Last Called</th>} */}
                                                            <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Actions</th>

                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-border-subtle/50">
                                                        {leads.map((user, i) => (
                                                            <tr key={user.id} className={`hover:bg-bg-alt/30 transition-colors`}>
                                                                <td className="py-4 px-3 text-center text-xs text-text-muted">{(currentPage - 1) * pageSize + i + 1}</td>
                                                                {visibleColumns.email && <td className="py-4 px-3 text-sm text-text-main font-medium">{user.leadEmail}</td>}
                                                                {visibleColumns.name && <td className="py-4 px-3 text-sm text-text-muted">{user.leadName}</td>}
                                                                {visibleColumns.company && <td className="py-4 px-3 text-sm text-text-muted">{user.leadCompany}</td>}
                                                                {visibleColumns.phone && <td className="py-4 px-3 text-sm text-text-muted">{user.leadPhoneNumber}</td>}
                                                                {visibleColumns.expertise && (
                                                                    <td className="py-4 px-3">
                                                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-bg-alt text-text-muted`}>
                                                                            {user.leadExpertiseDomain}
                                                                        </span>
                                                                    </td>
                                                                )}
                                                                {<td className="py-4 px-3 text-sm text-text-muted">
                                                                    {new Date().toLocaleString()}
                                                                </td>}
                                                                {/* {visibleColumns.lastCalled && <td className="py-4 px-3 text-sm text-text-muted">
                                                                    {user.lastCalledAt ? new Date(user.lastCalledAt).toLocaleString() : 'Never'}
                                                                </td>} */}
                                                                <td className="py-4 px-3 text-sm text-text-muted">
                                                                    <button
                                                                        onClick={() => {
                                                                            setSelectedLead(user);
                                                                            setIsDetailSheetOpen(true);
                                                                        }}
                                                                        className="p-2 hover:bg-primary/10 rounded-lg transition-all cursor-pointer"
                                                                    >
                                                                        <Eye className="w-4 h-4" />
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                            {pagination && (
                                                <Pagination
                                                    currentPage={pagination.page}
                                                    totalPages={pagination.totalPages}
                                                    pageSize={pagination.pageSize}
                                                    totalCount={pagination.totalCount}
                                                    onPageChange={handlePageChange}
                                                />
                                            )}
                                        </>
                                    )
                            }
                        </TabsContent>

                        <TabsContent value="calls">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-border-subtle">
                                            <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Session ID</th>
                                            <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Customer Phone</th>
                                            <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Status</th>
                                            <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Duration</th>
                                            <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Start Time</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border-subtle/50">
                                        {mockCallSessions.slice((callsPage - 1) * pageSize, callsPage * pageSize).map((session, i) => (
                                            <tr key={i} className="hover:bg-bg-alt/30 transition-colors">
                                                <td className="py-4 px-3 text-sm font-mono text-primary">{session.sessionId}</td>
                                                <td className="py-4 px-3 text-sm text-text-main">{session.customerPhone}</td>
                                                <td className="py-4 px-3">
                                                    <span className={`badge ${session.status === 'Completed' ? 'badge-success' : 'badge-danger'}`}>
                                                        {session.status}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-3 text-sm text-text-muted">{session.duration}</td>
                                                <td className="py-4 px-3 text-sm text-text-muted">{session.startTime}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <Pagination
                                currentPage={callsPage}
                                totalPages={Math.ceil(mockCallSessions.length / pageSize)}
                                pageSize={pageSize}
                                totalCount={mockCallSessions.length}
                                onPageChange={setCallsPage}
                            />
                        </TabsContent>
                    </Tabs>
                </div>

            </div>

            {/* Import Leads Modal */}
            <Modal
                isOpen={isImportModalOpen}
                onClose={() => {
                    setIsImportModalOpen(false);
                    setLeaddbfile(null);
                }}
                title="Import Lead Database"
                size="md"
            >
                <div className="space-y-6">
                    {!leaddbfile ? (
                        <div className="flex flex-col items-center justify-center border-2 border-dashed border-border-subtle rounded-2xl p-10 bg-bg-alt/20 hover:bg-bg-alt/40 transition-all group cursor-pointer relative">
                            <input
                                type="file"
                                accept=".xlsx, .xls, .csv"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        setLeaddbfile(e.target.files[0]);
                                    }
                                }}
                            />
                            <div className="w-12 h-12 bg-primary-soft rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform mb-4">
                                <Upload className="w-6 h-6" />
                            </div>
                            <div className="text-sm font-bold text-text-main">Click to upload or drag & drop</div>
                            <div className="text-xs text-text-muted mt-1">Excel or CSV files (max. 10MB)</div>
                        </div>
                    ) : (
                        <div className="bg-bg-alt/30 rounded-2xl p-4 border border-border-subtle flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2">
                            <div className="w-12 h-12 bg-success-soft rounded-xl flex items-center justify-center text-success">
                                <FileSpreadsheet className="w-6 h-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-bold text-text-main truncate">{leaddbfile.name}</div>
                                <div className="text-xs text-text-muted">{(leaddbfile.size / 1024 / 1024).toFixed(2)} MB</div>
                            </div>
                            <button
                                onClick={() => setLeaddbfile(null)}
                                className="w-8 h-8 rounded-full hover:bg-danger-soft hover:text-danger flex items-center justify-center transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => {
                                setIsImportModalOpen(false);
                                setLeaddbfile(null);
                            }}
                            className="flex-1 px-4 py-3 rounded-xl border border-border-subtle text-sm font-bold text-text-main hover:bg-bg-alt transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={!leaddbfile || userdataLoading}
                            onClick={handleImportLeadDatabaseData}
                            className="flex-[2] btn btn-primary py-3 rounded-xl flex items-center justify-center gap-2"
                        >
                            {userdataLoading ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Check className="w-4 h-4" />
                            )}
                            {userdataLoading ? 'Importing...' : 'Confirm Import'}
                        </button>
                    </div>

                    <div className="p-4 rounded-xl bg-primary-soft/10 border border-primary-soft/20">
                        <div className="flex gap-3 text-xs text-text-muted leading-relaxed">
                            <div className="text-primary mt-0.5">•</div>
                            <div>Ensure your file follows the structure of our sample template for successful import.</div>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Lead Details SideSheet */}
            <SideSheet
                isOpen={isDetailSheetOpen}
                onClose={() => setIsDetailSheetOpen(false)}
                title="Lead Profile Details"
                size="md"
            >
                {selectedLead && (
                    <LeadDetails
                        leadId={selectedLead.id}
                        onClose={() => setIsDetailSheetOpen(false)}
                        onUpdate={() => getLeadDatabaseData(currentPage, pageSize)}
                        onDelete={() => getLeadDatabaseData(currentPage, pageSize)}
                    />
                )}
            </SideSheet>

            {/* Add Lead SideSheet */}
            <SideSheet
                isOpen={isAddLeadSheetOpen}
                onClose={() => setIsAddLeadSheetOpen(false)}
                title="Add New Lead"
                size="md"
            >
                <AddLead
                    onClose={() => setIsAddLeadSheetOpen(false)}
                    onSuccess={() => getLeadDatabaseData(currentPage, pageSize)}
                />
            </SideSheet>
        </div >
    )
}

export default VoicebotLeadDatabase
