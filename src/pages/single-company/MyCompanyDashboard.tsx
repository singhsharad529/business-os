import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { SideSheet } from '../../components/SideSheet';
import { Building2, FileText, Edit3, ExternalLink, Globe, Mail, Fingerprint, Upload, X } from 'lucide-react';
import { Company, CompanyDocument, User } from '../../types';
import voiceBotService from '@/api/voicebotService';
import DashboardLoader from '@/components/common/DashboardLoader';
import { toast } from '@/hooks/useToast';

// Static documents removed as we now use real company documents

export function MyCompanyDashboard() {
    const { user, setUser } = useAuth();

    const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
    const [companyLoading, setCompanyLoading] = useState(false);
    const [company, setCompany] = useState<Company | null>(null);
    const [loading, setLoading] = useState(false);

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
        documents: []
    });
    const [uploading, setUploading] = useState(false);

    const getCompanyDetails = async () => {
        try {
            setCompanyLoading(true);
            const response = await voiceBotService.getProfile({});

            if (response && response.companies && response.companies.length > 0) {
                const companyData = response.companies[0];
                setCompany(companyData);
                setEditData({
                    name: companyData.name || '',
                    description: companyData.description || '',
                    contactInfo: {
                        email: companyData.contactInfo?.email || response.user?.email || '',
                        phone: companyData.contactInfo?.phone || '',
                        address: companyData.contactInfo?.address || '',
                        website: companyData.contactInfo?.website || ''
                    },
                    taxId: companyData.taxId || '',
                    foundedDate: companyData.foundedDate || '',
                    documents: companyData.documents || []
                });
            }
        } catch (error) {
            console.error('Error fetching company details:', error);
        } finally {
            setCompanyLoading(false);
        }
    };

    const handleSave = async () => {

        try {
            console.log('Saving company data:', editData);
            let response;
            setLoading(true);

            const cleanValue = (val: any) => (val && typeof val === 'string' && val.trim() !== '' ? val : null);

            const contactInfo = {
                email: cleanValue(editData.contactInfo.email) || cleanValue(user?.email),
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

            if (company) {
                // Update existing company
                response = await voiceBotService.updateCompany(payload, {});
                console.log('Company updated:', response);
            } else {
                // Create new company
                response = await voiceBotService.createCompany(payload, {});
                console.log('Company created:', response);
                if (response) {
                    toast.success('Company created successfully');
                    setIsEditSheetOpen(false);
                    if (user) {
                        const newUser: User = { ...user, companyId: response.id };
                        setUser(newUser);
                        localStorage.setItem('businessos_user', JSON.stringify(newUser));
                    }
                }
            }

            // Refresh details
            await getCompanyDetails();
            setIsEditSheetOpen(false);
        } catch (error) {
            console.error('Error saving company:', error);
            toast.danger('Error saving company');
        }

        setLoading(false);

    };

    useEffect(() => {
        getCompanyDetails();
    }, []);


    return (
        <>
            <div className="space-y-6 my-2">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-text-main">Company Profile</h1>
                        <p className="text-text-muted mt-1">Detailed overview of your organization</p>
                    </div>
                    <button
                        className="btn btn-primary flex items-center gap-1.5"
                        onClick={() => setIsEditSheetOpen(true)}
                    >
                        {company ? <Edit3 className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                        {company ? 'Edit Details' : 'Create Company'}
                    </button>
                </div>

                {
                    companyLoading ? (
                        <DashboardLoader />

                    ) :
                        (
                            <div className=''>
                                {
                                    company ? (
                                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                            {/* Main Content (Left/Center) */}
                                            <div className="lg:col-span-8 space-y-6">
                                                {/* Hero Card */}
                                                <div className="card rounded-xl p-6 border border-border-subtle hover:shadow-glow hover:-translate-y-0.5 transition-all">
                                                    <div className="absolute top-0 right-0 p-4 opacity-5">
                                                        <Building2 className="w-24 h-24" />
                                                    </div>
                                                    <div className="flex flex-col md:flex-row gap-6 relative z-10">
                                                        <div className="w-20 h-20 bg-primary-soft rounded-xl flex items-center justify-center text-primary font-bold text-4xl shadow-inner border border-primary/20">
                                                            {company.logo || <Building2 className="w-12 h-12" />}
                                                        </div>
                                                        <div className="flex-1 space-y-2">
                                                            <div className="flex items-center gap-3">
                                                                <h2 className="text-3xl font-bold text-text-main">{company.name}</h2>
                                                                <span className="badge badge-success px-4 py-1">Active</span>
                                                            </div>
                                                            <div className="flex flex-wrap gap-4 text-text-muted">
                                                                <div className="flex items-center gap-1.5 bg-bg px-2.5 py-1 rounded-full border border-border-subtle">
                                                                    <Globe className="w-4 h-4 text-primary" />
                                                                    <a href={company.contactInfo?.website} target="_blank" rel="noopener noreferrer" className="text-sm hover:text-primary transition-colors">
                                                                        {company.contactInfo?.website?.replace('https://', '').replace('http://', '') || 'No website'}
                                                                    </a>
                                                                </div>
                                                                <div className="flex items-center gap-1.5 bg-bg px-2.5 py-1 rounded-full border border-border-subtle">
                                                                    <Building2 className="w-4 h-4 text-primary" />
                                                                    <span className="text-sm capitalize">{company.industry?.replace('_', ' ') || 'General'}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* About Section */}
                                                <div className="card rounded-xl p-6 border border-border-subtle hover:shadow-glow hover:-translate-y-0.5 transition-all">
                                                    <h3 className="text-xl font-bold text-text-main mb-4 flex items-center gap-2">
                                                        About {company.name}
                                                    </h3>
                                                    <p className="text-text-muted leading-relaxed whitespace-pre-wrap">
                                                        {company.description || "No description provided yet."}
                                                    </p>
                                                </div>

                                                {/* Quick Stats/Details Grid */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-4 card rounded-xl p-6 border border-border-subtle hover:shadow-glow hover:-translate-y-0.5 transition-all">
                                                        <h4 className="text-sm font-bold text-text-muted uppercase tracking-wider flex items-center gap-2">
                                                            <Mail className="w-4 h-4" /> Contact Information
                                                        </h4>
                                                        <div className="space-y-3">
                                                            <div className='w-full text-left px-4 py-3 bg-primary-soft/30 hover:bg-primary-soft/50 rounded-lg transition-colors text-sm font-medium text-text-main'>
                                                                <p className="text-xs text-text-muted">Email Address</p>
                                                                <p className="text-sm font-medium">{company.contactInfo?.email || 'Not specified'}</p>
                                                            </div>
                                                            <div className='w-full text-left px-4 py-3 bg-primary-soft/30 hover:bg-primary-soft/50 rounded-lg transition-colors text-sm font-medium text-text-main'>
                                                                <p className="text-xs text-text-muted">Phone Number</p>
                                                                <p className="text-sm font-medium">{company.contactInfo?.phone || 'Not specified'}</p>
                                                            </div>
                                                            <div className='w-full text-left px-4 py-3 bg-primary-soft/30 hover:bg-primary-soft/50 rounded-lg transition-colors text-sm font-medium text-text-main'>
                                                                <p className="text-xs text-text-muted">Physical Address</p>
                                                                <p className="text-sm font-medium">{company.contactInfo?.address || 'Not specified'}</p>
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
                                                                <p className="text-sm font-medium">{company.taxId || 'Not specified'}</p>
                                                            </div>
                                                            <div className='p-3 bg-bg/50 rounded-lg'>
                                                                <p className="text-xs text-text-muted">Founded Year</p>
                                                                <p className="text-sm font-medium">{company.foundedDate ? new Date(company.foundedDate).getFullYear() : 'Not specified'}</p>
                                                            </div>
                                                            <div className='p-3 bg-bg/50 rounded-lg'>
                                                                <p className="text-xs text-text-muted">Currency</p>
                                                                <p className="text-sm font-medium">{company.currency || 'USD'}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Sidebar (Right) */}
                                            <div className="lg:col-span-4 space-y-6">
                                                {/* Important Documents */}
                                                <div className="card overflow-hidden">
                                                    <div className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-b border-border-subtle">
                                                        <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                                                            <FileText className="w-5 h-5 text-primary" />
                                                            Documents
                                                        </h3>
                                                        <p className="text-xs text-text-muted mt-1">Official company records</p>
                                                    </div>
                                                    <div className="p-6 space-y-4">
                                                        {company.documents && company.documents.length > 0 ? (
                                                            company.documents.map((doc: CompanyDocument, index: number) => (
                                                                <div key={index} className="group flex gap-2 items-center justify-between p-4 bg-bg rounded-2xl border border-border-subtle hover:border-primary/40 hover:shadow-soft transition-all cursor-default">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center border border-border-subtle group-hover:scale-105 transition-transform">
                                                                            <span className="text-[10px] font-black text-primary uppercase">{doc.documentType}</span>
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-sm font-bold text-text-main group-hover:text-primary transition-colors">{doc.documentName}</p>
                                                                            {doc.uploadedAt && <p className="text-[10px] text-text-muted">Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}</p>}
                                                                        </div>
                                                                    </div>
                                                                    <a href={doc.documentUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-white hover:bg-primary-soft rounded-xl border border-border-subtle text-text-muted hover:text-primary transition-all">
                                                                        <ExternalLink className="w-4 h-4" />
                                                                    </a>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="text-center py-8 border-2 border-dashed border-border-subtle rounded-2xl">
                                                                <FileText className="w-8 h-8 text-text-muted mx-auto mb-2 opacity-20" />
                                                                <p className="text-xs text-text-muted">No documents uploaded yet</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* System Info */}
                                                <div className="card p-6 bg-bg-muted/50 border-dashed">
                                                    <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-4">Platform Info</h3>
                                                    <div className="space-y-3">
                                                        <div className="flex justify-between items-center text-xs">
                                                            <span className="text-text-muted">ID:</span>
                                                            <code className="bg-white px-1.5 py-0.5 rounded border border-border-subtle">{company.id}</code>
                                                        </div>
                                                        <div className="flex justify-between items-center text-xs">
                                                            <span className="text-text-muted">Created:</span>
                                                            <span>{new Date(company.createdAt).toLocaleDateString()}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center text-xs">
                                                            <span className="text-text-muted">Timezone:</span>
                                                            <span>{company.timezone || 'UTC'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (

                                        <div
                                            className="flex flex-col items-center justify-center min-h-[500px]"
                                        >
                                            <h2 className="text-2xl font-semibold">No company details found.</h2>
                                            <p className="text-text-muted">Please create a company to start using the voicebot</p>
                                        </div>
                                    )
                                }
                            </div>
                        )
                }
            </div>

            {/* Edit SideSheet */}
            <SideSheet
                isOpen={isEditSheetOpen}
                onClose={() => setIsEditSheetOpen(false)}
                title={company ? "Edit Company Profile" : "Create Company Profile"}
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
                                            const response = await voiceBotService.uploadFiles(files, {});

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
                        <button type="submit" className="btn btn-primary flex-1 rounded-xl"
                            onClick={handleSave}>
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
        </>
    );
}
