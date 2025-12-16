import { useMemo, useState } from "react";
import { Search, Filter, RotateCcw, X, Plus } from "lucide-react";
import { mockCalls } from "@/data/mockData";


export default function VoicebotCalls() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sentimentFilter, setSentimentFilter] = useState<string[]>([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const sentiments = ["positive", "neutral", "negative"];
    const statuses = ["completed", "missed", "failed", "ongoing"];

    const statusColors: Record<string, string> = {
        completed: "badge-success",
        missed: "badge-warning",
        failed: "badge-danger",
        ongoing: "badge-info",
    };

    const sentimentColors: Record<string, string> = {
        positive: "badge-success",
        neutral: "badge-secondary",
        negative: "badge-danger",
    };

    const filteredCalls = useMemo(() => {
        return mockCalls.filter((call) => {
            const matchesSearch =
                call.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                call.customerMobile.includes(searchTerm) ||
                call.sessionId.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus =
                statusFilter === "all" || call.status === statusFilter;

            const matchesSentiment =
                sentimentFilter.length === 0 ||
                sentimentFilter.includes(call.sentiment);

            return matchesSearch && matchesStatus && matchesSentiment;
        });
    }, [searchTerm, statusFilter, sentimentFilter]);

    return (

        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-text-main">Call History</h1>
                    <p className="text-text-muted mt-1">View and analyze all your AI agent calls</p>
                </div>
                <div>
                    <button
                        // onClick={() => setShowCreateSheet(true)}
                        className="btn btn-primary flex items-center gap-1.5"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        New Call
                    </button>
                </div>
            </div>
            <div className="card p-4">
                {/* Search & Filters */}
                <div className="flex flex-col sm:flex-row gap-2 mb-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                        <input
                            type="text"
                            placeholder="Search calls..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input pl-8 w-full"
                        />
                    </div>

                    <div className="flex gap-2 relative">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="input min-w-[120px]"
                        >
                            <option value="all">All Statuses</option>
                            {statuses.map((s) => (
                                <option key={s} value={s} className="capitalize">
                                    {s}
                                </option>
                            ))}
                        </select>

                        <button
                            className="btn btn-secondary flex items-center gap-1.5"
                            onClick={() => setIsFilterOpen((v) => !v)}
                        >
                            <Filter className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Filter</span>
                        </button>

                        {isFilterOpen && (
                            <div className="absolute right-0 top-10 z-10 w-64 rounded-md border border-border bg-white shadow-lg p-3 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold text-text-main">
                                        Sentiment
                                    </span>
                                    <div className="flex items-center gap-1.5">
                                        <button
                                            className="p-1 rounded hover:bg-bg"
                                            onClick={() => setSentimentFilter([])}
                                        >
                                            <RotateCcw className="w-3.5 h-3.5 text-primary" />
                                        </button>
                                        <button
                                            className="p-1 rounded hover:bg-bg"
                                            onClick={() => setIsFilterOpen(false)}
                                        >
                                            <X className="w-3.5 h-3.5 text-text-muted" />
                                        </button>
                                    </div>
                                </div>

                                {sentiments.map((s) => {
                                    const checked = sentimentFilter.includes(s);
                                    return (
                                        <label
                                            key={s}
                                            className="flex items-center gap-2 text-xs"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={checked}
                                                onChange={() =>
                                                    setSentimentFilter((prev) =>
                                                        checked
                                                            ? prev.filter((x) => x !== s)
                                                            : [...prev, s]
                                                    )
                                                }
                                            />
                                            <span className="capitalize">{s}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Table */}
                {filteredCalls.length === 0 ? (
                    <div className="text-center py-12 text-text-muted text-xs">
                        No calls found
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-bg">
                                    <th className="text-left py-2 px-3 text-xs font-semibold">Customer</th>
                                    <th className="text-left py-2 px-3 text-xs font-semibold">Status</th>
                                    <th className="text-left py-2 px-3 text-xs font-semibold">Sentiment</th>
                                    <th className="text-left py-2 px-3 text-xs font-semibold">Intent</th>
                                    <th className="text-left py-2 px-3 text-xs font-semibold">Duration</th>
                                    <th className="text-left py-2 px-3 text-xs font-semibold">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCalls.map((call) => (
                                    <tr
                                        key={call.id}
                                        className="hover:bg-bg transition-colors cursor-pointer"
                                    >
                                        <td className="py-2.5 px-3">
                                            <div className="text-xs font-medium">
                                                {call.customerName}
                                            </div>
                                            <div className="text-[10px] text-text-muted">
                                                {call.customerMobile}
                                            </div>
                                        </td>

                                        <td className="py-2.5 px-3">
                                            <span className={`badge ${statusColors[call.status]}`}>
                                                {call.status}
                                            </span>
                                        </td>

                                        <td className="py-2.5 px-3">
                                            <span className={`badge ${sentimentColors[call.sentiment]}`}>
                                                {call.sentiment}
                                            </span>
                                        </td>

                                        <td className="py-2.5 px-3 text-xs">
                                            {call.intent}
                                        </td>

                                        <td className="py-2.5 px-3 text-xs">
                                            {Math.floor(call.duration / 60)}m {call.duration % 60}s
                                        </td>

                                        <td className="py-2.5 px-3 text-xs text-text-muted">
                                            {new Date(call.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
