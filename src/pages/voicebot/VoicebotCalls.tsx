import { useMemo, useState } from "react";
import { Search, Filter, RotateCcw, X, Plus, BotMessageSquare, Phone, Globe, Languages, Briefcase, MoveLeft } from "lucide-react";
import { mockCalls } from "@/data/mockData";
import { SideSheet } from "@/components/SideSheet";
import { CallDetails } from "@/components/voicebot/CallDetails";
import { mockAgents } from "@/data/agentMockData";
import NewAgent from "@/components/voicebot/NewAgent";

export default function VoicebotCalls() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sentimentFilter, setSentimentFilter] = useState<string[]>([]);
    const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
    const [selectedCall, setSelectedCall] = useState<any>(null);
    const [isSideSheetOpen, setIsSideSheetOpen] = useState<boolean>(false);
    const [isOpenedCalls, setIsOpenedCalls] = useState<boolean>(false);
    const [isNewAgentOpen, setIsNewAgentOpen] = useState<boolean>(false);
    const [selectedAgentToEdit, setSelectedAgentToEdit] = useState<any>(null);
    const [isEditAgentOpen, setIsEditAgentOpen] = useState<boolean>(false);

    const sentiments = ["positive", "neutral", "negative"];
    const statuses = ["completed", "missed", "failed", "ongoing"];

    const statusColors: Record<string, string> = {
        completed: "badge-success",
        missed: "badge-warning",
        failed: "badge-danger",
        ongoing: "badge-primary",
    };

    const sentimentColors: Record<string, string> = {
        positive: "badge-success",
        neutral: "",
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
        <div>
            <div className="space-y-6 my-2">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-text-main">Agents & Calls History</h1>
                        <p className="text-text-muted mt-1">View and analyze all your AI agents & calls</p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setIsNewAgentOpen(true)}
                            className="btn btn-primary flex items-center gap-1.5"
                        >
                            <BotMessageSquare className="w-3.5 h-3.5" />
                            Create Agent
                        </button>
                        <button
                            className="btn btn-primary flex items-center gap-1.5"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            New Call
                        </button>
                    </div>
                </div>

                {!isOpenedCalls && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {mockAgents.map((agent) => (
                            <div className="card p-5 group hover:shadow-glow transition-all duration-300" key={agent.id}>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2.5 bg-primary-soft rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                        <BotMessageSquare className="w-5 h-5" />
                                    </div>
                                    <span className="badge badge-primary">Active</span>
                                </div>

                                <h3 className="text-lg font-bold text-text-main mb-1 truncate">{agent.configuration}</h3>
                                <div className="flex items-center gap-2 text-text-muted mb-4 text-xs">
                                    <Briefcase className="w-3 h-3" />
                                    <span>{agent.industry}</span>
                                </div>

                                <div className="space-y-2.5 mb-6">
                                    <div className="flex items-center gap-2 text-text-main">
                                        <Languages className="w-3.5 h-3.5 text-text-muted" />
                                        <span className="text-xs">{agent.language}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-text-main">
                                        <Globe className="w-3.5 h-3.5 text-text-muted" />
                                        <span className="text-xs">{agent.region}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-text-main font-medium">
                                        <Phone className="w-3.5 h-3.5 text-primary" />
                                        <span className="text-xs">{agent.mobileNumber}</span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        className="btn btn-primary flex-1 py-1.5 text-xs"
                                        onClick={() => {
                                            setSelectedAgentToEdit(agent);
                                            setIsEditAgentOpen(true);
                                        }}
                                    >
                                        Edit Agent
                                    </button>
                                    <button
                                        className="btn btn-secondary flex items-center gap-1.5 py-1.5 text-xs px-3"
                                        onClick={() => setIsOpenedCalls(true)}
                                    >
                                        <Phone className="w-3 h-3" />
                                        Calls
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {isOpenedCalls && (
                    <div className="card p-4">
                        <div className="flex flex-col sm:flex-row gap-2 mb-4">
                            <button
                                className="btn btn-secondary bg-primary-soft text-primary flex items-center gap-1.5 py-1.5 text-xs px-3 border-primary"
                                onClick={() => setIsOpenedCalls(false)}
                            >
                                <MoveLeft className="w-3 h-3" />
                                Agents
                            </button>
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
                                                onClick={() => {
                                                    setSelectedCall(call);
                                                    setIsSideSheetOpen(true);
                                                }}
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
                )}
            </div>

            <SideSheet
                isOpen={isSideSheetOpen}
                onClose={() => setIsSideSheetOpen(false)}
                title="Call Details"
                size="md"
            >
                {selectedCall && <CallDetails call={selectedCall} />}
            </SideSheet>

            <SideSheet
                isOpen={isNewAgentOpen}
                onClose={() => setIsNewAgentOpen(false)}
                title="Agent Configuration"
                size="md"
            >
                <NewAgent onSuccess={() => setIsNewAgentOpen(false)}
                    onCancel={() => setIsNewAgentOpen(false)}
                />
            </SideSheet>

            <SideSheet
                isOpen={isEditAgentOpen}
                onClose={() => setIsEditAgentOpen(false)}
                title="Edit Agent"
                size="md"
            >
                {selectedAgentToEdit && (
                    <NewAgent
                        agent={selectedAgentToEdit}
                        onSuccess={() => setIsEditAgentOpen(false)}
                        onCancel={() => setIsEditAgentOpen(false)}
                    />
                )}
            </SideSheet>
        </div>
    );
}
