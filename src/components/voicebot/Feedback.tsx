import { useState, useRef } from "react"
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react"
import { toast } from "@/hooks/useToast"

interface FeedbackProps {
    onClose: () => void;
    onSuccess?: () => void;
}

function Feedback({ onClose, onSuccess }: FeedbackProps) {
    const [loading, setLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState({
        subject: "",
        description: "",
        image: null as File | null
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.danger("Image size should be less than 5MB");
                return;
            }
            setFormData(prev => ({ ...prev, image: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setFormData(prev => ({ ...prev, image: null }));
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.subject || !formData.description) {
            toast.danger("Subject and Description are required");
            return;
        }

        try {
            setLoading(true);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            toast.success("Feedback submitted successfully");
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            toast.danger("Failed to submit feedback. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-6 p-4">
                    {/* Subject */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-text-main block">
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
                        <label className="text-xs font-medium text-text-main block">
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

                    {/* Image Upload */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-text-main block">
                            Attach Screenshot (Optional)
                        </label>

                        {!previewUrl ? (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-border-subtle rounded-xl p-8 flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group"
                            >
                                <div className="p-3 rounded-full bg-bg-alt group-hover:bg-primary/10 transition-colors">
                                    <Upload className="w-6 h-6 text-text-muted group-hover:text-primary" />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-medium text-text-main">Click to upload or drag and drop</p>
                                    <p className="text-xs text-text-muted">PNG, JPG or WEBP (max. 5MB)</p>
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                            </div>
                        ) : (
                            <div className="relative rounded-xl overflow-hidden border border-border-subtle bg-bg-alt aspect-video flex items-center justify-center">
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="max-w-full max-h-full object-contain"
                                />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute top-2 right-2 p-1.5 bg-danger/10 text-danger hover:bg-danger hover:text-white rounded-full transition-all shadow-lg backdrop-blur-md"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 text-white text-[10px] rounded backdrop-blur-md flex items-center gap-1">
                                    <ImageIcon className="w-3 h-3" />
                                    {formData.image?.name}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-[2] btn btn-primary py-3 rounded-xl flex items-center justify-center gap-2 shadow-glow"
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <></>
                        )}
                        {loading ? 'Submitting...' : 'Submit Feedback'}
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-3 rounded-xl border border-border-subtle text-sm font-bold text-text-main hover:bg-bg-alt transition-colors flex items-center justify-center gap-2"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Feedback