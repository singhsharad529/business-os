import { useEffect, useState } from "react";
import {
    Search,
    Filter,
    Eye,
    Download,
} from "lucide-react";
import { SideSheet } from "@/components/SideSheet";
import { CallDetails } from "@/components/voicebot/CallDetails";
import adminAgentService from "@/api/adminAgentService";
import { AxiosRequestConfig } from "axios";
import { toast } from "@/hooks/useToast";
import TableLoader from "@/components/common/TableLoader";
import Pagination from "@/components/common/Pagination";

interface InboundCall {
    id: string;
    dateTime: string;
    client: string;
    callerNumber: string;
    agent: string;
    status: string;
    duration: string;
    outcome: "Lead" | "Qualified" | "Callback" | "Not Interested";
}



function Inbound() {
    const [searchTerm, setSearchTerm] = useState("");
    const [outcomeFilter, setOutcomeFilter] = useState("all");
    const [isCallDetailSheetOpen, setIsCallDetailSheetOpen] = useState(false);
    const [selectedCallForDetail, setSelectedCallForDetail] = useState<any>(null);
    const [inboundCalls, setInboundCalls] = useState<any>(null);
    const [pagination, setPagination] = useState<any>(null);

    // loading stats
    const [loading, setLoading] = useState(false);

    const handleViewDetails = (call: any) => {
        setSelectedCallForDetail(call);
        setIsCallDetailSheetOpen(true);
    };



    const filteredInboundCalls = inboundCalls?.filter((call: any) => {
        if (!searchTerm) {
            return inboundCalls;
        }
        return call?.customerNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const inboundPageSize: number = 10;
    const fetchAllInboundCalls = async (page: number = 1, pageSize: number = inboundPageSize) => {
        try {
            setLoading(true);
            const config: AxiosRequestConfig = {
                params: {
                    page: page,
                    page_size: pageSize,
                    isTestCall: false
                }
            }

            const response = await adminAgentService.getAllInboundCalls(config);
            console.log('response', response);
            setInboundCalls(response.calls);
            if (response.pagination) {
                setPagination(response.pagination);
            }


        } catch (error) {
            toast.danger("Failed to fetch inbound calls")
        }
        finally {
            setLoading(false);
        }
    }

    const handlePageChange = (page: number) => {
        fetchAllInboundCalls(page);
    };


    useEffect(() => {
        fetchAllInboundCalls();
    }, [])


    return (
        <>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-text-main flex items-center gap-3">
                            Inbound Calls
                        </h1>
                        <p className="text-text-muted mt-1">View inbound calls across all clients</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="btn btn-primary flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            Export CSV
                        </button>
                    </div>
                </div>


                {loading ? (
                    <TableLoader rows={10} columns={8} />
                ) : (
                    <div className="card p-4">
                        <div className="flex flex-col sm:flex-row gap-2 mb-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                <input
                                    type="text"
                                    placeholder="Search by number or assistant..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="input pl-8 w-full"
                                />
                            </div>

                            <div className="flex gap-2">
                                <select
                                    value={outcomeFilter}
                                    onChange={(e) => setOutcomeFilter(e.target.value)}
                                    className="input min-w-[120px]"
                                >
                                    <option value="all">All Outcomes</option>
                                    <option value="Qualified">Qualified</option>
                                    <option value="Lead">Lead</option>
                                    <option value="Callback">Callback</option>
                                    <option value="Not Interested">Not Interested</option>
                                </select>

                                {/* <button className="btn btn-secondary flex items-center gap-1.5">
                                    <Filter className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">Filter</span>
                                </button> */}
                            </div>
                        </div>



                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border-subtle">
                                        <th className="py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Sr.No.</th>
                                        <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Customer Number</th>
                                        <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Assistant</th>
                                        <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Status</th>
                                        <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Duration</th>
                                        <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Cost</th>
                                        <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Call Time</th>
                                        <th className="text-left py-4 px-3 text-xs font-semibold text-text-muted tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border-subtle/50">
                                    {filteredInboundCalls && filteredInboundCalls?.map((call: any, i: number) => (
                                        <tr key={call.id} className="hover:bg-bg-alt/30 transition-colors">
                                            <td className="py-4 px-3 text-center text-xs text-text-muted">
                                                {(pagination?.page - 1) * (pagination?.pageSize || inboundPageSize) + i + 1}
                                            </td>
                                            <td className="py-4 px-3 text-sm text-text-main font-medium">{call.customerNumber}</td>
                                            <td className="py-4 px-3 text-sm text-text-muted">{call.assistantName || 'N/A'}</td>
                                            <td className="py-4 px-3">
                                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${call.status?.includes('ended') || call.status === 'completed' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                                                    }`}>
                                                    {call.status?.split('-').join(' ')}
                                                </span>
                                            </td>
                                            <td className="py-4 px-3 text-sm text-text-muted">
                                                {call.durationMinutes ? `${call.durationMinutes.toFixed(2)}m` : call.durationSeconds ? `${call.durationSeconds}s` : '0s'}
                                            </td>
                                            <td className="py-4 px-3 text-sm text-text-muted">${call.cost?.total?.toFixed(3) || '0.000'}</td>
                                            <td className="py-4 px-3 text-sm text-text-muted">
                                                {call.createdAt ? new Date(call.createdAt).toLocaleString() : 'N/A'}
                                            </td>
                                            <td className="py-4 px-3 text-sm text-text-muted">
                                                <button
                                                    onClick={() => handleViewDetails(call)}
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
                                totalCount={pagination.total}
                                onPageChange={handlePageChange}
                            />
                        )}


                    </div>
                )
                }


            </div>

            {/* Call Details SideSheet */}
            <SideSheet
                isOpen={isCallDetailSheetOpen}
                onClose={() => setIsCallDetailSheetOpen(false)}
                title="Call Details"
                size="md"
            >
                {selectedCallForDetail && <CallDetails call={selectedCallForDetail} />}
            </SideSheet>
        </>
    );
}

export default Inbound;
