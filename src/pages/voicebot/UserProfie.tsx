import { useState } from "react"
import { Edit, Mail, Phone, MapPin, Building2, Briefcase, User, Info, Loader2, Trophy, ShieldCheck, ArrowUpRight } from "lucide-react"
import { SideSheet } from "@/components/SideSheet"
import { toast } from "@/hooks/useToast"

function UserProfie() {
    const [isEditSheetOpen, setIsEditSheetOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    // Dummy User (Client) Data
    const [userData, setUserData] = useState({
        fullName: "John Doe",
        email: "john.doe@clientcompany.com",
        phone: "+1 (555) 123-4567",
        role: "Client Administrator",
        company: "Acme Corp",
        expertise: "Operations & Logistics",
        location: "San Francisco, USA",
        bio: "Dedicated operations manager with over 10 years of experience in streamlining business processes and implementing AI solutions."
    })

    const [editFormData, setEditFormData] = useState({ ...userData })

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setEditFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            setUserData({ ...editFormData })
            toast.success("Profile updated successfully")
            setIsEditSheetOpen(false)
        } catch (error) {
            toast.danger("Failed to update profile")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-text-main">My Profile</h1>
                        <p className="text-text-muted mt-1">View and manage your personal account settings</p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            className="btn btn-primary flex items-center gap-1.5"
                            onClick={() => {
                                setEditFormData({ ...userData })
                                setIsEditSheetOpen(true)
                            }}
                        >
                            <Edit className="w-3.5 h-3.5" />
                            Edit Profile
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Profile Overview Card */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="card p-6 border border-border-subtle flex flex-col items-center text-center">
                            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4 border-2 border-primary/20">
                                <User className="w-12 h-12 text-primary" />
                            </div>
                            <h2 className="text-xl font-bold text-text-main">{userData.fullName}</h2>
                            <p className="text-primary font-medium text-sm">{userData.role}</p>
                            <div className="mt-6 w-full space-y-3 pt-6 border-t border-border-subtle">
                                <div className="flex items-center gap-3 text-text-muted text-sm px-2">
                                    <Mail className="w-4 h-4 text-primary" />
                                    <span>{userData.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-text-muted text-sm px-2">
                                    <Phone className="w-4 h-4 text-primary" />
                                    <span>{userData.phone}</span>
                                </div>
                                <div className="flex items-center gap-3 text-text-muted text-sm px-2">
                                    <MapPin className="w-4 h-4 text-primary" />
                                    <span>{userData.location}</span>
                                </div>
                            </div>
                        </div>

                        <div className="card p-6 border border-border-subtle">
                            <h3 className="text-sm font-semibold text-text-main mb-4 flex items-center gap-2">
                                <Info className="w-4 h-4 text-primary" />
                                Professional Info
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-text-muted block mb-1">Company</label>
                                    <div className="flex items-center gap-2 text-text-main font-medium">
                                        <Building2 className="w-4 h-4 text-text-muted" />
                                        {userData.company}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-text-muted block mb-1">Domain & Expertise</label>
                                    <div className="flex items-center gap-2 text-text-main font-medium">
                                        <Briefcase className="w-4 h-4 text-text-muted" />
                                        {userData.expertise}
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                    {/* Profile Details Card */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="card p-6 border border-border-subtle h-full">
                            <h3 className="text-lg font-bold text-text-main mb-6 border-b border-border-subtle pb-4">Personal Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <span className="text-sm text-text-muted">Full Name</span>
                                    <p className="text-text-main font-medium">{userData.fullName}</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-sm text-text-muted">Email Address</span>
                                    <p className="text-text-main font-medium">{userData.email}</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-sm text-text-muted">Phone Number</span>
                                    <p className="text-text-main font-medium">{userData.phone}</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-sm text-text-muted">Location</span>
                                    <p className="text-text-main font-medium">{userData.location}</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-sm text-text-muted">Member of</span>
                                    <p className="text-text-main font-medium">{userData.company}</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-sm text-text-muted">Position</span>
                                    <p className="text-text-main font-medium">{userData.role}</p>
                                </div>
                                <div className="md:col-span-2 space-y-1">
                                    <span className="text-sm text-text-muted">Bio</span>
                                    <p className="text-text-main leading-relaxed">{userData.bio}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Profile Sidesheet */}
            <SideSheet
                isOpen={isEditSheetOpen}
                onClose={() => setIsEditSheetOpen(false)}
                title="Edit My Profile"
                size="md"
            >
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-text-main block">Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                required
                                value={editFormData.fullName}
                                onChange={handleEditChange}
                                className="input w-full"
                                placeholder="Enter full name"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-text-main block">Email (System Fixed)</label>
                            <input
                                type="email"
                                name="email"
                                disabled
                                value={editFormData.email}
                                className="input w-full bg-bg-alt cursor-not-allowed opacity-70"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-text-main block">Phone Number</label>
                            <input
                                type="text"
                                name="phone"
                                value={editFormData.phone}
                                onChange={handleEditChange}
                                className="input w-full"
                                placeholder="+1 (555) 000-0000"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-text-main block">Location</label>
                            <input
                                type="text"
                                name="location"
                                value={editFormData.location}
                                onChange={handleEditChange}
                                className="input w-full"
                                placeholder="City, State"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-text-main block">Company Name</label>
                            <input
                                type="text"
                                name="company"
                                value={editFormData.company}
                                onChange={handleEditChange}
                                className="input w-full"
                                placeholder="Company name"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-text-main block">Job Title</label>
                            <input
                                type="text"
                                name="role"
                                value={editFormData.role}
                                onChange={handleEditChange}
                                className="input w-full"
                                placeholder="Operations Manager"
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-xs font-medium text-text-main block">Expertise Domain</label>
                            <input
                                type="text"
                                name="expertise"
                                value={editFormData.expertise}
                                onChange={handleEditChange}
                                className="input w-full"
                                placeholder="E-commerce, IT, etc."
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-xs font-medium text-text-main block">Personal Bio</label>
                            <textarea
                                name="bio"
                                rows={4}
                                value={editFormData.bio}
                                onChange={handleEditChange}
                                className="input w-full resize-none py-2"
                                placeholder="Tell us about yourself..."
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] btn btn-primary py-3 rounded-xl flex items-center justify-center gap-2 shadow-glow"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            {loading ? 'Updating Profile...' : 'Update Profile'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsEditSheetOpen(false)}
                            className="flex-1 px-4 py-3 rounded-xl border border-border-subtle text-sm font-bold text-text-main hover:bg-bg-alt transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </SideSheet>
        </div>
    )
}

export default UserProfie
