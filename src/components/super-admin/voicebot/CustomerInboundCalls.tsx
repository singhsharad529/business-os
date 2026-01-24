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
import { useParams } from "react-router-dom";

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

const dummyInboundCalls: InboundCall[] = [
    {
        id: "1",
        dateTime: "2024-03-12 10:30 AM",
        client: "TechFlow Systems",
        callerNumber: "+1 (555) 012-3456",
        agent: "AI Sarah",
        status: "Completed",
        duration: "2m 45s",
        outcome: "Qualified",
    },
    {
        id: "2",
        dateTime: "2024-03-12 11:15 AM",
        client: "GlobalReach Inc.",
        callerNumber: "+1 (555) 987-6543",
        agent: "AI David",
        status: "Completed",
        duration: "5m 12s",
        outcome: "Lead",
    },
    {
        id: "3",
        dateTime: "2024-03-12 01:20 PM",
        client: "BlackSun Agency",
        callerNumber: "+1 (555) 456-7890",
        agent: "AI Sarah",
        status: "Missed",
        duration: "0m 00s",
        outcome: "Callback",
    },
    {
        id: "4",
        dateTime: "2024-03-12 02:45 PM",
        client: "Nexus Solutions",
        callerNumber: "+1 (555) 222-3333",
        agent: "AI Michael",
        status: "Completed",
        duration: "1m 30s",
        outcome: "Not Interested",
    },
    {
        id: "5",
        dateTime: "2024-03-12 04:10 PM",
        client: "Peak HR Group",
        callerNumber: "+1 (555) 555-4444",
        agent: "AI David",
        status: "Completed",
        duration: "3m 55s",
        outcome: "Qualified",
    }
];

const dummyCallDetail = {
    id: "1",
    type: "inboundPhoneCall",
    status: "completed",
    customerNumber: "+1 (555) 012-3456",
    phoneNumber: "+1 (555) 888-9999",
    startedAt: "2024-03-12T10:30:00Z",
    endedAt: "2024-03-12T10:32:45Z",
    totalCost: "0.45",
    summary: "The caller was interested in the Enterprise plan and asked about security certifications. They are qualified as a hot lead and requested a follow-up email with the SOC2 report.",
    messages: [
        { role: 'assistant', message: 'Hello! Thank you for calling TechFlow Systems. How can I help you today?', secondsFromStart: 0.5 },
        { role: 'user', message: 'Hi, I saw your enterprise plan and I wanted to know more about it.', secondsFromStart: 4.2 },
        { role: 'assistant', message: 'I would be happy to explain our Enterprise features. It includes unlimited agents, custom integrations, and 24/7 priority support. Do you have any specific requirements in mind?', secondsFromStart: 10.1 },
        { role: 'user', message: 'Yes, we are a financial firm so security is priority. Do you have SOC2 compliance?', secondsFromStart: 18.5 },
        { role: 'assistant', message: 'Absolutely. We are SOC2 Type II compliant and can provide our latest audit report. Would you like me to send that to your email?', secondsFromStart: 25.3 },
        { role: 'user', message: 'That would be great. Please send it to test@example.com.', secondsFromStart: 32.8 },
        { role: 'assistant', message: 'Perfect, I have noted that down. A member of our security team will reach out shortly with the documents. Is there anything else?', secondsFromStart: 40.2 },
        { role: 'user', message: 'No, that is all. Thank you!', secondsFromStart: 45.1 },
    ],
    recordings: {
        stereo: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    }
};

function CustomerInboundCalls() {
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

    const { id } = useParams();



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
                    userId: id
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
                                                    className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-all cursor-pointer"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}

                                </tbody>

                            </table>
                            {filteredInboundCalls && filteredInboundCalls.length === 0 && (
                                <div className="flex items-center justify-center py-12 text-center text-text-muted italic w-full">
                                    No inbound calls found.
                                </div>
                            )}
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

export default CustomerInboundCalls;
