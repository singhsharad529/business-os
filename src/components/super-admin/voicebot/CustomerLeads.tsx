import adminCustomerService from "@/api/adminCustomerService";
import Modal from "@/components/common/Modal";
import { SideSheet } from "@/components/SideSheet";
import { LeadDetails } from "@/components/voicebot/LeadDetails";
import { AxiosRequestConfig } from "axios";
import { Calendar, Phone, Star, User, Eye, Search, Filter, Upload, FileSpreadsheet, Trash2, Check } from "lucide-react"
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TableLoader from "@/components/common/TableLoader";
import Pagination from "@/components/common/Pagination";
import AddLead from "@/components/voicebot/AddLead";
import { toast } from "@/hooks/useToast";

function CustomerLeads({ isImportModalOpen, setIsImportModalOpen, isAddLeadSheetOpen, setIsAddLeadSheetOpen }: { isImportModalOpen: boolean, setIsImportModalOpen: (value: boolean) => void, isAddLeadSheetOpen: boolean, setIsAddLeadSheetOpen: (value: boolean) => void }) {
    const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
    const [selectedLeadId, setSelectedLeadId] = useState<string>('');
    const [leaddbfile, setLeaddbfile] = useState<File | null>(null);
    const [userdataLoading, setUserDataLoading] = useState(false);
    const [leads, setLeads] = useState<any[]>([]);
    const [leadsPagination, setLeadsPagination] = useState<any>(null);
    const { id } = useParams();


    const handleImportLeadDatabaseData = async () => {
        if (!leaddbfile) return;
        try {
            setUserDataLoading(true);
            const response = await adminCustomerService.importLeadDatabaseData(id as string, {}, leaddbfile);

            if (response) {
                toast.success("Lead database imported successfully");
                getLeadsData();
                setLeaddbfile(null);
                setIsImportModalOpen(false);
            }
        } catch (error) {
            // console.log(error);
            toast.danger("Failed to import lead database");
        }
        finally {
            setUserDataLoading(false);
        }
    };


    const leadPageSize = 10;
    const getLeadsData = async (page: number = 1, pageSize: number = leadPageSize) => {
        try {
            setUserDataLoading(true);

            const config: AxiosRequestConfig = {
                params: {
                    page,
                    page_size: pageSize
                }
            }
            const response = await adminCustomerService.getLeads(id as string, config);
            if (response.leads) {
                setLeads(response.leads);
            }
            if (response.pagination) {
                setLeadsPagination(response.pagination);
            }
        } catch (error) {
            console.error("Error fetching leads:", error);
        } finally {
            setUserDataLoading(false);
        }
    };

    const handlePageChange = (page: number) => {
        getLeadsData(page);
    };

    useEffect(() => {
        getLeadsData();
    }, []);


    return (
        <div>
            <div className="space-y-6">

                {/* Leads Table Card */}
                {userdataLoading ? (
                    <TableLoader rows={10} columns={8} />
                ) : (
                    <div className="card p-4 border border-border-subtle overflow-hidden">

                        <div className="flex flex-col sm:flex-row gap-2 mb-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                <input
                                    type="text"
                                    placeholder="Search leads..."
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
                                        <th className="py-4 px-3 text-xs font-semibold text-text-muted tracking-wider text-center">Sr.No.</th>
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
                                    {leads.map((lead, i) => (
                                        <tr key={lead.id} className="hover:bg-bg-alt/30 transition-colors">
                                            <td className="py-4 px-3 text-center text-xs text-text-muted">
                                                {(leadsPagination?.page - 1) * (leadsPagination?.pageSize || leadPageSize) + i + 1}
                                            </td>
                                            <td className="py-4 px-3 text-sm text-text-main font-medium">{lead.leadEmail || 'N/A'}</td>
                                            <td className="py-4 px-3 text-sm text-text-muted">{lead.leadName || 'N/A'}</td>
                                            <td className="py-4 px-3 text-sm text-text-muted">{lead.leadCompany || 'N/A'}</td>
                                            <td className="py-4 px-3 text-sm text-text-muted">{lead.leadPhoneNumber || 'N/A'}</td>
                                            <td className="py-4 px-3">
                                                <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-bg-alt text-text-muted">
                                                    {lead.leadExpertiseDomain || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="py-4 px-3 text-sm text-text-muted">
                                                {lead.lastCalledAt ? new Date(lead.lastCalledAt).toLocaleString() : 'N/A'}
                                            </td>
                                            <td className="py-4 px-3 text-sm text-text-muted">
                                                <button className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-all cursor-pointer"
                                                    onClick={() => {
                                                        setSelectedLeadId(lead.id);
                                                        setIsDetailSheetOpen(true);
                                                    }}
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {leads.length === 0 && !userdataLoading && (
                                        <tr>
                                            <td colSpan={8} className="py-8 text-center text-text-muted">
                                                No leads found for this customer.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {leadsPagination && leadsPagination.totalPages > 1 && (
                            <Pagination
                                currentPage={leadsPagination.page}
                                totalPages={leadsPagination.totalPages}
                                pageSize={leadsPagination.pageSize}
                                totalCount={leadsPagination.totalCount}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </div>
                )}
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
                onClose={() => {
                    setIsDetailSheetOpen(false);
                    setSelectedLeadId(selectedLeadId);
                }}
                title="Lead Profile Details"
                size="md"
            >

                <LeadDetails
                    leadId={selectedLeadId}
                    onClose={() => {
                        setIsDetailSheetOpen(false);
                        setSelectedLeadId('');
                    }}
                    onUpdate={() => { getLeadsData(leadsPagination?.page || 1) }}
                    onDelete={() => { getLeadsData(leadsPagination?.page || 1) }}
                />

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
                    onSuccess={() => {
                        setIsAddLeadSheetOpen(false);
                        getLeadsData(leadsPagination?.page || 1);
                    }}
                />
            </SideSheet>
        </div>
    )
}

export default CustomerLeads