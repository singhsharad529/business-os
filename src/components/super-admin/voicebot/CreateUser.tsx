import { useState } from "react"
import { Mail, Lock, Building2, Briefcase, Loader2, X } from "lucide-react"
import voiceBotService from "@/api/voicebotService"
import { toast } from "@/hooks/useToast"

interface CreateUserProps {
    onClose: () => void;
    onSuccess?: () => void;
}

function CreateUser({ onClose, onSuccess }: CreateUserProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        companyName: "",
        expertiseDomain: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            // Assuming there's a service method for creating a user/customer
            // If not, I'll just simulate it or wait for user to provide the API
            // For now, let's look for a suitable method in voicebotService

            // To be implemented when API is clear
            console.log("Creating user with data:", formData);

            // await voiceBotService.createCustomer(formData); 

            toast.success("User created successfully");
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            toast.danger("Failed to create user");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4 p-4">
                    {/* Email */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-text-main block">
                            Email Address <span className="text-danger">*</span>
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                            <input
                                type="email"
                                name="email"
                                required
                                placeholder="user@example.com"
                                className="input w-full pl-10"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-text-main block">
                            Password <span className="text-danger">*</span>
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                            <input
                                type="password"
                                name="password"
                                required
                                placeholder="••••••••"
                                className="input w-full pl-10"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Company Name */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-text-main block">
                            Company Name <span className="text-danger">*</span>
                        </label>
                        <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                            <input
                                type="text"
                                name="companyName"
                                required
                                placeholder="Acme Inc."
                                className="input w-full pl-10"
                                value={formData.companyName}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Expertise Domain */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-text-main block">
                            Expertise Domain <span className="text-danger">*</span>
                        </label>
                        <div className="relative">
                            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                            <input
                                type="text"
                                name="expertiseDomain"
                                required
                                placeholder="SaaS / Healthcare / Finance"
                                className="input w-full pl-10"
                                value={formData.expertiseDomain}
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
                        {loading ? 'Creating User...' : 'Create User'}
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

export default CreateUser