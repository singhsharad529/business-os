import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { SideSheet } from '../../components/SideSheet';
import { Button } from '../../components/ui/button';
import { Building2, FileText, Plus, Trash2, Edit3, ExternalLink, Globe, Mail, Phone, MapPin, Calendar, Fingerprint } from 'lucide-react';
import { CompanyDocument } from '../../types';

export function MyCompanyDashboard() {
    const { user } = useAuth();
    const { companies, updateCompany } = useData();
    const company = companies.find(c => c.id === user?.companyId);

    const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
    const [editData, setEditData] = useState({
        description: company?.description || '',
        website: company?.website || '',
        contactEmail: company?.contactEmail || '',
        contactPhone: company?.contactPhone || '',
        address: company?.address || '',
        foundedDate: company?.foundedDate || '',
        taxId: company?.taxId || '',
    });
    const [editDocuments, setEditDocuments] = useState<CompanyDocument[]>(company?.documents || []);
    const [newDocName, setNewDocName] = useState('');
    const [newDocType, setNewDocType] = useState('PDF');

    if (!company) {
        return (
            <div className="flex items-center justify-center h-[400px]">
                <p className="text-text-muted">Company not found.</p>
            </div>
        );
    }

    const handleSave = () => {
        updateCompany(company.id, {
            ...editData,
            documents: editDocuments
        });
        setIsEditSheetOpen(false);
    };

    const addDocument = () => {
        if (!newDocName) return;
        const newDoc: CompanyDocument = {
            id: `d-${Date.now()}`,
            name: newDocName,
            type: newDocType,
            url: '#',
            uploadedAt: new Date().toISOString()
        };
        setEditDocuments([...editDocuments, newDoc]);
        setNewDocName('');
    };

    const removeDocument = (id: string) => {
        setEditDocuments(editDocuments.filter(d => d.id !== id));
    };

    return (
        <>
            <div className="space-y-6 my-2">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-text-main">Company Profile</h1>
                        <p className="text-text-muted mt-1">Detailed overview of your organization</p>
                    </div>
                    <button className="btn btn-primary flex items-center gap-1.5"
                        onClick={() => {
                            setEditData({
                                description: company.description || '',
                                website: company.website || '',
                                contactEmail: company.contactEmail || '',
                                contactPhone: company.contactPhone || '',
                                address: company.address || '',
                                foundedDate: company.foundedDate || '',
                                taxId: company.taxId || '',
                            });
                            setEditDocuments(company.documents || []);
                            setIsEditSheetOpen(true);
                        }}

                    >
                        <Edit3 className="w-4 h-4" />
                        Edit Details
                    </button>
                </div>

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
                                            <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-sm hover:text-primary transition-colors">
                                                {company.website?.replace('https://', '') || 'No website'}
                                            </a>
                                        </div>
                                        <div className="flex items-center gap-1.5 bg-bg px-2.5 py-1 rounded-full border border-border-subtle">
                                            <Building2 className="w-4 h-4 text-primary" />
                                            <span className="text-sm capitalize">{company.industry.replace('_', ' ')}</span>
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
                                        <p className="text-sm font-medium">{company.contactEmail || 'Not specified'}</p>
                                    </div>
                                    <div className='w-full text-left px-4 py-3 bg-primary-soft/30 hover:bg-primary-soft/50 rounded-lg transition-colors text-sm font-medium text-text-main'>
                                        <p className="text-xs text-text-muted">Phone Number</p>
                                        <p className="text-sm font-medium">{company.contactPhone || 'Not specified'}</p>
                                    </div>
                                    <div className='w-full text-left px-4 py-3 bg-primary-soft/30 hover:bg-primary-soft/50 rounded-lg transition-colors text-sm font-medium text-text-main'>
                                        <p className="text-xs text-text-muted">Physical Address</p>
                                        <p className="text-sm font-medium">{company.address || 'Not specified'}</p>
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
                                        <p className="text-sm font-medium">{company.currency}</p>
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
                                    company.documents.map((doc) => (
                                        <div key={doc.id} className="group flex items-center justify-between p-4 bg-bg rounded-2xl border border-border-subtle hover:border-primary/40 hover:shadow-soft transition-all cursor-default">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-border-subtle group-hover:scale-105 transition-transform">
                                                    <span className="text-[10px] font-black text-primary">{doc.type}</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-text-main group-hover:text-primary transition-colors">{doc.name}</p>
                                                    <p className="text-[10px] text-text-muted">Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <a href={doc.url} className="p-2.5 bg-white hover:bg-primary-soft rounded-xl border border-border-subtle text-text-muted hover:text-primary transition-all">
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="w-12 h-12 bg-bg rounded-full flex items-center justify-center mx-auto mb-3">
                                            <FileText className="w-6 h-6 text-text-muted opacity-20" />
                                        </div>
                                        <p className="text-sm text-text-muted">No documents found.</p>
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
                                    <span>{company.timezone}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
            {/* Edit SideSheet */}
            <SideSheet
                isOpen={isEditSheetOpen}
                onClose={() => setIsEditSheetOpen(false)}
                title="Edit Company Profile"
                size="md"
            >
                <div className="space-y-8 pb-10">
                    <div className="space-y-6">
                        <h4 className="text-xs font-black text-primary uppercase tracking-widest border-b border-primary/10 pb-2">General Overview</h4>

                        {/* Fixed Name */}
                        <div>
                            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Company Name (Read-only)</label>
                            <div className="input bg-bg-muted flex items-center px-4 h-11 text-text-muted border-dashed font-medium">
                                {company.name}
                            </div>
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
                                    value={editData.website}
                                    onChange={(e) => setEditData({ ...editData, website: e.target.value })}
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
                                    value={editData.contactEmail}
                                    onChange={(e) => setEditData({ ...editData, contactEmail: e.target.value })}
                                    className="input"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Phone</label>
                                <input
                                    type="tel"
                                    value={editData.contactPhone}
                                    onChange={(e) => setEditData({ ...editData, contactPhone: e.target.value })}
                                    className="input"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Headquarters Address</label>
                            <textarea
                                value={editData.address}
                                onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                                className="input h-20 py-2 resize-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-xs font-black text-primary uppercase tracking-widest border-b border-primary/10 pb-2">Administrative Info</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Tax ID</label>
                                <input
                                    type="text"
                                    value={editData.taxId}
                                    onChange={(e) => setEditData({ ...editData, taxId: e.target.value })}
                                    className="input"
                                    placeholder="VAT/Tax Number"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Founded Date</label>
                                <input
                                    type="date"
                                    value={editData.foundedDate}
                                    onChange={(e) => setEditData({ ...editData, foundedDate: e.target.value })}
                                    className="input"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-xs font-black text-primary uppercase tracking-widest border-b border-primary/10 pb-2">Documents</h4>

                        {/* Add New Doc */}
                        <div className="bg-bg-muted p-6 rounded-2xl border border-border-subtle shadow-inner">
                            <p className="text-[10px] font-bold text-text-muted mb-3 uppercase tracking-tighter">Add New Document</p>
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    placeholder="Document Label (e.g. Annual Audit)"
                                    className="input shadow-none"
                                    value={newDocName}
                                    onChange={(e) => setNewDocName(e.target.value)}
                                />
                                <div className="flex gap-2">
                                    <select
                                        className="input w-32 shadow-none"
                                        value={newDocType}
                                        onChange={(e) => setNewDocType(e.target.value)}
                                    >
                                        <option value="PDF">PDF</option>
                                        <option value="DOCX">DOCX</option>
                                        <option value="JPG">JPG</option>
                                        <option value="XLSX">XLSX</option>
                                    </select>
                                    <button
                                        onClick={addDocument}
                                        className="flex-1 btn btn-primary rounded-xl"
                                        disabled={!newDocName}
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Current Docs List */}
                        <div className="space-y-3">
                            {editDocuments.map((doc) => (
                                <div key={doc.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-border-subtle shadow-soft">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-bg rounded-xl flex items-center justify-center border border-border-subtle">
                                            <span className="text-[10px] font-black text-text-muted">{doc.type}</span>
                                        </div>
                                        <span className="text-sm font-bold text-text-main">{doc.name}</span>
                                    </div>
                                    <button
                                        onClick={() => removeDocument(doc.id)}
                                        className="p-2 text-danger hover:bg-danger/10 rounded-xl transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button type="submit" className="btn btn-primary flex-1 rounded-xl"
                            onClick={handleSave}>
                            Save All Changes
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

