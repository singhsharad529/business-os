import { useState, useEffect } from "react"
import { MessageSquare, Calendar, ChevronRight, ArrowLeft, FileText, Download, Clock, Hash, Image as ImageIcon } from "lucide-react"
import { useParams } from "react-router-dom"
import { toast } from "@/hooks/useToast"
import adminCustomerService from "@/api/adminCustomerService"
import { Skeleton } from "../../ui/skeleton"
import { AxiosRequestConfig } from "axios"

interface FeedbackItem {
    id: string;
    userId: string;
    subject: string;
    description: string;
    mediaFiles: string[];
    createdAt: string;
    updatedAt: string;
    mediaFileUrls: string[];
}

function CustomerFeedbacks({ onClose }: { onClose: () => void }) {
    const { id } = useParams();
    const [listLoading, setListLoading] = useState(false);
    const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
    const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);

    const fetchFeedbacks = async () => {
        try {
            setListLoading(true);
            const config: AxiosRequestConfig = {
                params: {
                    userId: id as string
                }
            }
            const response = await adminCustomerService.getfeedbackbyuser(config);
            if (response && response.feedback) {
                setFeedbacks(response.feedback);
            }
        } catch (error) {
            console.error("Failed to fetch feedbacks:", error);
            toast.danger("Failed to load feedback history");
        } finally {
            setListLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchFeedbacks();
        }
    }, [id]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (selectedFeedback) {
        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setSelectedFeedback(null)}
                        className="p-2.5 hover:bg-bg-alt rounded-xl transition-all border border-border-subtle shadow-sm active:scale-95"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-text-main">Feedback Details</h2>
                        <div className="flex items-center gap-1 mt-1 text-[10px] text-text-muted font-medium uppercase tracking-wider">
                            <Hash className="w-3 h-3" />
                            {selectedFeedback.id}
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
                    <div className="card p-6 space-y-6 bg-gradient-to-br from-white to-bg-alt/30 border border-border-subtle rounded-2xl">
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

                        {selectedFeedback.mediaFileUrls && selectedFeedback.mediaFileUrls.length > 0 && (
                            <div className="space-y-3">
                                <h4 className="text-sm font-bold text-text-main flex items-center gap-2">
                                    <ImageIcon className="w-4 h-4 text-primary" />
                                    Attached Media ({selectedFeedback.mediaFileUrls.length})
                                </h4>
                                <div className="grid grid-cols-1 gap-2 ml-6">
                                    {selectedFeedback.mediaFileUrls.map((url, idx) => {
                                        const fileName = selectedFeedback.mediaFiles[idx] || `file_${idx}`;
                                        const isImage = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(fileName);

                                        return (
                                            <div key={idx} className="space-y-2 border-b border-border-subtle pb-4 last:border-0 last:pb-0">
                                                <div className="flex items-center justify-between p-3 bg-white border border-border-subtle rounded-xl hover:border-primary/30 hover:shadow-soft transition-all group">
                                                    <div className="flex items-center gap-3 overflow-hidden">
                                                        <div className="w-8 h-8 rounded-lg bg-bg-alt flex items-center justify-center text-text-muted group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                                                            <FileText className="w-4 h-4" />
                                                        </div>
                                                        <span className="text-xs text-text-main truncate font-medium max-w-[200px]">{fileName.split('/').pop()}</span>
                                                    </div>
                                                    <a
                                                        href={url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-2 px-3 py-1.5 text-[11px] font-bold text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                                    >
                                                        <Download className="w-3.5 h-3.5" />
                                                        View / Download
                                                    </a>
                                                </div>
                                                {isImage && (
                                                    <div className="ml-0 rounded-xl overflow-hidden border border-border-subtle bg-bg-alt aspect-video flex items-center justify-center">
                                                        <img src={url} alt="Attached" className="max-w-full max-h-full object-contain" />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={() => setSelectedFeedback(null)}
                        className="flex-1 btn btn-secondary py-3 rounded-xl"
                    >
                        Return to List
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between mb-6 px-2">
                <div>
                    <h2 className="text-xl font-bold text-text-main">Customer Feedbacks</h2>
                    <p className="text-xs text-text-muted mt-0.5">Submissions associated with this account</p>
                </div>
                <div className="badge badge-primary px-3 py-1 text-[11px] font-bold shadow-soft">
                    {feedbacks.length} Submissions
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar px-2">
                <div className="p-2 min-h-[400px] animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {listLoading ? (
                        <div className="flex flex-col items-center justify-center gap-3 w-full">
                            <Skeleton className="w-full h-16 " />
                            <Skeleton className="w-full h-16" />
                            <Skeleton className="w-full h-16" />
                            <Skeleton className="w-full h-16" />
                            <Skeleton className="w-full h-16" />
                        </div>
                    ) : feedbacks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-bg-alt flex items-center justify-center text-text-muted">
                                <MessageSquare className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-text-main">No feedback found</h3>
                                <p className="text-sm text-text-muted mt-1">This customer hasn't submitted any feedback yet.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-3 pb-20">
                            {feedbacks.map((feedback) => (
                                <div
                                    key={feedback.id}
                                    onClick={() => setSelectedFeedback(feedback)}
                                    className="group flex flex-col p-4 card border border-border-subtle rounded-2xl hover:border-primary/50 hover:shadow-glow cursor-pointer transition-all active:scale-[0.99] relative overflow-hidden"
                                >
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />

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
                                                        {feedback.id.substring(0, 8)}...
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {feedback.mediaFiles && feedback.mediaFiles.length > 0 && (
                                                <div className="flex items-center gap-1 text-[10px] bg-bg-alt px-1.5 py-0.5 rounded border border-border-subtle text-text-muted">
                                                    <FileText className="w-3 h-3" />
                                                    {feedback.mediaFiles.length}
                                                </div>
                                            )}
                                            <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="pt-4 mt-auto px-2 pb-2">
                <button
                    type="button"
                    onClick={onClose}
                    className="w-full px-4 py-3 rounded-xl border border-border-subtle text-sm font-bold text-text-main hover:bg-bg-alt transition-colors"
                >
                    Close Portal
                </button>
            </div>
        </div>
    )
}

export default CustomerFeedbacks