import { useState } from "react"
import { MessageSquare, Calendar, ChevronRight, ArrowLeft, FileText, Download, Clock, Hash } from "lucide-react"

interface FeedbackData {
    id: string;
    subject: string;
    description: string;
    createdAt: string;
    files: string[];
    priority: "low" | "medium" | "high";
}

const dummyFeedbacks: FeedbackData[] = [
    {
        id: "FB-001",
        subject: "UI/UX Improvement Suggestion",
        description: "The dashboard layout could be more intuitive. Adding more white space between cards would help. Also, the contrast on search bars is a bit low for accessibility. I've attached some design suggestions.",
        createdAt: "2024-03-20T10:30:00Z",
        files: ["design_suggestions.pdf", "dashboard_refactor.png"],
        priority: "medium"
    },
    {
        id: "FB-002",
        subject: "Problem with Voice Bot Speed",
        description: "The voice bot is responding too slowly in some calls. We need to optimize the latency specifically for international routes. This is critical for our expansion.",
        createdAt: "2024-03-19T14:20:00Z",
        files: ["latency_report_international.xlsx"],
        priority: "high"
    },
    {
        id: "FB-003",
        subject: "Feature Request: Export Analytics",
        description: "It would be great if we could export the analytics data to CSV or PDF directly from the dashboard. Currently we have to take screenshots.",
        createdAt: "2024-03-18T09:15:00Z",
        files: [],
        priority: "low"
    },
    {
        id: "FB-004",
        subject: "Mobile Responsive Issue",
        description: "The agent configuration screen is not working well on mobile devices. The buttons are overlapping. Steps to reproduce: open config on iPhone 13.",
        createdAt: "2024-03-17T16:45:00Z",
        files: ["mobile_screenshot.jpg"],
        priority: "medium"
    }
]

function CustomerFeedbacks({ onClose }: { onClose: () => void }) {
    const [selectedFeedback, setSelectedFeedback] = useState<FeedbackData | null>(null);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "high": return "badge-danger";
            case "medium": return "badge-warning";
            case "low": return "badge-primary";
            default: return "badge";
        }
    };

    if (selectedFeedback) {
        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                {/* Detail View Header */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setSelectedFeedback(null)}
                        className="p-2.5 hover:bg-bg-alt rounded-xl transition-all border border-border-subtle shadow-sm active:scale-95"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-text-main">Feedback Details</h2>
                        <div className="flex items-center gap-3 mt-1">
                            <div className="flex items-center gap-1 text-[10px] text-text-muted font-medium uppercase tracking-wider">
                                <Hash className="w-3 h-3" />
                                {selectedFeedback.id}
                            </div>
                            <span className={`badge ${getPriorityColor(selectedFeedback.priority)} text-[9px] py-0.5 px-2`}>
                                {selectedFeedback.priority}
                            </span>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center justify-end gap-1.5 text-text-muted">
                            <Clock className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-medium">{formatDate(selectedFeedback.createdAt)}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Content Section */}
                    <div className="card p-6 space-y-6 bg-gradient-to-br from-white to-bg-alt/30">
                        <div className="space-y-2">
                            <h4 className="text-sm font-bold text-text-main flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-primary" />
                                Subject
                            </h4>
                            <p className="text-base font-medium text-text-main pl-6">{selectedFeedback.subject}</p>
                        </div>

                        <div className="space-y-2">
                            <h4 className="text-sm font-bold text-text-main flex items-center gap-2">
                                <FileText className="w-4 h-4 text-primary" />
                                Description
                            </h4>
                            <div className="bg-white/50 p-4 rounded-xl border border-border-subtle ml-6 backdrop-blur-sm">
                                <p className="text-sm text-text-main leading-relaxed">
                                    {selectedFeedback.description}
                                </p>
                            </div>
                        </div>

                        {selectedFeedback.files.length > 0 && (
                            <div className="space-y-3">
                                <h4 className="text-sm font-bold text-text-main flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-primary" />
                                    Attached Files ({selectedFeedback.files.length})
                                </h4>
                                <div className="grid grid-cols-1 gap-2 ml-6">
                                    {selectedFeedback.files.map((file, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 bg-white border border-border-subtle rounded-xl hover:border-primary/30 hover:shadow-soft transition-all group">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="w-8 h-8 rounded-lg bg-bg-alt flex items-center justify-center text-text-muted group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                                                    <FileText className="w-4 h-4" />
                                                </div>
                                                <span className="text-xs text-text-main truncate font-medium">{file}</span>
                                            </div>
                                            <button className="flex items-center gap-2 px-3 py-1.5 text-[11px] font-bold text-primary hover:bg-primary/10 rounded-lg transition-colors">
                                                <Download className="w-3.5 h-3.5" />
                                                Download
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        onClick={() => setSelectedFeedback(null)}
                        className="flex-1 btn btn-secondary py-3 rounded-xl"
                    >
                        Return to List
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-text-main">Customer Feedbacks</h2>
                    <p className="text-xs text-text-muted mt-0.5">Submissions associated with this account</p>
                </div>
                <div className="badge badge-primary px-3 py-1 text-[11px]">
                    {dummyFeedbacks.length} Submissions
                </div>
            </div>

            {/* Feedback List */}
            <div className="grid grid-cols-1 gap-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-1">
                {dummyFeedbacks.map((feedback) => (
                    <div
                        key={feedback.id}
                        onClick={() => setSelectedFeedback(feedback)}
                        className="group flex flex-col p-4 card hover:border-primary/50 hover:shadow-glow cursor-pointer transition-all active:scale-[0.99] relative overflow-hidden"
                    >
                        {/* Status/Priority side indicator */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${feedback.priority === 'high' ? 'bg-danger' :
                            feedback.priority === 'medium' ? 'bg-warning' : 'bg-primary'
                            }`} />

                        <div className="flex items-start justify-between gap-4">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-bg-alt flex items-center justify-center text-text-muted group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                    <MessageSquare className="w-5 h-5" />
                                </div>
                                <div className="space-y-1.5">
                                    <h3 className="text-sm font-bold text-text-main group-hover:text-primary transition-colors leading-tight">
                                        {feedback.subject}
                                    </h3>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
                                            <Calendar className="w-3 h-3" />
                                            {formatDate(feedback.createdAt).split(',')[0]}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
                                            <Hash className="w-3 h-3" />
                                            {feedback.id}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {feedback.files.length > 0 && (
                                    <div className="flex items-center gap-1 text-[10px] bg-bg-alt px-1.5 py-0.5 rounded border border-border-subtle text-text-muted">
                                        <FileText className="w-3 h-3" />
                                        {feedback.files.length}
                                    </div>
                                )}
                                <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={onClose}
                className="w-full btn btn-secondary py-3 rounded-xl border-dashed hover:border-solid transition-all"
            >
                Close Portal
            </button>
        </div>
    )
}

export default CustomerFeedbacks