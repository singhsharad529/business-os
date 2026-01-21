import { ArrowUpRight, Calendar, CheckCircle2, Clock, Download, Search, Trophy, Zap, Upload, FileSpreadsheet, Trash2, Check, X } from 'lucide-react'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import Modal from '@/components/common/Modal'
import { toast } from '@/hooks/useToast'
import apiService from '@/api/apiService'

function CustomerBilling() {
    const { id } = useParams();
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [billingFile, setBillingFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);


    // Dummy Subscription Data
    const [subscriptionData] = useState({
        _id: "67d600d9b3cd44519fc96dc0",
        user_id: "67d600d5f526229dd3f7ed94",
        customer_id: "cus_RwxFRecadV79t8",
        subscription_id: "sub_1R33KjRplxpkMbN58FuwWgq3",
        plan: "Premium",
        frequency: "annually",
        auto_pay: true,
        account_valid: true,
        valid_plan_start: "2025-03-15T22:36:09.624Z",
        valid_plan_end: "2026-03-15T22:37:37.954Z",
        warning: false,
        warning_countdown: "2026-03-13T22:37:37.954Z",
        card_details: {
            last4: "4242",
            brand: "visa",
            exp_month: 4,
            exp_year: 2027
        },
        transactions: [
            {
                "transaction_id": "in_1R33KjRplxpkMbN5gNyM1I1Q",
                "amount": 200,
                "date": "2025-03-15T22:37:33.000Z",
                "status": "paid",
                "plan": "Premium",
                "frequency": "annually",
                "_id": "67d60131b3cd44519fc96dec"
            }
        ]
    });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    const handleImportBilling = async () => {
        if (!billingFile) return;
        try {
            setIsUploading(true);
            const formData = new FormData();
            formData.append("file", billingFile);

            // Assuming the endpoint for importing billing data
            await apiService.post(`admin/users/${id}/billing/import`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success("Billing data imported successfully");
            setIsImportModalOpen(false);
            setBillingFile(null);
            // In a real application, you would trigger a re-fetch of the billing data here
        } catch (error) {
            console.error('Import error:', error);
            toast.danger("Failed to import billing data");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className='space-y-4'>
            {/* Subscription Overview */}
            <div className="card rounded-xl hover:shadow-glow hover:-translate-y-0.5 transition-all grid grid-cols-1 lg:grid-cols-1 gap-6">
                {/* Current Plan Card */}
                <div className="lg:col-span-1 p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4">
                        <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border border-primary/20">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Active
                        </div>
                    </div>

                    <div className="flex items-start gap-4 mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                            <Trophy className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Current Plan</h3>
                            <div className="flex items-baseline gap-2">
                                <h2 className="text-3xl font-bold text-text-main">{subscriptionData.plan}</h2>
                                <span className="text-text-muted">/ {subscriptionData.frequency}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6 mb-6 border-b border-border-subtle">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-text-muted text-sm">
                                <Calendar className="w-4 h-4" />
                                <span>Plan Started</span>
                            </div>
                            <p className="text-text-main font-medium">{formatDate(subscriptionData.valid_plan_start)}</p>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-text-muted text-sm">
                                <Clock className="w-4 h-4" />
                                <span>Ends On</span>
                            </div>
                            <p className="text-text-main font-medium">{formatDate(subscriptionData.valid_plan_end)}</p>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-text-muted text-sm">
                                <Zap className="w-4 h-4" />
                                <span>Auto-Renewal</span>
                            </div>
                            <p className="text-primary font-medium">{subscriptionData.auto_pay ? 'Enabled' : 'Disabled'}</p>
                        </div>
                    </div>
                </div>


            </div>

            <div className="card rounded-xl p-4 border border-border-subtle hover:shadow-glow hover:-translate-y-0.5 transition-all">
                {/* Billing History */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                            Billing History
                        </h3>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsImportModalOpen(true)}
                                className="btn btn-primary flex items-center gap-2"
                            >
                                <Upload className="w-4 h-4" />
                                Upload Billing
                            </button>
                            <div className="relative">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                                <input
                                    type="text"
                                    placeholder="Search invoices..."
                                    className="input py-2 pl-9 text-sm w-64"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="card overflow-hidden border border-border-subtle">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-bg-alt/50 border-b border-border-subtle">
                                    <th className="px-6 py-4 text-left text-xs font-bold text-text-muted ">Invoice ID</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-text-muted ">Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-text-muted ">Plan</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-text-muted ">Amount</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-text-muted ">Status</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-text-muted ">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-subtle">
                                {subscriptionData.transactions.map((tx) => (
                                    <tr key={tx._id} className="hover:bg-bg-alt/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-medium text-text-main">#{tx.transaction_id.slice(-8).toUpperCase()}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-text-muted">{formatDate(tx.date)}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-text-main font-medium">{tx.plan} ({tx.frequency})</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-bold text-text-main">${tx.amount.toFixed(2)}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-success/10 text-success border border-success/20">
                                                {tx.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-primary hover:text-primary-dark p-2 hover:bg-primary/5 rounded-lg transition-all group">
                                                <Download className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-center">
                        <button className="text-sm text-primary font-bold hover:underline flex items-center gap-1">
                            Load more history
                            <ArrowUpRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Import Billing Modal */}
            <Modal
                isOpen={isImportModalOpen}
                onClose={() => {
                    setIsImportModalOpen(false);
                    setBillingFile(null);
                }}
                title="Import Billing History"
                size="md"
            >
                <div className="space-y-6">
                    {!billingFile ? (
                        <div className="flex flex-col items-center justify-center border-2 border-dashed border-border-subtle rounded-2xl p-10 bg-bg-alt/20 hover:bg-bg-alt/40 transition-all group cursor-pointer relative">
                            <input
                                type="file"
                                accept=".xlsx, .xls, .csv"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        setBillingFile(e.target.files[0]);
                                    }
                                }}
                            />
                            <div className="w-12 h-12 bg-primary-soft rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform mb-4">
                                <Upload className="w-6 h-6" />
                            </div>
                            <div className="text-sm font-bold text-text-main">Click to upload or drag & drop</div>
                            <div className="text-xs text-text-muted mt-1">Excel or CSV files (max. 10MB)</div>
                        </div>
                    ) : (
                        <div className="bg-bg-alt/30 rounded-2xl p-4 border border-border-subtle flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2">
                            <div className="w-12 h-12 bg-success-soft rounded-xl flex items-center justify-center text-success">
                                <FileSpreadsheet className="w-6 h-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-bold text-text-main truncate">{billingFile.name}</div>
                                <div className="text-xs text-text-muted">{(billingFile.size / 1024 / 1024).toFixed(2)} MB</div>
                            </div>
                            <button
                                onClick={() => setBillingFile(null)}
                                className="w-8 h-8 rounded-full hover:bg-danger-soft hover:text-danger flex items-center justify-center transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => {
                                setIsImportModalOpen(false);
                                setBillingFile(null);
                            }}
                            className="flex-1 px-4 py-3 rounded-xl border border-border-subtle text-sm font-bold text-text-main hover:bg-bg-alt transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={!billingFile || isUploading}
                            onClick={handleImportBilling}
                            className="flex-[2] btn btn-primary py-3 rounded-xl flex items-center justify-center gap-2"
                        >
                            {isUploading ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Check className="w-4 h-4" />
                            )}
                            {isUploading ? 'Importing...' : 'Confirm Import'}
                        </button>
                    </div>

                    <div className="p-4 rounded-xl bg-primary-soft/10 border border-primary-soft/20">
                        <div className="flex gap-3 text-xs text-text-muted leading-relaxed">
                            <div className="text-primary mt-0.5">•</div>
                            <div>Importing a billing file will update the client's billing history and plan details.</div>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default CustomerBilling