import { useState } from "react"
import { Tag, FileText, Loader2 } from "lucide-react"
import { toast } from "@/hooks/useToast"

interface AddCategoryProps {
    onClose: () => void;
    onSuccess?: () => void;
}

function AddCategory({ onClose, onSuccess }: AddCategoryProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            // TODO: Integrate with API service when endpoint is available
            console.log("Creating category with data:", formData);

            // Simulating API call for now
            await new Promise(resolve => setTimeout(resolve, 1000));

            toast.success("Category created successfully");
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            toast.danger("Failed to create category");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4 p-4">
                    {/* Category Name */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-text-main block">
                            Category Name <span className="text-danger">*</span>
                        </label>
                        <div className="relative">
                            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                            <input
                                type="text"
                                name="name"
                                required
                                placeholder="e.g. Technology"
                                className="input w-full pl-10"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Category Description */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-text-main block">
                            Description
                        </label>
                        <div className="relative">
                            <FileText className="absolute left-3 top-3 w-4 h-4 text-text-muted" />
                            <textarea
                                name="description"
                                placeholder="Brief description of the category..."
                                className="input w-full pl-10 h-32 py-2 resize-none"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 p-4 pt-0">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-[2] btn btn-primary py-3 rounded-xl flex items-center justify-center gap-2 shadow-glow"
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {loading ? 'Creating...' : 'Create Category'}
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
        </div>
    )
}

export default AddCategory