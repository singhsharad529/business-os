import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Calendar, Building2, Zap, Loader2 } from 'lucide-react'
import { toast } from '@/hooks/useToast'
import adminCustomerService from '@/api/adminCustomerService'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

export enum PlanStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    CANCELLED = 'CANCELLED',
    EXPIRED = 'EXPIRED'
}

interface UpdatePlanProps {
    selectedPlan: any;
    onClose: () => void;
    onSuccess: () => void;
}

function UpdatePlan({ selectedPlan, onClose, onSuccess }: UpdatePlanProps) {
    const { id } = useParams();
    const [planName, setPlanName] = useState<string>('');
    const [planType, setPlanType] = useState<string>('');
    const [planStartDate, setPlanStartDate] = useState<Date | null>(null);
    const [planEndDate, setPlanEndDate] = useState<Date | null>(null);
    const [planAutoRenew, setPlanAutoRenew] = useState<boolean>(false);
    const [planStatus, setPlanStatus] = useState<PlanStatus>(PlanStatus.ACTIVE);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialize form with selected plan data
    useEffect(() => {
        if (selectedPlan) {
            setPlanName(selectedPlan.planName || '');
            setPlanType(selectedPlan.planType || '');
            setPlanStartDate(selectedPlan.planStartDate ? new Date(selectedPlan.planStartDate) : null);
            setPlanEndDate(selectedPlan.planEndDate ? new Date(selectedPlan.planEndDate) : null);
            setPlanAutoRenew(selectedPlan.planAutoRenew || false);
            setPlanStatus(selectedPlan.planStatus || PlanStatus.ACTIVE);
        }
    }, [selectedPlan]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!planType || !planStartDate || !planEndDate) {
            toast.danger("Please fill in all required fields");
            return;
        }

        try {
            setIsSubmitting(true);
            const planData = {
                planName: planName || null,
                planType: planType,
                planStartDate: planStartDate.toISOString().split('T')[0],
                planEndDate: planEndDate.toISOString().split('T')[0],
                planAutoRenew: planAutoRenew,
                planStatus: planStatus
            };

            await adminCustomerService.updatePlan(id as string, planData, {});

            toast.success("Plan updated successfully");
            onSuccess();
        } catch (error) {
            console.error('Error updating plan:', error);
            toast.danger("Failed to update plan");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!selectedPlan) {
        return (
            <div className="flex items-center justify-center p-8">
                <p className="text-text-muted">No plan selected</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4 p-4">
                    {/* Plan Name Input */}
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-text-main block">
                            Plan Name
                        </label>
                        <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                            <input
                                type="text"
                                value={planName}
                                onChange={(e) => setPlanName(e.target.value)}
                                className="input w-full pl-10"
                                placeholder="Enter plan name"
                            />
                        </div>
                    </div>

                    {/* Plan Type Input */}
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-text-main block">
                            Plan Type <span className="text-danger">*</span>
                        </label>
                        <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                            <input
                                type="text"
                                value={planType}
                                onChange={(e) => setPlanType(e.target.value)}
                                className="input w-full pl-10"
                                placeholder="Enter plan type"
                                required
                            />
                        </div>
                    </div>

                    {/* Plan Start Date */}
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-text-main block">
                            Plan Start Date <span className="text-danger">*</span>
                        </label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                            <DatePicker
                                selected={planStartDate}
                                onChange={(date) => setPlanStartDate(date)}
                                className="input w-full pl-10"
                                dateFormat="MM/dd/yyyy"
                                required
                            />
                        </div>
                    </div>

                    {/* Plan End Date */}
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-text-main block">
                            Plan End Date <span className="text-danger">*</span>
                        </label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                            <DatePicker
                                selected={planEndDate}
                                onChange={(date) => setPlanEndDate(date)}
                                className="input w-full pl-10"
                                dateFormat="MM/dd/yyyy"
                                required
                            />
                        </div>
                    </div>

                    {/* Plan Status Select */}
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-text-main block">
                            Plan Status <span className="text-danger">*</span>
                        </label>
                        <Select
                            value={planStatus}
                            onValueChange={(value) => setPlanStatus(value as PlanStatus)}
                        >
                            <SelectTrigger className="w-full border-border-subtle text-sm">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={PlanStatus.ACTIVE}>ACTIVE</SelectItem>
                                <SelectItem value={PlanStatus.INACTIVE}>INACTIVE</SelectItem>
                                <SelectItem value={PlanStatus.CANCELLED}>CANCELLED</SelectItem>
                                <SelectItem value={PlanStatus.EXPIRED}>EXPIRED</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Auto Renewal Checkbox */}
                    <div className="flex items-center gap-3 pt-2">
                        <div className="flex items-center h-5">
                            <input
                                id="planAutoRenew"
                                type="checkbox"
                                checked={planAutoRenew}
                                onChange={(e) => setPlanAutoRenew(e.target.checked)}
                                className="w-4 h-4 text-primary border-border-subtle rounded focus:ring-primary focus:ring-offset-0 cursor-pointer transition-all duration-200"
                            />
                        </div>
                        <label
                            htmlFor="planAutoRenew"
                            className="text-sm font-medium text-text-main cursor-pointer select-none flex items-center gap-2"
                        >
                            <Zap className="w-4 h-4 text-text-muted" />
                            Auto-Renewal
                        </label>
                    </div>
                </div>

                <div className="flex gap-4 p-4 pt-0">
                    <button
                        type="submit"
                        disabled={isSubmitting || !planType || !planStartDate || !planEndDate}
                        className="flex-[2] btn btn-primary py-3 rounded-xl flex items-center justify-center gap-2 shadow-glow"
                    >
                        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                        {isSubmitting ? 'Updating...' : 'Update Plan'}
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

export default UpdatePlan
