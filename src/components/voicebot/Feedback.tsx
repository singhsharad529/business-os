import { useState, useRef, useEffect } from "react"
import { Upload, X, Loader2, Image as ImageIcon, MessageSquare, Calendar, ChevronRight, ArrowLeft, FileText, Download, Clock, Hash } from "lucide-react"
import { toast } from "@/hooks/useToast"
import voiceBotService from "@/api/voicebotService"
import { Skeleton } from "../ui/skeleton";

interface FeedbackProps {
    onClose: () => void;
    onSuccess?: () => void;
}

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

interface FileWithPreview {
    file: File;
    preview: string;
}

function Feedback({ onClose, onSuccess }: FeedbackProps) {
    const [loading, setLoading] = useState(false);
    const [listLoading, setListLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<"submit" | "history">("submit");
    const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
    const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([]);

    const [formData, setFormData] = useState({
        subject: "",
        description: ""
    });

    const fetchFeedbacks = async () => {
        try {
            setListLoading(true);
            const response = await voiceBotService.getFeedbackList({});
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
        if (activeTab === "history") {
            fetchFeedbacks();
        }
    }, [activeTab]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newFiles: FileWithPreview[] = [];
            Array.from(files).forEach(file => {
                if (file.size > 5 * 1024 * 1024) {
                    toast.danger(`${file.name} is too large. Image size should be less than 5MB`);
                    return;
                }

                const preview = URL.createObjectURL(file);
                newFiles.push({ file, preview });
            });

            setSelectedFiles(prev => [...prev, ...newFiles]);
        }
        // Reset input so the same file can be selected again if removed
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const removeFile = (index: number) => {
        setSelectedFiles(prev => {
            const newFiles = [...prev];
            URL.revokeObjectURL(newFiles[index].preview);
            newFiles.splice(index, 1);
            return newFiles;
        });
    };

    // Cleanup object URLs on unmount
    useEffect(() => {
        return () => {
            selectedFiles.forEach(f => URL.revokeObjectURL(f.preview));
        };
    }, [selectedFiles]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.subject || !formData.description) {
            toast.danger("Subject and Description are required");
            return;
        }

        try {
            setLoading(true);
            const feedbackData = {
                subject: formData.subject,
                description: formData.description,
                files: selectedFiles.map(f => f.file)
            };

            await voiceBotService.submitFeedback(feedbackData, {});

            toast.success("Feedback submitted successfully");
            setFormData({ subject: "", description: "" });
            selectedFiles.forEach(f => URL.revokeObjectURL(f.preview));
            setSelectedFiles([]);
            if (onSuccess) onSuccess();
            setActiveTab("history"); // Switch to history to see the new feedback
        } catch (error) {
            console.error(error);
            toast.danger("Failed to submit feedback. Please try again.");
        } finally {
            setLoading(false);
        }
    };

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
            {/* Custom Tabs Style from AddAdminAgent */}
            <div className="flex border-b border-border-subtle mb-4 shrink-0 px-2">
                <button
                    onClick={() => setActiveTab("submit")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all relative ${activeTab === "submit" ? "text-primary" : "text-text-muted hover:text-text-main"
                        }`}
                >
                    <MessageSquare className="w-4 h-4" />
                    Submit Feedback
                    {activeTab === "submit" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />}
                </button>
                <button
                    onClick={() => setActiveTab("history")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all relative ${activeTab === "history" ? "text-primary" : "text-text-muted hover:text-text-main"
                        }`}
                >
                    <Clock className="w-4 h-4" />
                    History
                    {activeTab === "history" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />}
                </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar px-2">
                {activeTab === "submit" ? (
                    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="space-y-6 p-2">
                            {/* Subject */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-text-main block">
                                    Subject <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="subject"
                                    required
                                    placeholder="Example: UI bug on dashboard"
                                    className="input w-full"
                                    value={formData.subject}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-text-main block">
                                    Description <span className="text-danger">*</span>
                                </label>
                                <textarea
                                    name="description"
                                    required
                                    placeholder="Please describe your feedback or report a bug..."
                                    className="input w-full min-h-[120px] py-3 resize-none"
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Multiple File Upload */}
                            <div className="space-y-4">
                                <label className="text-xs font-semibold text-text-main block">
                                    Attachments (Optional)
                                </label>

                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-border-subtle rounded-xl p-8 flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group"
                                >
                                    <div className="p-3 rounded-full bg-bg-alt group-hover:bg-primary/10 transition-colors">
                                        <Upload className="w-6 h-6 text-text-muted group-hover:text-primary" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-medium text-text-main">Click to upload or drag and drop</p>
                                        <p className="text-xs text-text-muted">Supports multiple files (max. 5MB each)</p>
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        accept="image/*,application/pdf,.doc,.docx"
                                        multiple
                                        className="hidden"
                                    />
                                </div>

                                {/* Selected Files List */}
                                {selectedFiles.length > 0 && (
                                    <div className="grid grid-cols-1 gap-2">
                                        {selectedFiles.map((fileData, index) => (
                                            <div key={index} className="flex items-center gap-3 p-3 bg-bg-alt/50 border border-border-subtle rounded-xl animate-in fade-in slide-in-from-left-2 transition-all">
                                                {fileData.file.type.startsWith('image/') ? (
                                                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-border-subtle flex-shrink-0">
                                                        <img src={fileData.preview} alt="Preview" className="w-full h-full object-cover" />
                                                    </div>
                                                ) : (
                                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                                        <FileText className="w-5 h-5" />
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-bold text-text-main truncate">{fileData.file.name}</p>
                                                    <p className="text-[10px] text-text-muted">{(fileData.file.size / 1024 / 1024).toFixed(2)} MB</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeFile(index)}
                                                    className="p-2 hover:bg-danger/10 text-text-muted hover:text-danger rounded-lg transition-colors"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-4 sticky bottom-0 bg-white/80 backdrop-blur-md pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-[2] btn btn-primary py-3 rounded-xl flex items-center justify-center gap-2 shadow-glow"
                            >
                                {loading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <MessageSquare className="w-4 h-4" />
                                )}
                                {loading ? 'Submitting...' : 'Send Feedback'}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-3 rounded-xl border border-border-subtle text-sm font-bold text-text-main hover:bg-bg-alt transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
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
                            <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-bg-alt flex items-center justify-center text-text-muted">
                                    <MessageSquare className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-text-main">No feedback found</h3>
                                    <p className="text-sm text-text-muted mt-1">You haven't submitted any feedback yet.</p>
                                </div>
                                <button
                                    onClick={() => setActiveTab("submit")}
                                    className="btn btn-primary px-6 py-2 rounded-xl text-sm"
                                >
                                    Submit First Feedback
                                </button>
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

                        <div className="pt-4 sticky bottom-0 bg-white/80 backdrop-blur-md">
                            <button
                                type="button"
                                onClick={onClose}
                                className="w-full px-4 py-3 rounded-xl border border-border-subtle text-sm font-bold text-text-main hover:bg-bg-alt transition-colors"
                            >
                                Close Portal
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Feedback
