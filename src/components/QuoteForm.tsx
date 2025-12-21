import { useState, useRef, useEffect } from 'react';
import { Upload, FileText, Sparkles, Check, AlertCircle, Trash2 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import type { Entity } from '../types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Quill from "quill";
import "quill/dist/quill.snow.css";

interface QuoteFormProps {
    entity?: Entity;
    onSave: () => void;
    onCancel: () => void;
}

export function QuoteForm({ entity, onSave, onCancel }: QuoteFormProps) {
    const { user } = useAuth();
    const { createEntity, updateEntity } = useData();

    const [activeTab, setActiveTab] = useState<'received' | 'created'>(
        (entity?.data?.type as 'received' | 'created') || 'received'
    );

    // Basic Info
    const [name, setName] = useState(entity?.name || '');
    const [status, setStatus] = useState(entity?.status || 'draft');
    const [amount, setAmount] = useState(entity?.data?.amount || 0);
    const [validUntil, setValidUntil] = useState(entity?.data?.validUntil ? new Date(entity?.data?.validUntil) : new Date());

    // Received Quote Specifics
    const [isExtracting, setIsExtracting] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [extractionComplete, setExtractionComplete] = useState(false);

    // Created Quote Specifics (Rich Text)
    const [description, setDescription] = useState(entity?.data?.items || '');
    const editorRef = useRef<HTMLDivElement>(null);
    const quillRef = useRef<Quill | null>(null);

    useEffect(() => {
        let quill: Quill | null = null;

        if (activeTab === 'created' && editorRef.current) {
            quill = new Quill(editorRef.current, {
                theme: 'snow',
                modules: {
                    toolbar: [
                        [{ 'header': [1, 2, false] }],
                        ['bold', 'italic', 'underline'],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        ['link', 'clean']
                    ]
                },
                placeholder: 'Start typing your professional quote details...'
            });

            quillRef.current = quill;

            // Set content and sync
            if (description) {
                quill.root.innerHTML = description;
            }

            quill.on('text-change', () => {
                setDescription(quill?.root.innerHTML || '');
            });
        }

        return () => {
            if (quill) {
                // Quill doesn't have a destroy() but we need to reset our ref
                // and the DOM will be cleaned up by React unmounting the container
                quillRef.current = null;
            }
        };
    }, [activeTab]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadedFile(file);
            simulateExtraction(file);
        }
    };

    const simulateExtraction = (file: File) => {
        setIsExtracting(true);
        setTimeout(() => {
            setIsExtracting(false);
            setExtractionComplete(true);
            setName(file.name.replace('.pdf', '') + ' - Extracted');
            setAmount(Math.floor(Math.random() * 5000) + 500);
            setStatus('pending');
            setDescription('Extracted items from quote: \n- Product A: $200\n- Service B: $300\n- License Fee: $100');
        }, 2000);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const quoteData = {
            amount,
            items: description,
            validUntil: validUntil.toISOString().split('T')[0],
            type: activeTab,
            fileName: uploadedFile?.name || entity?.data?.fileName,
        };

        if (entity) {
            updateEntity(entity.id, {
                name,
                status: status as any,
                data: quoteData,
            });
        } else if (user?.companyId) {
            createEntity({
                companyId: user.companyId,
                templateId: 'quotes',
                templateName: 'Quotes',
                name,
                status: status as any,
                createdBy: user.id,
                data: quoteData,
            });
        }

        onSave();
    };

    return (
        <div className="space-y-6">
            <Tabs defaultValue={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="received" className="flex items-center gap-2 py-3">
                        <Upload size={16} />
                        <span>Received Quote</span>
                    </TabsTrigger>
                    <TabsTrigger value="created" className="flex items-center gap-2 py-3">
                        <FileText size={16} />
                        <span>Created Quote</span>
                    </TabsTrigger>
                </TabsList>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <TabsContent value="received" className="space-y-4 outline-none">
                        {!uploadedFile && !entity ? (
                            <div className="border-2 border-dashed border-border rounded-xl p-10 flex flex-col items-center justify-center bg-bg/50 hover:bg-bg/80 transition-colors cursor-pointer group relative">
                                <input
                                    type="file"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    accept=".pdf"
                                    onChange={handleFileUpload}
                                />
                                <div className="bg-primary-soft text-primary p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                                    <Upload size={32} />
                                </div>
                                <h3 className="text-lg font-semibold text-text-main">Upload Quote PDF</h3>
                                <p className="text-text-muted text-sm text-center max-w-[250px] mt-2">
                                    Drag and drop your quote PDF here, or click to browse. AI will extract the data.
                                </p>
                            </div>
                        ) : (
                            <div className="bg-primary-soft/30 border border-primary/10 rounded-xl p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white p-2 rounded-lg shadow-sm">
                                        <FileText className="text-primary" size={24} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-text-main truncate max-w-[200px]">
                                            {uploadedFile?.name || entity?.data?.fileName}
                                        </div>
                                        <div className="text-xs text-text-muted">
                                            {(uploadedFile?.size ? (uploadedFile.size / 1024 / 1024).toFixed(2) : '0.5')} MB
                                        </div>
                                    </div>
                                </div>
                                {isExtracting ? (
                                    <div className="flex items-center gap-2 text-primary animate-pulse">
                                        <Sparkles size={16} />
                                        <span className="text-xs font-medium">Extracting...</span>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => { setUploadedFile(null); setExtractionComplete(false); }}
                                        className="p-2 hover:bg-danger-soft text-text-muted hover:text-danger rounded-lg transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        )}

                        {isExtracting && (
                            <div className="space-y-2">
                                <div className="h-2 w-full bg-border rounded-full overflow-hidden">
                                    <div className="h-full bg-primary animate-progress-indeterminate"></div>
                                </div>
                                <p className="text-[10px] text-center text-text-muted italic">Our AI is reading the line items and terms...</p>
                            </div>
                        )}

                        {extractionComplete && (
                            <div className="bg-success-soft/30 border border-success/10 rounded-lg p-3 flex items-center gap-2 mb-4">
                                <Check className="text-success" size={16} />
                                <span className="text-xs font-medium text-success">AI Data Extraction Successful! Please verify details below.</span>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="created" className="space-y-4 outline-none">
                        <div className="bg-warning-soft/20 border border-warning/10 rounded-lg p-3 flex items-center gap-2">
                            <AlertCircle className="text-warning" size={16} />
                            <span className="text-xs text-warning-dark font-medium">You are creating a professional quote for a client.</span>
                        </div>
                    </TabsContent>

                    {/* Common Fields */}
                    {(activeTab === 'created' || uploadedFile || entity) && (
                        <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-500">
                            <div className="col-span-2">
                                <label className="block text-xs font-medium text-text-main uppercase tracking-wider">
                                    Quote Name <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="input w-full bg-bg/50 focus:bg-white transition-all"
                                    placeholder="e.g., Office Supplies Quote - Jan 2024"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-text-main mb-1.5 uppercase tracking-wider">
                                    Total Amount <span className="text-danger">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">$</span>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(Number(e.target.value))}
                                        className="input w-full pl-7 bg-bg/50 focus:bg-white transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-text-main mb-1.5 uppercase tracking-wider">
                                    Valid Until <span className="text-danger">*</span>
                                </label>
                                <DatePicker
                                    selected={validUntil}
                                    onChange={(date) => setValidUntil(date || new Date())}
                                    className="input w-full bg-bg/50 focus:bg-white transition-all"
                                    dateFormat="MM/dd/yyyy"
                                    required
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-xs font-medium text-text-main mb-1.5 uppercase tracking-wider">
                                    {activeTab === 'received' ? 'Extracted Items / Notes' : 'Quote Items & Terms'}
                                </label>

                                {activeTab === 'created' ? (
                                    <div className="quill-editor-container border border-border rounded-xl overflow-hidden bg-white focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                                        <div ref={editorRef} className="min-h-[140px]" />
                                    </div>
                                ) : (
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="input w-full min-h-[120px] bg-bg/50 focus:bg-white transition-all text-sm leading-relaxed"
                                        placeholder="Describe items..."
                                    />
                                )}
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            className="btn btn-primary flex-1 font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
                            disabled={isExtracting || (!uploadedFile && !entity && activeTab === 'received')}
                        >
                            {entity ? 'Update' : 'Save'} Quote
                        </button>
                        <button type="button" onClick={onCancel} className="btn btn-secondary">
                            Cancel
                        </button>
                    </div>
                </form>
            </Tabs>

            <style>{`
        @keyframes indeterminate {
            0% { transform: translateX(-100%); width: 30%; }
            50% { transform: translateX(100%); width: 60%; }
            100% { transform: translateX(250%); width: 30%; }
        }
        .animate-progress-indeterminate {
            animation: indeterminate 2s infinite linear;
        }
        .ql-toolbar.ql-snow {
            border: none;
            border-bottom: 1px solid var(--border);
            padding: 8px;
            background: #f8fafc;
        }
        .ql-container.ql-snow {
            border: none;
            font-family: inherit;
            font-size: 0.875rem;
        }
        .ql-editor {
            min-height: 200px;
        }
      `}</style>
        </div>
    );
}
