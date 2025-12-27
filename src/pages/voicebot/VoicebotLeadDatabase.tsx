import { useState, useMemo, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Phone, User, BarChart, Activity, Mail, XCircle, Calendar, Database, Download, Upload, Plus, Search, ChevronRight, Check, X, Clock, Zap } from "lucide-react"
import { mockCallSessions, mockAnalyses, mockVoicebotActions } from "@/data/mockData"
import { mockAgents } from "@/data/agentMockData"
import { SideSheet } from "@/components/SideSheet"
import type { Agent } from "@/types"
import { useData } from "@/contexts/DataContext"
import voiceBotService from "@/api/voicebotService"
import TableLoader from "@/components/common/TableLoader"
import Pagination from "@/components/common/Pagination"
import { LeadDatabaseResponse } from "@/types/voicebotTypes";
import sampleFile from "@/assets/files/leads_data_sample.xlsx";
import { toast } from "@/hooks/useToast"
import Modal from "@/components/common/Modal"
import { FileSpreadsheet, Trash2 } from "lucide-react"

function VoicebotLeadDatabase() {
    const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
    const [isCampaignSheetOpen, setIsCampaignSheetOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
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
    const [showColumnToggle, setShowColumnToggle] = useState(false);

    // Campaign Data State
    const [campaignName, setCampaignName] = useState("");
    const [selectedAgent, setSelectedAgent] = useState("");
    const [scheduleType, setScheduleType] = useState("immediate");
    const [concurrency, setConcurrency] = useState(5);
    const { leadDatabaseData, setLeadDatabaseData } = useData();
    const [userdataLoading, setUserDataLoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [callsPage, setCallsPage] = useState(1);
    const [analysesPage, setAnalysesPage] = useState(1);
    const [actionsPage, setActionsPage] = useState(1);
    const [leaddbfile, setLeaddbfile] = useState<File | null>(null);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);

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

    const handleSelectLead = (email: string) => {
        setSelectedLeads(prev =>
            prev.includes(email) ? prev.filter(e => e !== email) : [...prev, email]
        );
    };

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const resetCampaign = () => {
        setIsCampaignSheetOpen(false);
        setCurrentStep(1);
        setCampaignName("");
        setSelectedAgent("");
        setSelectedLeads([]);
    };

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
                        <button
                            onClick={() => setIsCampaignSheetOpen(true)}
                            className="btn btn-primary flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Create Campaign
                        </button>
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
                            <div className="text-3xl font-bold text-text-main">568</div>
                            <div className="text-xs text-text-muted mt-2">Call Sessions</div>
                        </div>
                        <div className="text-sm mb-2"><Phone className="w-6 h-6 text-primary opacity-80" /></div>
                    </div>
                    <div className="card flex items-center justify-between rounded-xl p-6 border border-border-subtle hover:shadow-glow hover:-translate-y-0.5 transition-all">
                        <div>
                            <div className="text-3xl font-bold text-text-main">234</div>
                            <div className="text-xs text-text-muted mt-2">Analysis</div>
                        </div>
                        <div className="text-sm mb-2"><BarChart className="w-6 h-6 text-primary opacity-80" /></div>
                    </div>

                    <div className="card flex items-center justify-between rounded-xl p-6 border border-border-subtle hover:shadow-glow hover:-translate-y-0.5 transition-all">
                        <div>
                            <div className="text-3xl font-bold text-text-main">400</div>
                            <div className="text-xs text-text-muted mt-2">Actions</div>
                        </div>
                        <div className="text-sm mb-2">  <Activity className="w-6 h-6 text-primary opacity-80" /></div>
                    </div>
                </div>

                <div className="card rounded-xl p-6 border border-border-subtle hover:shadow-glow transition-all" >
                    <Tabs defaultValue="users" className="w-full">
                        <TabsList className="bg-primary-soft/50 p-1 mb-2">
                            <TabsTrigger value="users" className="px-6">Users ({pagination?.totalCount || filteredUsers.length})</TabsTrigger>
                            <TabsTrigger value="calls" className="px-6">Call Sessions ({mockCallSessions.length})</TabsTrigger>
                            <TabsTrigger value="analyses" className="px-6">Analyses ({mockAnalyses.length})</TabsTrigger>
                            <TabsTrigger value="actions" className="px-6">Actions ({mockVoicebotActions.length})</TabsTrigger>
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
                                                            {visibleColumns.lastCalled && <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Last Called</th>}
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-border-subtle/50">
                                                        {filteredUsers.map((user, i) => (
                                                            <tr key={user.id} className={`hover:bg-bg-alt/30 transition-colors ${selectedLeads.includes(user.leadEmail) ? 'bg-primary-soft/10' : ''}`}>
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
                                                                {visibleColumns.lastCalled && <td className="py-4 px-3 text-sm text-text-muted">
                                                                    {user.lastCalledAt ? new Date(user.lastCalledAt).toLocaleString() : 'Never'}
                                                                </td>}
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

                        <TabsContent value="analyses">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-border-subtle">
                                            <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Session ID</th>
                                            <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Sentiment</th>
                                            <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Extracted Email</th>
                                            <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Extracted Name</th>
                                            <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Intent</th>
                                            <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Follow-up</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border-subtle/50">
                                        {mockAnalyses.slice((analysesPage - 1) * pageSize, analysesPage * pageSize).map((analysis, i) => (
                                            <tr key={i} className="hover:bg-bg-alt/30 transition-colors">
                                                <td className="py-4 px-3 text-sm font-mono text-primary">{analysis.sessionId}</td>
                                                <td className="py-4 px-3">
                                                    <span className={`badge ${analysis.sentiment === 'Positive' ? 'badge-success' : 'badge-danger'}`}>
                                                        {analysis.sentiment}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-3 text-sm text-text-main">{analysis.extractedEmail}</td>
                                                <td className="py-4 px-3 text-sm text-text-muted">{analysis.extractedName}</td>
                                                <td className="py-4 px-3 text-sm text-text-muted">{analysis.intent}</td>
                                                <td className="py-4 px-3">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${analysis.followUp === 'Yes' ? 'bg-success/20 text-success' : 'bg-bg-alt text-text-muted'}`}>
                                                        {analysis.followUp}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <Pagination
                                currentPage={analysesPage}
                                totalPages={Math.ceil(mockAnalyses.length / pageSize)}
                                pageSize={pageSize}
                                totalCount={mockAnalyses.length}
                                onPageChange={setAnalysesPage}
                            />
                        </TabsContent>

                        <TabsContent value="actions">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-border-subtle">
                                            <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Analysis ID</th>
                                            <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Tool Used</th>
                                            <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Status</th>
                                            <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Timestamp</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border-subtle/50">
                                        {mockVoicebotActions.slice((actionsPage - 1) * pageSize, actionsPage * pageSize).map((action, i) => (
                                            <tr key={i} className="hover:bg-bg-alt/30 transition-colors">
                                                <td className="py-4 px-3 text-sm font-mono text-primary">{action.analysisId}</td>
                                                <td className="py-4 px-3">
                                                    <div className="flex items-center gap-2">
                                                        {action.toolUsed === 'send_email' && <Mail className="w-3.5 h-3.5" />}
                                                        {action.toolUsed === 'update_crm' && <Database className="w-3.5 h-3.5" />}
                                                        {action.toolUsed === 'create_calendar_event' && <Calendar className="w-3.5 h-3.5" />}
                                                        <span className="text-sm text-text-main">{action.toolUsed}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-3">
                                                    <span className={`badge ${action.status === 'Success' ? 'badge-success' : 'badge-danger'}`}>
                                                        {action.status}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-3 text-sm text-text-muted">{action.timestamp}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <Pagination
                                currentPage={actionsPage}
                                totalPages={Math.ceil(mockVoicebotActions.length / pageSize)}
                                pageSize={pageSize}
                                totalCount={mockVoicebotActions.length}
                                onPageChange={setActionsPage}
                            />
                        </TabsContent>
                    </Tabs>
                </div>


            </div>
            {/* Campaign Creation SideSheet */}
            <SideSheet
                isOpen={isCampaignSheetOpen}
                onClose={() => setIsCampaignSheetOpen(false)}
                title="Create New Campaign"
                size="md"
            >
                <div className="flex flex-col h-full">
                    {/* Stepper */}
                    <div className="flex items-center justify-between mb-8 relative">
                        {[1, 2, 3, 4].map((step) => (
                            <div key={step} className="flex flex-col items-center z-10">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${currentStep === step ? 'bg-primary text-white scale-110 shadow-glow' :
                                    currentStep > step ? 'bg-success text-white' : 'bg-bg-alt text-text-muted'
                                    }`}>
                                    {currentStep > step ? <Check className="w-4 h-4" /> : step}
                                </div>
                                <span className="text-[10px] mt-2 font-bold uppercase tracking-wider text-text-muted text-center">
                                    {step === 1 ? 'Leads' : step === 2 ? 'Details' : step === 3 ? 'Settings' : 'Review'}
                                </span>
                            </div>
                        ))}
                        <div className="absolute top-4 left-0 right-0 h-0.5 bg-bg-alt -z-0">
                            <div
                                className="h-full bg-primary transition-all duration-300"
                                style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {currentStep === 1 && (
                            <div className="space-y-6 px-2 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-semibold text-text-main">Select Target Leads</label>
                                        <span className="text-[10px] font-bold text-primary bg-primary-soft/30 px-2 py-0.5 rounded-full">{selectedLeads.length} selected</span>
                                    </div>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                        <input
                                            type="text"
                                            placeholder="Search leads..."
                                            className="w-full pl-10 pr-4 py-2 bg-bg-alt/50 border border-border-subtle rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
                                        {filteredUsers.map((user) => (
                                            <div
                                                key={user.leadEmail}
                                                onClick={() => handleSelectLead(user.leadEmail)}
                                                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${selectedLeads.includes(user.leadEmail) ? 'border-primary bg-primary-soft/10 ring-1 ring-primary/20 shadow-sm' : 'border-border-subtle bg-bg-alt/30 hover:border-border-main'
                                                    }`}
                                            >
                                                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedLeads.includes(user.leadEmail) ? 'bg-primary border-primary' : 'border-border-subtle'
                                                    }`}>
                                                    {selectedLeads.includes(user.leadEmail) && <Check className="w-3 h-3 text-white" />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-bold text-text-main truncate">{user.leadName}</div>
                                                    <div className="text-[10px] text-text-muted truncate">{user.leadEmail} • {user.leadCompany}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="space-y-6 px-2 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-text-main">Campaign Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Q4 Sales Outreach"
                                        className="w-full px-4 py-3 bg-bg-alt/50 border border-border-subtle rounded-xl text-sm focus:ring-1 focus:ring-primary focus:outline-none placeholder:text-text-muted/50"
                                        value={campaignName}
                                        onChange={(e) => setCampaignName(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-sm font-semibold text-text-main">Select AI Agent</label>
                                    <div className="grid grid-cols-1 gap-3">
                                        {mockAgents.map((agent) => (
                                            <div
                                                key={agent.id}
                                                onClick={() => setSelectedAgent(agent.id)}
                                                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${selectedAgent === agent.id ? 'border-primary bg-primary-soft/10 shadow-glow ring-1 ring-primary/30' : 'border-border-subtle bg-bg-alt/30 hover:border-border-main hover:bg-bg-alt/50'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${selectedAgent === agent.id ? 'bg-primary text-white' : 'bg-primary/10 text-primary group-hover:bg-primary/20'
                                                        }`}>
                                                        <User className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-text-main">{agent.configuration}</div>
                                                        <div className="flex flex-wrap gap-x-2 gap-y-1 mt-1">
                                                            <span className="text-[10px] text-text-muted bg-bg-alt px-1.5 py-0.5 rounded uppercase font-bold tracking-tight">{agent.industry}</span>
                                                            <span className="text-[10px] text-text-muted bg-bg-alt px-1.5 py-0.5 rounded uppercase font-bold tracking-tight">{agent.language}</span>
                                                            <span className="text-[10px] text-text-muted bg-bg-alt px-1.5 py-0.5 rounded uppercase font-bold tracking-tight">{agent.region}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                {selectedAgent === agent.id && (
                                                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg animate-in zoom-in">
                                                        <Check className="w-4 h-4 text-white" />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className="space-y-6 px-2 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="space-y-4">
                                    <label className="text-sm font-semibold text-text-main">Call Schedule</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => setScheduleType("immediate")}
                                            className={`p-4 rounded-xl border text-center transition-all ${scheduleType === "immediate" ? 'border-primary bg-primary-soft/10 ring-1 ring-primary' : 'border-border-subtle bg-bg-alt/30'
                                                }`}
                                        >
                                            <Zap className={`w-5 h-5 mx-auto mb-2 ${scheduleType === "immediate" ? 'text-primary' : 'text-text-muted'}`} />
                                            <div className="text-xs font-bold text-text-main">Immediate</div>
                                            <div className="text-[10px] text-text-muted">Start now</div>
                                        </button>
                                        <button
                                            onClick={() => setScheduleType("scheduled")}
                                            className={`p-4 rounded-xl border text-center transition-all ${scheduleType === "scheduled" ? 'border-primary bg-primary-soft/10 ring-1 ring-primary' : 'border-border-subtle bg-bg-alt/30'
                                                }`}
                                        >
                                            <Clock className={`w-5 h-5 mx-auto mb-2 ${scheduleType === "scheduled" ? 'text-primary' : 'text-text-muted'}`} />
                                            <div className="text-xs font-bold text-text-main">Scheduled</div>
                                            <div className="text-[10px] text-text-muted">Pick a time</div>
                                        </button>
                                    </div>
                                </div>

                                {scheduleType === "scheduled" && (
                                    <div className="animate-in fade-in zoom-in-95 duration-200">
                                        <input
                                            type="datetime-local"
                                            className="w-full px-4 py-3 bg-bg-alt/50 border border-border-subtle rounded-xl text-sm focus:ring-1 focus:ring-primary focus:outline-none"
                                        />
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-semibold text-text-main">Max Simultaneous Calls</label>
                                        <span className="text-primary font-bold text-sm">{concurrency}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="1"
                                        max="50"
                                        value={concurrency}
                                        onChange={(e) => setConcurrency(parseInt(e.target.value))}
                                        className="w-full h-1.5 bg-primary-soft rounded-lg appearance-none cursor-pointer accent-primary"
                                    />
                                    <div className="flex justify-between text-[10px] text-text-muted font-bold uppercase tracking-tighter">
                                        <span>Conservative</span>
                                        <span>Aggressive</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 4 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="card-gradient rounded-2xl p-6 overflow-hidden relative">
                                    <div className="relative z-10">
                                        <div className="text-[10px] font-bold uppercase opacity-80 mb-1">Final Review</div>
                                        <div className="text-2xl font-bold">{campaignName || "Untitled Campaign"}</div>
                                        <div className="flex items-center gap-4 mt-4">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] opacity-70">Target Leads</span>
                                                <span className="text-lg font-bold">{selectedLeads.length}</span>
                                            </div>
                                            <div className="w-px h-8 bg-white/20" />
                                            <div className="flex flex-col">
                                                <span className="text-[10px] opacity-70">Agent</span>
                                                <span className="text-lg font-bold">{mockAgents.find(a => a.id === selectedAgent)?.configuration || "None"}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-4 bg-bg-alt/30 rounded-xl border border-border-subtle">
                                        <div className="flex items-center gap-3">
                                            <Calendar className="w-4 h-4 text-text-muted" />
                                            <span className="text-sm text-text-main">Schedule</span>
                                        </div>
                                        <span className="text-sm font-bold text-text-main capitalize">{scheduleType}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-bg-alt/30 rounded-xl border border-border-subtle">
                                        <div className="flex items-center gap-3">
                                            <Zap className="w-4 h-4 text-text-muted" />
                                            <span className="text-sm text-text-main">Power Mode</span>
                                        </div>
                                        <span className="text-sm font-bold text-text-main">{concurrency} Concurrent</span>
                                    </div>
                                </div>

                                {selectedLeads.length === 0 && (
                                    <div className="p-4 rounded-xl bg-danger/10 border border-danger/20 flex items-start gap-3">
                                        <XCircle className="w-5 h-5 text-danger mt-0.5" />
                                        <div>
                                            <div className="text-sm font-bold text-danger">No Leads Selected</div>
                                            <div className="text-xs text-text-muted">Please go back to step 1 and select at least one lead.</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-3 pt-6 mt-6 border-t border-border-subtle">
                        {currentStep > 1 && (
                            <button
                                onClick={prevStep}
                                className="flex-1 px-4 py-3 rounded-xl border border-border-subtle text-sm font-bold text-text-main hover:bg-bg-alt transition-colors"
                            >
                                Back
                            </button>
                        )}
                        <button
                            disabled={
                                (currentStep === 1 && selectedLeads.length === 0) ||
                                (currentStep === 2 && (!campaignName || !selectedAgent))
                            }
                            onClick={() => {
                                if (currentStep === 4) {
                                    alert("Campaign launched successfully!");
                                    resetCampaign();
                                } else {
                                    nextStep();
                                }
                            }}
                            className="flex-[2] btn btn-primary py-3 rounded-xl flex items-center justify-center gap-2"
                        >
                            {currentStep === 4 ? 'Launch Campaign' : 'Next Step'}
                            {currentStep !== 4 && <ChevronRight className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
            </SideSheet>

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
        </div>
    )
}

export default VoicebotLeadDatabase
