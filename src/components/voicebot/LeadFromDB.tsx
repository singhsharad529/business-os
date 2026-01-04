import { useState, useEffect, useMemo } from "react"
import { Search, Loader2, Check, Mail, Briefcase } from "lucide-react"
import voiceBotService from "@/api/voicebotService"
import { toast } from "@/hooks/useToast"
import { Lead } from "@/types/voicebotTypes"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import Pagination from "../common/Pagination"

interface LeadFromDbProps {
    onClose: () => void;
    onSuccess?: () => void;
    alreadySelectedIds?: string[];
}

function LeadFromDb({ onClose, onSuccess }: LeadFromDbProps) {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [pagination, setPagination] = useState<any>(null);
    const [leadSearchText, setLeadSearchText] = useState("");
    const [leadColumnFilter, setLeadColumnFilter] = useState("all");
    const [leadsLoading, setLeadsLoading] = useState(true);
    const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    const defaultPageSize = 10;

    const filteredLeads = useMemo(() => {
        return leads.filter((lead: any) => {
            const searchLower = leadSearchText.toLowerCase();
            if (leadColumnFilter === "all") {
                return (
                    lead.leadName.toLowerCase().includes(searchLower) ||
                    lead.leadEmail.toLowerCase().includes(searchLower) ||
                    lead.leadCompany.toLowerCase().includes(searchLower)
                );
            }
            if (leadColumnFilter === "name") return lead.leadName.toLowerCase().includes(searchLower);
            if (leadColumnFilter === "email") return lead.leadEmail.toLowerCase().includes(searchLower);
            if (leadColumnFilter === "company") return lead.leadCompany.toLowerCase().includes(searchLower);
            return true;
        });
    }, [leads, leadSearchText, leadColumnFilter]);


    const fetchLeads = async (page: number = 1, pageSize: number = defaultPageSize) => {
        try {
            setLeadsLoading(true);
            const response = await voiceBotService.getLeadDatabaseData({ page, page_size: pageSize }, {});
            // Handle different API response structures
            const leadsData = response.leads || [];
            console.log('leadsData', leadsData);
            setPagination(response.pagination);
            setLeads(leadsData);
        } catch (error) {
            console.error("Failed to fetch leads:", error);
            toast.danger("Failed to load lead database");
        } finally {
            setLeadsLoading(false);
        }
    };

    const handleSelectLead = (id: string) => {
        setSelectedLeads(prev =>
            prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
        );
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        fetchLeads(page, defaultPageSize);
    };
    useEffect(() => {
        fetchLeads();
    }, []);


    return (
        <div className="flex flex-col h-full space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Search Bar */}
            <div className="space-y-6 px-2 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-text-main tracking-tight">Select Target Leads</h3>
                            <p className="text-[10px] text-text-muted mt-0.5">Pick existing leads from your database</p>
                        </div>
                        <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{selectedLeads.length} selected</span>
                    </div>

                    <div className="flex flex-col md:flex-row gap-2">
                        <div className="relative w-[50%]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                            <input
                                type="text"
                                placeholder="Search leads..."
                                className="w-full pl-10 pr-4 py-2 bg-bg border border-border-subtle rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                value={leadSearchText}
                                onChange={(e) => setLeadSearchText(e.target.value)}
                            />
                        </div>
                        <div className="w-[50%]">
                            <Select
                                value={leadColumnFilter}
                                onValueChange={(value) => setLeadColumnFilter(value)}

                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a column" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Fields</SelectItem>
                                    <SelectItem value="name">Name</SelectItem>
                                    <SelectItem value="email">Email</SelectItem>
                                    <SelectItem value="company">Company</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
                        {leadsLoading ? (
                            <div className="space-y-3">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="h-16 bg-bg animate-pulse rounded-2xl border border-border-subtle" />
                                ))}
                            </div>
                        ) : filteredLeads.length > 0 ? filteredLeads.map((user: any) => (
                            <div
                                key={user.id}
                                onClick={() => handleSelectLead(user.id)}
                                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${selectedLeads.includes(user.leadEmail)
                                    ? 'border-primary bg-primary/5 ring-1 ring-primary/20 shadow-sm'
                                    : 'border-border-subtle hover:border-text-muted/30 bg-white'
                                    }`}
                            >
                                <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${selectedLeads.includes(user.id) ? 'bg-primary border-primary rotate-0' : 'border-border-subtle rotate-45'
                                    }`}>
                                    {selectedLeads.includes(user.id) && <Check className="w-3.5 h-3.5 text-white" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-xs font-bold text-text-main truncate">{user.leadName}</div>
                                    <div className="text-[10px] text-text-muted truncate flex items-center gap-2 mt-0.5">
                                        <span>{user.leadEmail}</span>
                                        <span className="w-1 h-1 bg-text-muted/30 rounded-full" />
                                        <span>{user.leadCompany}</span>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="py-20 text-center bg-bg/30 rounded-3xl border border-dashed border-border-subtle">
                                <Search className="w-10 h-10 text-text-muted mx-auto mb-2 opacity-20" />
                                <p className="text-xs text-text-muted">No leads found matching your search</p>
                            </div>
                        )}
                    </div>

                    {pagination && (
                        <Pagination
                            currentPage={pagination?.page}
                            totalPages={pagination?.totalPages}
                            pageSize={pagination?.pageSize}
                            totalCount={pagination?.totalCount}
                            onPageChange={handlePageChange}
                        />
                    )}
                </div>
            </div>


            <div className="flex items-center gap-3 pt-6 mt-6 border-t border-border-subtle">

                <button
                    onClick={onClose}
                    className="flex-1 px-4 py-3 rounded-xl border border-border-subtle text-xs font-bold text-text-muted hover:bg-bg transition-all active:scale-95"
                >
                    Cancel
                </button>

                <button
                    onClick={onSuccess}
                    className="flex-[2] btn btn-primary py-3 rounded-xl text-xs font-bold shadow-glow-sm flex items-center justify-center gap-2 group transition-all"
                >
                    Add Leads
                </button>
            </div>

        </div>
    )
}

export default LeadFromDb