import { useState } from "react"
import {
    CreditCard,
    Calendar,
    Zap,
    CheckCircle2,
    Clock,
    Download,
    Search,
    ChevronRight,
    ArrowUpRight,
    Trophy,
    ShieldCheck,
    History
} from "lucide-react"

function Billing() {
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

    return (
        <div className="pb-10">
            <div className="space-y-8">
                {/* Header */}
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
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Current Plan Card */}
                    <div className="lg:col-span-2 card p-6 border border-border-subtle relative overflow-hidden">
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
                                    <span>Renews On</span>
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

                        <div className="flex items-center justify-between">
                            <div className="flex gap-4">
                                <button className="text-sm font-bold text-text-main hover:text-primary transition-colors flex items-center gap-1">
                                    Change Plan
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                                <button className="text-sm font-bold text-danger hover:underline transition-colors">
                                    Cancel Subscription
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Payment Method Card */}
                    <div className="card p-6 border border-border-subtle flex flex-col">
                        <h3 className="text-sm font-semibold text-text-main mb-6 flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-primary" />
                            Payment Method
                        </h3>

                        <div className="bg-bg-alt/50 rounded-2xl p-4 border border-border-subtle mb-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-10 h-6 bg-text-main/10 rounded flex items-center justify-center">
                                    <span className="text-[10px] font-bold text-text-main uppercase">{subscriptionData.card_details.brand}</span>
                                </div>
                                <button className="text-xs font-bold text-primary hover:underline">Edit</button>
                            </div>
                            <div className="space-y-1">
                                <p className="text-text-main font-bold tracking-widest text-lg">
                                    •••• •••• •••• {subscriptionData.card_details.last4}
                                </p>
                                <p className="text-xs text-text-muted">
                                    Expires {subscriptionData.card_details.exp_month}/{subscriptionData.card_details.exp_year}
                                </p>
                            </div>
                        </div>

                        <div className="mt-auto space-y-3">
                            <div className="flex items-center gap-3 text-sm text-text-muted">
                                <ShieldCheck className="w-4 h-4 text-success" />
                                <span>Secured by Stripe</span>
                            </div>
                            <button className="w-full btn btn-outline py-2.5 text-xs">
                                Add Backup Method
                            </button>
                        </div>
                    </div>
                </div>

                <div className="card p-4">
                    {/* Billing History */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                                Billing History
                            </h3>
                            <div className="relative">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                                <input
                                    type="text"
                                    placeholder="Search invoices..."
                                    className="input py-2 pl-9 text-sm w-64"
                                />
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
            </div>
        </div>
    )
}

export default Billing