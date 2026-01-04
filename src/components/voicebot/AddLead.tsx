import { useState } from "react"
import { Phone, Mail, User, Calendar, Briefcase, Globe, Plus, X, Loader2, Check } from "lucide-react"
import voiceBotService from "@/api/voicebotService"
import { toast } from "@/hooks/useToast"

interface AddLeadProps {
    onClose: () => void;
    onSuccess?: () => void;
}

function AddLead({ onClose, onSuccess }: AddLeadProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        leadName: "",
        leadEmail: "",
        leadPhoneNumber: "",
        leadCompany: "",
        leadExpertiseDomain: "",
        lastCalledAt: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.leadName || !formData.leadPhoneNumber) {
            toast.danger("Name and Phone Number are required");
            return;
        }

        try {
            setLoading(true);
            await voiceBotService.createLead(formData, {});
            toast.success("Lead added successfully");
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            toast.danger("Failed to add lead. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">


            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                    {/* Lead Name */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.1em] px-1 flex items-center gap-1.5">
                            <User className="w-3 h-3" />
                            Full Name *
                        </label>
                        <input
                            type="text"
                            name="leadName"
                            required
                            placeholder="John Doe"
                            className="input w-full"
                            value={formData.leadName}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Lead Phone Number */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.1em] px-1 flex items-center gap-1.5">
                            <Phone className="w-3 h-3" />
                            Phone Number *
                        </label>
                        <input
                            type="tel"
                            name="leadPhoneNumber"
                            required
                            placeholder="+1 (555) 000-0000"
                            className="input w-full"
                            value={formData.leadPhoneNumber}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Lead Email */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.1em] px-1 flex items-center gap-1.5">
                            <Mail className="w-3 h-3" />
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="leadEmail"
                            placeholder="john@example.com"
                            className="input w-full"
                            value={formData.leadEmail}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Lead Company */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.1em] px-1 flex items-center gap-1.5">
                            <Briefcase className="w-3 h-3" />
                            Company
                        </label>
                        <input
                            type="text"
                            name="leadCompany"
                            placeholder="Acme Inc."
                            className="input w-full"
                            value={formData.leadCompany}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Lead Expertise Domain */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.1em] px-1 flex items-center gap-1.5">
                            <Globe className="w-3 h-3" />
                            Expertise Domain
                        </label>
                        <input
                            type="text"
                            name="leadExpertiseDomain"
                            placeholder="SaaS / Real Estate"
                            className="input w-full"
                            value={formData.leadExpertiseDomain}
                            onChange={handleChange}
                        />
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
                        {loading ? 'Adding Lead...' : 'Add Lead'}
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

            <div className="p-4 rounded-xl bg-primary-soft/10 border border-primary-soft/20">
                <div className="flex gap-3 text-xs text-text-muted leading-relaxed">
                    <div className="text-primary mt-0.5">•</div>
                    <div>Required fields are marked with an asterisk (*).</div>
                </div>
            </div>
        </div>
    )
}

export default AddLead