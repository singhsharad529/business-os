import { FC, useEffect, useState } from "react";
import {
    Building2,
    Mail,
    Globe,
    Fingerprint,
    FileText,
    ExternalLink,
    X,
    Upload,
    User,
    Lock,
    Eye,
    EyeOff,
    Phone
} from "lucide-react";
import { SideSheet } from "@/components/SideSheet";
import { toast } from "@/hooks/useToast";
import adminCustomerService from "@/api/adminCustomerService";
import DashboardLoader from "@/components/common/DashboardLoader";

interface CustomerCompanyProps {
    isEditSheetOpen: boolean;
    setIsEditSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;
    userid: string;
    setCustomerName: React.Dispatch<React.SetStateAction<string>>;
    setCompanyName: React.Dispatch<React.SetStateAction<string>>;
}

const CustomerCompany: FC<CustomerCompanyProps> = ({ isEditSheetOpen, setIsEditSheetOpen, userid, setCustomerName, setCompanyName }) => {

    const [profileData, setProfileData] = useState<any>(null);
    const [editData, setEditData] = useState<any>({
        name: '',
        description: '',
        contactInfo: {
            email: '',
            phone: '',
            address: '',
            website: ''
        },
        taxId: '',
        foundedDate: '',
        password: '',
        documents: []
    });
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSave = async () => {
        try {
            setLoading(true);

            // Clean fields - convert empty strings to null for the API
            const cleanValue = (val: any) => (val && val.trim() !== '' ? val : null);

            const contactInfo = {
                email: cleanValue(editData.contactInfo.email),
                phone: cleanValue(editData.contactInfo.phone),
                address: cleanValue(editData.contactInfo.address),
                website: cleanValue(editData.contactInfo.website)
            };

            const payload: any = {
                email: cleanValue(editData.contactInfo.email),
                companyName: cleanValue(editData.name),
                companyDescription: cleanValue(editData.description),
                contactInfo: contactInfo,
                documents: editData.documents.map((doc: any) => {
                    // Extract gcsKey from URL if it's missing
                    let gcsKey = doc.gcsKey;
                    if (!gcsKey && doc.documentUrl) {
                        try {
                            const url = new URL(doc.documentUrl);
                            const pathParts = url.pathname.split('/');
                            // The path is usually /bucket-name/key
                            // So key is everything after the first two parts
                            if (pathParts.length > 2) {
                                gcsKey = pathParts.slice(2).join('/');
                            }
                        } catch (e) {
                            console.error("Failed to parse documentUrl:", e);
                        }
                    }

                    return {
                        documentName: doc.documentName,
                        gcsKey: gcsKey,
                        documentType: doc.documentType,
                        documentUrl: doc.documentUrl
                    };
                })
            };

            // Only include password if it has been entered
            if (editData.password && editData.password.trim() !== '') {
                payload.password = editData.password;
            }

            await adminCustomerService.updateUser(userid, payload, {});
            toast.success("Profile and company details updated successfully");
            setIsEditSheetOpen(false);

            // Clear password field after successful save
            setEditData((prev: any) => ({ ...prev, password: '' }));

            fetchProfileCompany();
        } catch (error) {
            console.error("Update error:", error);
            toast.danger("Failed to update details");
        } finally {
            setLoading(false);
        }
    };


    const fetchProfileCompany = async () => {
        try {
            setLoading(true);
            const response = await adminCustomerService.getUserProfile(userid, {});
            setProfileData(response);

            if (response.companies && response.companies.length > 0) {
                const comp = response.companies[0];
                const userEmail = response.user?.email || '';

                setEditData({
                    name: comp.name || '',
                    description: comp.description || '',
                    contactInfo: {
                        email: comp.contactInfo?.email || userEmail,
                        phone: comp.contactInfo?.phone || '',
                        address: comp.contactInfo?.address || '',
                        website: comp.contactInfo?.website || ''
                    },
                    taxId: comp.taxId || '',
                    foundedDate: comp.foundedDate || '',
                    password: '',
                    documents: comp.documents || []
                });

                setCompanyName(comp.name || '');
            }
            if (response.user) {
                setEditData((prev: any) => ({
                    ...prev,
                    contactInfo: {
                        ...prev.contactInfo,
                        email: response.user.email || ''
                    }
                }));
                setCustomerName(response.user.name || '');
            }
        } catch (error) {
            console.log('error', error);

            toast.danger("Failed to fetch profile company");
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (userid) {
            fetchProfileCompany();
        }
    }, [userid]);


    const currentCompany = profileData?.companies?.[0] || '';
    const currentEmail = profileData?.user?.email || '';
    const currentPhone = currentCompany?.contactInfo?.phone || '';

    return (
        <div>
            {
                loading ? (<DashboardLoader />) : (<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {/* Main Content (Left/Center) */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Hero Card */}
                        <div className="card rounded-xl p-6 border border-border-subtle hover:shadow-glow hover:-translate-y-0.5 transition-all relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <Building2 className="w-24 h-24" />
                            </div>
                            <div className="flex flex-col md:flex-row gap-6 relative z-10">
                                <div className="w-20 h-20 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold text-4xl shadow-inner border border-primary/20">
                                    <Building2 className="w-12 h-12" />
                                </div>
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-3xl font-bold text-text-main">{currentCompany?.name}</h2>
                                        {/* <span className="badge badge-success px-4 py-1">Active</span> */}
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-text-muted">
                                        {(currentCompany?.contactInfo?.website || currentCompany?.website) && (
                                            <div className="flex items-center gap-1.5 bg-bg px-2.5 py-1 rounded-full border border-border-subtle">
                                                <Globe className="w-4 h-4 text-primary" />
                                                <a href={currentCompany?.contactInfo?.website || currentCompany?.website} target="_blank" rel="noopener noreferrer" className="text-sm hover:text-primary transition-colors">
                                                    {(currentCompany?.contactInfo?.website || currentCompany?.website)?.replace('https://', '').replace('http://', '')}
                                                </a>
                                            </div>
                                        )}
                                        {currentCompany?.industry && (
                                            <div className="flex items-center gap-1.5 bg-bg px-2.5 py-1 rounded-full border border-border-subtle">
                                                <Building2 className="w-4 h-4 text-primary" />
                                                <span className="text-sm capitalize">{currentCompany?.industry?.replace('_', ' ')}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* About Section */}
                        <div className="card rounded-xl p-6 border border-border-subtle hover:shadow-glow hover:-translate-y-0.5 transition-all">
                            <h3 className="text-xl font-bold text-text-main mb-4 flex items-center gap-2">
                                About {currentCompany?.name}
                            </h3>
                            <p className="text-text-muted leading-relaxed whitespace-pre-wrap">
                                {currentCompany?.description}
                            </p>
                        </div>

                        {/* Profile Information & Status */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="card rounded-xl p-8 border border-border-subtle hover:shadow-glow hover:-translate-y-0.5 transition-all">
                                <h3 className="text-lg font-semibold text-text-main flex items-center gap-2 mb-2">
                                    <User className="w-5 h-5 text-primary" />
                                    Personal Information
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between py-2 border-b border-border-subtle/50">
                                        <span className="text-text-muted flex items-center gap-2"><Mail className="w-4 h-4" /> Email</span>
                                        <span className="text-text-main">{currentEmail}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="card rounded-xl p-6 border border-border-subtle hover:shadow-glow hover:-translate-y-0.5 transition-all">
                                <h3 className="text-lg font-semibold text-text-main mb-2">Account Status</h3>
                                <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-text-muted">Account Status</span>
                                        <span className="flex items-center gap-1.5 text-success font-medium">
                                            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                                            Active
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Company Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4 card rounded-xl p-6 border border-border-subtle hover:shadow-glow hover:-translate-y-0.5 transition-all">
                                <h4 className="text-sm font-bold text-text-muted uppercase tracking-wider flex items-center gap-2">
                                    <Building2 className="w-4 h-4" /> Company Contact
                                </h4>
                                <div className="space-y-3">
                                    <div className='w-full text-left px-4 py-3 bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors text-sm font-medium text-text-main'>
                                        <p className="text-xs text-text-muted">Phone Number</p>
                                        <p className="text-sm font-medium">{currentPhone}</p>
                                    </div>
                                    <div className='w-full text-left px-4 py-3 bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors text-sm font-medium text-text-main'>
                                        <p className="text-xs text-text-muted">Physical Address</p>
                                        <p className="text-sm font-medium">{currentCompany?.contactInfo?.address || currentCompany?.address}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 card rounded-xl p-6 border border-border-subtle hover:shadow-glow hover:-translate-y-0.5 transition-all">
                                <h4 className="text-sm font-bold text-text-muted uppercase tracking-wider flex items-center gap-2">
                                    <Fingerprint className="w-4 h-4" /> Legal & Compliance
                                </h4>
                                <div className="space-y-3">
                                    <div className='p-3 bg-bg/50 rounded-lg'>
                                        <p className="text-xs text-text-muted">Tax Identification (Tax ID)</p>
                                        <p className="text-sm font-medium">{currentCompany?.taxId}</p>
                                    </div>
                                    <div className='p-3 bg-bg/50 rounded-lg'>
                                        <p className="text-xs text-text-muted">Founded Year</p>
                                        <p className="text-sm font-medium">{currentCompany?.foundedDate ? new Date(currentCompany.foundedDate).getFullYear() : 'N/A'}</p>
                                    </div>
                                    <div className='p-3 bg-bg/50 rounded-lg'>
                                        <p className="text-xs text-text-muted">Currency</p>
                                        <p className="text-sm font-medium">{currentCompany?.currency}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar (Right) */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Important Documents */}
                        <div className="card rounded-xl overflow-hidden border border-border-subtle">
                            <div className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-b border-border-subtle">
                                <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-primary" />
                                    Documents
                                </h3>
                                <p className="text-xs text-text-muted mt-1">Official company records</p>
                            </div>
                            <div className="p-6 space-y-4">
                                {currentCompany?.documents?.map((doc: any, index: number) => (
                                    <div key={index} className="group flex gap-2 items-center justify-between p-4 bg-bg rounded-2xl border border-border-subtle hover:border-primary/40 hover:shadow-soft transition-all cursor-default">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center border border-border-subtle group-hover:scale-105 transition-transform">
                                                <span className="text-[10px] font-black text-primary uppercase">{doc.documentType}</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-text-main group-hover:text-primary transition-colors">{doc.documentName}</p>
                                                <p className="text-[10px] text-text-muted">Uploaded {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : 'N/A'}</p>
                                            </div>
                                        </div>
                                        <a href={doc.documentUrl} className="p-2 bg-white hover:bg-primary/10 rounded-xl border border-border-subtle text-text-muted hover:text-primary transition-all">
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* System Info */}
                        <div className="card p-6 bg-bg-muted/50 border border-dashed border-border-subtle rounded-xl">
                            <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-4">Platform Info</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-text-muted">ID:</span>
                                    <code className="bg-white px-1.5 py-0.5 rounded border border-border-subtle">{currentCompany?.id}</code>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-text-muted">Created:</span>
                                    <span>{currentCompany?.createdAt ? new Date(currentCompany.createdAt).toLocaleDateString() : 'N/A'}</span>
                                </div>
                                {/* <div className="flex justify-between items-center text-xs">
                                    <span className="text-text-muted">Timezone:</span>
                                    <span>{currentCompany?.timezone || 'N/A'}</span>
                                </div> */}
                            </div>
                        </div>

                        {/* Assigned Numbers */}
                        <div className="card rounded-xl overflow-hidden border border-border-subtle">
                            <div className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-b border-border-subtle">
                                <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                                    <Phone className="w-5 h-5 text-primary" />
                                    Your Numbers
                                </h3>
                                <p className="text-xs text-text-muted mt-1">Active phone lines for this account</p>
                            </div>
                            <div className="p-4 max-h-[220px] overflow-y-auto space-y-3">
                                {[
                                    { number: "+1 (555) 000-1111", label: "Primary Business" },
                                    { number: "+44 20 7123 4567", label: "London Office" },
                                    { number: "+1 (555) 000-2222", label: "Customer Support" },
                                    { number: "+1 (555) 000-3333", label: "Sales Team" },
                                    { number: "+1 (555) 000-4444", label: "Emergency Line" },
                                    { number: "+1 (555) 000-5555", label: "Technical Support" }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-2 bg-bg-alt/30 rounded-xl border border-border-subtle/50 hover:border-primary/30 transition-all group">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white rounded-lg border border-border-subtle group-hover:text-primary transition-colors">
                                                <Phone className="w-3.5 h-3.5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-text-main">{item.number}</p>
                                                {/* <p className="text-[10px] text-text-muted">{item.label}</p> */}
                                            </div>
                                        </div>
                                        <div className="w-2 h-2 rounded-full bg-success/80 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                )
            }
            {/* Edit SideSheet */}
            <SideSheet
                isOpen={isEditSheetOpen}
                onClose={() => setIsEditSheetOpen(false)}
                title={currentCompany ? "Edit Company Profile" : "Create Company Profile"}
                size="md"
            >
                <div className="space-y-8 pb-10">
                    <div className="space-y-6">
                        <h4 className="text-xs font-black text-primary uppercase tracking-widest border-b border-primary/10 pb-2">General Overview</h4>

                        {/* Company Name */}
                        <div>
                            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                                Company Name
                            </label>
                            {/* {company ? (
                                <div className="input bg-bg-muted flex items-center px-4 h-11 text-text-muted border-dashed font-medium">
                                    {company.name}
                                </div>
                            ) : ( */}
                            <input
                                type="text"
                                value={editData.name}
                                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                className="input"
                                placeholder="Enter company name"
                            />
                            {/* )} */}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Detailed Description</label>
                            <textarea
                                value={editData.description}
                                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                className="input min-h-[160px] py-4 resize-none leading-relaxed"
                                placeholder="Describe your company, mission, and services..."
                            />
                        </div>

                        {/* Website */}
                        <div>
                            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Website URL</label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-3 w-5 h-5 text-text-muted" />
                                <input
                                    type="url"
                                    value={editData.contactInfo.website}
                                    onChange={(e) => setEditData({
                                        ...editData,
                                        contactInfo: { ...editData.contactInfo, website: e.target.value }
                                    })}
                                    className="input pl-10"
                                    placeholder="https://example.com"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-xs font-black text-primary uppercase tracking-widest border-b border-primary/10 pb-2">Contact Details</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Email</label>
                                <input
                                    type="email"
                                    value={editData.contactInfo.email}
                                    onChange={(e) => setEditData({
                                        ...editData,
                                        contactInfo: { ...editData.contactInfo, email: e.target.value }
                                    })}
                                    className="input"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Phone</label>
                                <input
                                    type="tel"
                                    value={editData.contactInfo.phone}
                                    onChange={(e) => setEditData({
                                        ...editData,
                                        contactInfo: { ...editData.contactInfo, phone: e.target.value }
                                    })}
                                    className="input"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 flex items-center gap-2">
                                <Lock className="w-3.5 h-3.5" />
                                Update Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={editData.password}
                                    onChange={(e) => setEditData({
                                        ...editData,
                                        password: e.target.value
                                    })}
                                    className="input pr-10"
                                    placeholder="Enter new password (optional)"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-text-muted hover:text-primary transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            <p className="text-[10px] text-text-muted mt-1.5 ml-1 italic">
                                Leave blank if you don't wish to change the user's password.
                            </p>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Physical Address</label>
                            <input
                                type="text"
                                value={editData.contactInfo.address}
                                onChange={(e) => setEditData({
                                    ...editData,
                                    contactInfo: { ...editData.contactInfo, address: e.target.value }
                                })}
                                className="input"
                                placeholder="Enter full physical address"
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-xs font-black text-primary uppercase tracking-widest border-b border-primary/10 pb-2">Documents</h4>

                        <div className="space-y-4">
                            {editData.documents.map((doc: any, index: number) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-bg-muted/30 rounded-lg border border-border-subtle">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-white rounded flex items-center justify-center border border-border-subtle font-bold text-[10px] text-primary uppercase">
                                            {doc.documentType}
                                        </div>
                                        <p className="text-sm font-medium text-text-main">{doc.documentName}</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            const newDocs = [...editData.documents];
                                            newDocs.splice(index, 1);
                                            setEditData({ ...editData, documents: newDocs });
                                        }}
                                        className="p-1.5 hover:bg-danger-soft text-text-muted hover:text-danger rounded-md transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}

                            <div className="relative">
                                <input
                                    type="file"
                                    id="doc-upload"
                                    className="hidden"
                                    multiple
                                    onChange={async (e) => {
                                        const files = Array.from(e.target.files || []);
                                        if (files.length === 0) return;

                                        try {
                                            setUploading(true);
                                            const response = await adminCustomerService.uploadFiles(files, {});

                                            const newDocs = response.files.map((f: any) => ({
                                                documentName: f.fileName,
                                                documentType: f.contentType?.split('/').pop() || f.fileName.split('.').pop()?.toLowerCase() || 'file',
                                                gcsKey: f.gcsKey,
                                                documentUrl: f.vapi?.url || '',
                                                uploadedAt: f.vapi?.createdAt || new Date().toISOString()
                                            }));

                                            setEditData({
                                                ...editData,
                                                documents: [...editData.documents, ...newDocs]
                                            });
                                            toast.success('Files uploaded successfully');
                                        } catch (error) {
                                            console.error('Upload error:', error);
                                            toast.danger('Failed to upload files');
                                        } finally {
                                            setUploading(false);
                                        }
                                    }}
                                />
                                <label
                                    htmlFor="doc-upload"
                                    className={`flex flex-col items-center justify-center p-8 border-2 border-dashed border-border-subtle rounded-2xl hover:border-primary/40 hover:bg-primary-soft/10 transition-all cursor-pointer ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
                                >
                                    {uploading ? (
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                            <p className="text-sm font-medium text-primary">Uploading files...</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="w-12 h-12 bg-primary-soft rounded-xl flex items-center justify-center mb-3">
                                                <Upload className="w-6 h-6 text-primary" />
                                            </div>
                                            <p className="text-sm font-bold text-text-main group-hover:text-primary transition-colors">Click to upload documents</p>
                                            <p className="text-xs text-text-muted mt-1">PDF, DOCX, or Images accepted</p>
                                        </>
                                    )}
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button type="button" className="btn btn-primary flex-1 rounded-xl"
                            onClick={handleSave}
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save All Changes'}
                        </button>
                        <button type="button"
                            className="btn btn-secondary rounded-xl"
                            onClick={() => setIsEditSheetOpen(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </SideSheet>
        </div>
    );
};

export default CustomerCompany;