import { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Upload, FileText, Trash2, Calendar, DollarSign, Building2, Loader2 } from 'lucide-react'
import { toast } from '@/hooks/useToast'
import adminCustomerService from '@/api/adminCustomerService'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { InvoiceStatus } from './AddInvoice'

interface EditInvoiceProps {
    selectedInvoice: any;
    onClose: () => void;
    onSuccess: () => void;
}

function EditInvoice({ selectedInvoice, onClose, onSuccess }: EditInvoiceProps) {
    const [date, setDate] = useState<Date | null>(null);
    const [amount, setAmount] = useState<string>('');
    const [planName, setPlanName] = useState<string>('');
    const [status, setStatus] = useState<InvoiceStatus>(InvoiceStatus.PENDING);
    const [invoiceFile, setInvoiceFile] = useState<File | null>(null);
    const [existingFileUrl, setExistingFileUrl] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialize form with selected invoice data
    useEffect(() => {
        if (selectedInvoice) {
            setDate(selectedInvoice.date ? new Date(selectedInvoice.date) : new Date());
            setAmount(selectedInvoice.amount?.toString() || '');
            setPlanName(selectedInvoice.planName || '');
            setStatus(selectedInvoice.status || InvoiceStatus.PENDING);
            setExistingFileUrl(selectedInvoice.invoiceFileUrl || null);
        }
    }, [selectedInvoice]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!date || !amount || !planName) {
            toast.danger("Please fill in all required fields");
            return;
        }

        // If no new file is selected and no existing file, require a file
        if (!invoiceFile && !existingFileUrl) {
            toast.danger("Please upload an invoice file");
            return;
        }

        try {
            setIsSubmitting(true);
            const formData = new FormData();
            formData.append('date', date.toISOString().split('T')[0]);
            formData.append('amount', amount);
            formData.append('planName', planName);
            formData.append('status', status);

            // Only append file if a new one is selected
            if (invoiceFile) {
                formData.append('invoiceFile', invoiceFile);
            }

            await adminCustomerService.updateInvoice(selectedInvoice.id, formData, {});

            toast.success("Invoice updated successfully");
            onSuccess();
        } catch (error) {
            console.error('Error updating invoice:', error);
            toast.danger("Failed to update invoice");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!selectedInvoice) {
        return (
            <div className="flex items-center justify-center p-8">
                <p className="text-text-muted">No invoice selected</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4 p-4">
                    {/* Date Input */}
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-text-main block">
                            Date <span className="text-danger">*</span>
                        </label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                            <DatePicker
                                selected={date}
                                onChange={(date) => setDate(date)}
                                className="input w-full pl-10"
                                dateFormat="MM/dd/yyyy"
                                required
                            />
                        </div>
                    </div>

                    {/* Amount Input */}
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-text-main block">
                            Amount <span className="text-danger">*</span>
                        </label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                            <input
                                type="number"
                                step="0.01"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="input w-full pl-10"
                                placeholder="0.00"
                                required
                            />
                        </div>
                    </div>

                    {/* Plan Name Input */}
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-text-main block">
                            Plan Name <span className="text-danger">*</span>
                        </label>
                        <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                            <input
                                type="text"
                                value={planName}
                                onChange={(e) => setPlanName(e.target.value)}
                                className="input w-full pl-10"
                                placeholder="Enter plan name"
                                required
                            />
                        </div>
                    </div>

                    {/* Status Select */}
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-text-main block">
                            Status <span className="text-danger">*</span>
                        </label>
                        <Select
                            value={status}
                            onValueChange={(value) => setStatus(value as InvoiceStatus)}
                        >
                            <SelectTrigger className="w-full border-border-subtle text-sm">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={InvoiceStatus.PENDING}>PENDING</SelectItem>
                                <SelectItem value={InvoiceStatus.PAID}>PAID</SelectItem>
                                <SelectItem value={InvoiceStatus.FAILED}>FAILED</SelectItem>
                                <SelectItem value={InvoiceStatus.CANCELLED}>CANCELLED</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Invoice File Upload */}
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-text-main block">
                            Invoice File {!existingFileUrl && <span className="text-danger">*</span>}
                        </label>
                        {invoiceFile ? (
                            <div className="bg-bg-alt/30 rounded-2xl p-4 border border-border-subtle flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2">
                                <div className="w-12 h-12 bg-success-soft rounded-xl flex items-center justify-center text-success">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-bold text-text-main truncate">{invoiceFile.name}</div>
                                    <div className="text-xs text-text-muted">{(invoiceFile.size / 1024 / 1024).toFixed(2)} MB</div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setInvoiceFile(null)}
                                    className="w-8 h-8 rounded-full hover:bg-danger-soft hover:text-danger flex items-center justify-center transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ) : existingFileUrl ? (
                            <div className="space-y-2">
                                <div className="bg-bg-alt/30 rounded-2xl p-4 border border-border-subtle flex items-center gap-4">
                                    <div className="w-12 h-12 bg-primary-soft rounded-xl flex items-center justify-center text-primary">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-bold text-text-main">Current Invoice File</div>
                                        <a
                                            href={existingFileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-primary hover:underline"
                                        >
                                            View current file
                                        </a>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center justify-center border-2 border-dashed border-border-subtle rounded-2xl p-6 bg-bg-alt/20 hover:bg-bg-alt/40 transition-all group cursor-pointer relative">
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                setInvoiceFile(e.target.files[0]);
                                                setExistingFileUrl(null);
                                            }
                                        }}
                                    />
                                    <div className="w-10 h-10 bg-primary-soft rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform mb-3">
                                        <Upload className="w-5 h-5" />
                                    </div>
                                    <div className="text-xs font-bold text-text-main">Click to replace file</div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center border-2 border-dashed border-border-subtle rounded-2xl p-8 bg-bg-alt/20 hover:bg-bg-alt/40 transition-all group cursor-pointer relative">
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setInvoiceFile(e.target.files[0]);
                                        }
                                    }}
                                    required
                                />
                                <div className="w-12 h-12 bg-primary-soft rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform mb-4">
                                    <Upload className="w-6 h-6" />
                                </div>
                                <div className="text-sm font-bold text-text-main">Click to upload or drag & drop</div>
                                <div className="text-xs text-text-muted mt-1">PDF, DOC, DOCX, JPG, PNG (max. 10MB)</div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex gap-4 p-4 pt-0">
                    <button
                        type="submit"
                        disabled={isSubmitting || !date || !amount || !planName}
                        className="flex-[2] btn btn-primary py-3 rounded-xl flex items-center justify-center gap-2 shadow-glow"
                    >
                        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                        {isSubmitting ? 'Updating...' : 'Update Invoice'}
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

export default EditInvoice
