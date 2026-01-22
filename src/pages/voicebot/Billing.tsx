import { Calendar, CheckCircle2, Clock, Download, Search, Trophy, Zap, Upload, Trash2, Edit2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from '@/hooks/useToast'
import adminCustomerService from '@/api/adminCustomerService'
import TableLoader from '@/components/common/TableLoader'
import { Skeleton } from '@/components/ui/skeleton'
import voiceBotService from '@/api/voicebotService'



function CustomerBilling() {
    const { id } = useParams();
    const [allInvoices, setAllInvoices] = useState<any>(null);
    const [invoicesLoading, setInvoicesLoading] = useState<boolean>(false);
    const [planLoading, setPlanLoading] = useState<boolean>(false);
    const [planDetails, setPlanDetails] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const [isAddInvoiceSheetOpen, setIsAddInvoiceSheetOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

    const [deleteInvoiceLoading, setDeleteInvoiceLoading] = useState<boolean>(false);
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState<boolean>(false);
    const [isEditInvoiceSheetOpen, setIsEditInvoiceSheetOpen] = useState<boolean>(false);
    const [isUpdatePlanSheetOpen, setIsUpdatePlanSheetOpen] = useState<boolean>(false);
    const [selectedPlan, setSelectedPlan] = useState<any>(null);


    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }


    const filteredInvoices = allInvoices?.filter((invoice: any) => {
        if (!searchTerm) {
            return allInvoices;
        }
        return invoice?.invoiceId?.toLowerCase().includes(searchTerm.toLowerCase()) || invoice?.planName?.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const fetchPlanDetails = async () => {
        try {
            setPlanLoading(true);
            const response = await voiceBotService.getPlanDetails({});
            setPlanDetails(response)

        } catch (error) {
            toast.danger("Failed to get plan details");
        }
        finally {
            setPlanLoading(false);
        }
    }

    const fetchCustomerInvoices = async () => {
        try {
            setInvoicesLoading(true);
            const response = await voiceBotService.getInvoices({});
            if (response.invoices) {
                setAllInvoices(response.invoices);
            }
        } catch (error) {
            toast.danger("Failed to get invoices");
        }
        finally {
            setInvoicesLoading(false);
        }
    }

    useEffect(() => {
        fetchCustomerInvoices();
        fetchPlanDetails();
    }, [])

    const deleteCustomerInvoice = async () => {
        try {
            setDeleteInvoiceLoading(true);
            await adminCustomerService.deleteInvoice(selectedInvoice.id, {});
            toast.success("Invoice deleted successfully");
            setIsDeleteAlertOpen(false);
            setSelectedInvoice(null);
            fetchCustomerInvoices();
        } catch (error) {
            toast.danger("Failed to delete invoice");
        }
        finally {
            setDeleteInvoiceLoading(false);
        }
    }

    const handleDelete = async (invoice: any) => {
        setSelectedInvoice(invoice);
        setIsDeleteAlertOpen(true);
    }


    return (
        <div>
            <div className='space-y-6'>
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-text-main">Billing & Subscription</h1>
                        <p className="text-text-muted mt-1">Manage your plan, payment methods, and view billing history</p>
                    </div>
                    {/* <button className="btn btn-primary flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        Upgrade Plan
                    </button> */}
                </div>

                {/* Subscription Overview */}
                {
                    planLoading ? (<Skeleton className='h-40 w-full rounded-xl' />) :
                        (
                            <div>
                                {
                                    planDetails ? (
                                        <div className="card rounded-xl hover:shadow-glow hover:-translate-y-0.5 transition-all grid grid-cols-1 lg:grid-cols-1 gap-6">
                                            {/* Current Plan Card */}
                                            <div className="lg:col-span-1 p-6 relative overflow-hidden">
                                                <div className="absolute top-0 right-0 p-4 flex items-center justify-between gap-2">
                                                    <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border border-primary/20">
                                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                                        {planDetails?.planStatus}

                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-4 mb-8">
                                                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                                                        <Trophy className="w-8 h-8 text-primary" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Current Plan</h3>
                                                        <div className="flex items-baseline gap-2">
                                                            <h2 className="text-3xl font-bold text-text-main">{planDetails?.planName || '---'}</h2>
                                                            <span className="text-text-muted">/ {planDetails?.planType || '---'}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6 mb-6 border-b border-border-subtle">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 text-text-muted text-sm">
                                                            <Calendar className="w-4 h-4" />
                                                            <span>Plan Started</span>
                                                        </div>
                                                        <p className="text-text-main font-medium">{planDetails?.planStartDate ? formatDate(planDetails.planStartDate) : '---'}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 text-text-muted text-sm">
                                                            <Clock className="w-4 h-4" />
                                                            <span>Ends On</span>
                                                        </div>
                                                        <p className="text-text-main font-medium">{planDetails?.planEndDate ? formatDate(planDetails.planEndDate) : '---'}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 text-text-muted text-sm">
                                                            <Zap className="w-4 h-4" />
                                                            <span>Auto-Renewal</span>
                                                        </div>
                                                        <p className="text-primary font-medium">{planDetails?.planAutoRenew ? 'Enabled' : 'Disabled'}</p>
                                                    </div>
                                                </div>
                                            </div>


                                        </div>

                                    ) :
                                        (


                                            <div className="card p-6 rounded-xl hover:shadow-glow hover:-translate-y-0.5 transition-all grid grid-cols-1 lg:grid-cols-1 gap-0">
                                                <div className="flex justify-end">
                                                    <button className="btn btn-primary">Add Plan</button>
                                                </div>
                                                <div className="flex flex-col items-center justify-center h-50 gap-2 p-6">
                                                    <h3 className="text-lg font-bold text-text-muted">No plan details found</h3>

                                                </div>
                                            </div>
                                        )
                                }
                            </div>
                        )
                }

                {
                    invoicesLoading ? (<TableLoader rows={3} columns={5} />) : (
                        <div className="card rounded-xl p-4 border border-border-subtle hover:shadow-glow hover:-translate-y-0.5 transition-all">
                            {/* Billing History */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                                        Invoices History
                                    </h3>
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                                            <input
                                                type="text"
                                                placeholder="Search invoices..."
                                                className="input py-2 pl-9 text-sm w-64"
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="card overflow-x-auto border border-border-subtle">
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
                                            {filteredInvoices && filteredInvoices.length > 0 ? (
                                                filteredInvoices.map((invoice: any) => (
                                                    <tr key={invoice.id} className="hover:bg-bg-alt/30 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <span className="text-sm font-medium text-text-main">#{invoice.invoiceId}</span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="text-sm text-text-muted">{formatDate(invoice.date)}</span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="text-sm text-text-main font-medium capitalize">{invoice.planName}</span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="text-sm font-bold text-text-main">${invoice.amount.toFixed(2)}</span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${invoice.status === 'PAID' ? 'bg-success/10 text-success border-success/20' : 'bg-warning/10 text-warning border-warning/20'
                                                                }`}>
                                                                {invoice.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-2 py-4 text-right flex items-center gap-1 justify-end">

                                                            <a href={invoice.invoiceFileUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-dark p-2 hover:bg-primary/5 rounded-lg transition-all group inline-block">
                                                                <Download className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                                            </a>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={6} className="px-6 py-8 text-center text-text-muted">
                                                        No invoices found
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )
                }



            </div>

        </div>
    )
}

export default CustomerBilling