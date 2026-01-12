import { FC } from "react";
import {
    Building2,
    Mail,
    Globe,
    Fingerprint,
    FileText,
    ExternalLink,
} from "lucide-react";

interface CustomerCompanyProps {
    company: any;
    customerEmail: string;
    customerPhone: string;
}

const CustomerCompany: FC<CustomerCompanyProps> = ({ company, customerEmail, customerPhone }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
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
                                <h2 className="text-3xl font-bold text-text-main">{company.name}</h2>
                                {/* <span className="badge badge-success px-4 py-1">Active</span> */}
                            </div>
                            <div className="flex flex-wrap gap-4 text-text-muted">
                                <div className="flex items-center gap-1.5 bg-bg px-2.5 py-1 rounded-full border border-border-subtle">
                                    <Globe className="w-4 h-4 text-primary" />
                                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-sm hover:text-primary transition-colors">
                                        {company.website.replace('https://', '').replace('http://', '')}
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
                        {company.description}
                    </p>
                </div>

                {/* Quick Stats/Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4 card rounded-xl p-6 border border-border-subtle hover:shadow-glow hover:-translate-y-0.5 transition-all">
                        <h4 className="text-sm font-bold text-text-muted uppercase tracking-wider flex items-center gap-2">
                            <Mail className="w-4 h-4" /> Contact Information
                        </h4>
                        <div className="space-y-3">
                            <div className='w-full text-left px-4 py-3 bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors text-sm font-medium text-text-main'>
                                <p className="text-xs text-text-muted">Email Address</p>
                                <p className="text-sm font-medium">{customerEmail}</p>
                            </div>
                            <div className='w-full text-left px-4 py-3 bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors text-sm font-medium text-text-main'>
                                <p className="text-xs text-text-muted">Phone Number</p>
                                <p className="text-sm font-medium">{customerPhone}</p>
                            </div>
                            <div className='w-full text-left px-4 py-3 bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors text-sm font-medium text-text-main'>
                                <p className="text-xs text-text-muted">Physical Address</p>
                                <p className="text-sm font-medium">{company.address}</p>
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
                                <p className="text-sm font-medium">{company.taxId}</p>
                            </div>
                            <div className='p-3 bg-bg/50 rounded-lg'>
                                <p className="text-xs text-text-muted">Founded Year</p>
                                <p className="text-sm font-medium">{new Date(company.foundedDate).getFullYear()}</p>
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
                <div className="card rounded-xl overflow-hidden border border-border-subtle">
                    <div className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-b border-border-subtle">
                        <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                            <FileText className="w-5 h-5 text-primary" />
                            Documents
                        </h3>
                        <p className="text-xs text-text-muted mt-1">Official company records</p>
                    </div>
                    <div className="p-6 space-y-4">
                        {company.documents.map((doc: any, index: number) => (
                            <div key={index} className="group flex gap-2 items-center justify-between p-4 bg-bg rounded-2xl border border-border-subtle hover:border-primary/40 hover:shadow-soft transition-all cursor-default">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center border border-border-subtle group-hover:scale-105 transition-transform">
                                        <span className="text-[10px] font-black text-primary uppercase">{doc.documentType}</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-text-main group-hover:text-primary transition-colors">{doc.documentName}</p>
                                        <p className="text-[10px] text-text-muted">Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}</p>
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
    );
};

export default CustomerCompany;