import { useState } from "react"
import { Mail, Lock, Building2, Loader2, User } from "lucide-react"
import voiceBotService from "@/api/voicebotService"
import { toast } from "@/hooks/useToast"
import adminCustomerService from "@/api/adminCustomerService";

interface CreateUserProps {
    onClose: () => void;
    onSuccess?: () => void;
}

function CreateUser({ onClose, onSuccess }: CreateUserProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        companyName: "",
        salesRepName: "",
        sendCredentials: false
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.email || !formData.password || !formData.companyName || !formData.salesRepName) {
            toast.danger("Please fill all the fields");
            return;
        }
        try {
            setLoading(true);

            const payload: any = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                companyName: formData.companyName,
                repName: formData.salesRepName,
                // send_credentials: formData.sendCredentials
            };
            const response = await adminCustomerService.addCustomer(payload, {});

            if (response) {
                toast.success("User created successfully");
                if (onSuccess) onSuccess();
                onClose();
            }
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
                    {/* Name */}
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-text-main block">
                            Name <span className="text-danger">*</span>
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                            <input
                                type="text"
                                name="name"
                                // required
                                placeholder="Allen Smith"
                                className="input w-full pl-10"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                    </div>


                    {/* Email */}
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-text-main block">
                            Email Address <span className="text-danger">*</span>
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                            <input
                                type="email"
                                name="email"
                                // required
                                placeholder="user@example.com"
                                className="input w-full pl-10"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-text-main block">
                            Password <span className="text-danger">*</span>
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                            <input
                                type="password"
                                name="password"
                                // required
                                placeholder="••••••••"
                                className="input w-full pl-10"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Sales Rep Name */}
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-text-main block">
                            Sales Representative <span className="text-danger">*</span>
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                            <input
                                type="text"
                                name="salesRepName"
                                // required
                                placeholder="John Doe"
                                className="input w-full pl-10"
                                value={formData.salesRepName}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Company Name */}
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-text-main block">
                            Company Name <span className="text-danger">*</span>
                        </label>
                        <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                            <input
                                type="text"
                                name="companyName"
                                // required
                                placeholder="Acme Inc."
                                className="input w-full pl-10"
                                value={formData.companyName}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Send Credentials */}
                    <div className="flex items-center gap-3 pt-2">
                        <div className="flex items-center h-5">
                            <input
                                id="sendCredentials"
                                name="sendCredentials"
                                type="checkbox"
                                checked={formData.sendCredentials}
                                onChange={handleChange}
                                className="w-4 h-4 text-primary border-border-subtle rounded focus:ring-primary focus:ring-offset-0 cursor-pointer transition-all duration-200"
                            />
                        </div>
                        <label
                            htmlFor="sendCredentials"
                            className="text-sm font-medium text-text-main cursor-pointer select-none"
                        >
                            Send Credentials to the user's email
                        </label>
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