import { useState } from "react";
import {
    Calendar,
    Zap,
    RotateCcw,
    Clock,
    Check,
    Loader2,
    CalendarDays
} from "lucide-react";
import { toast } from "@/hooks/useToast";

interface EditCampaignProps {
    campaign: any;
    onClose: () => void;
    onUpdate: (updatedCampaign: any) => void;
}

export function EditCampaign({ campaign, onClose, onUpdate }: EditCampaignProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: campaign.name,
        startDate: campaign.startDate ? campaign.startDate.split('T')[0] : "",
        endDate: campaign.endDate ? campaign.endDate.split('T')[0] : (campaign.startDate ? new Date(new Date(campaign.startDate).getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : ""),
        callsPerDay: campaign.settings?.callsPerDay || 5,
        followUps: campaign.settings?.followUps || 0,
        followUpDelays: campaign.settings?.followUpDelays || [],
        maxRetries: campaign.settings?.maxRetries || 3,
        startTime: campaign.settings?.startTime || "09:00",
        endTime: campaign.settings?.endTime || "17:00",
        selectedDays: campaign.settings?.selectedDays || ["Mon", "Tue", "Wed", "Thu", "Fri"]
    });

    const [callsPerDay, setCallsPerDay] = useState(5);
    const [followUps, setFollowUps] = useState(1);
    const [followUpDelays, setFollowUpDelays] = useState<number[]>([1]);
    const [startTime, setStartTime] = useState("09:00");
    const [endTime, setEndTime] = useState("17:00");

    const handleDayToggle = (day: string) => {
        setFormData(prev => ({
            ...prev,
            selectedDays: prev.selectedDays.includes(day)
                ? prev.selectedDays.filter((d: string) => d !== day)
                : [...prev.selectedDays, day]
        }));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 800));
            const updated = {
                ...campaign,
                name: formData.name,
                startDate: formData.startDate,
                endDate: formData.endDate,
                settings: {
                    ...campaign.settings,
                    callsPerDay: formData.callsPerDay,
                    followUps: formData.followUps,
                    followUpDelays: formData.followUpDelays,
                    maxRetries: formData.maxRetries,
                    startTime: formData.startTime,
                    endTime: formData.endTime,
                    selectedDays: formData.selectedDays
                }
            };
            onUpdate(updated);
            toast.success("Campaign updated successfully");
            onClose();
        } catch (error) {
            console.error(error);
            toast.danger("Failed to update campaign");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Header / Name Edit */}
            <div className="space-y-2">
                <label className="text-xs font-bold px-1">Campaign Name</label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input w-full"
                />
            </div>

            <div className="space-y-3">
                {/* Period Section */}



                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest pl-1">Calls/Day</label>
                    <select
                        value={callsPerDay}
                        onChange={(e) => setCallsPerDay(parseInt(e.target.value))}
                        className="w-full bg-bg border border-border-subtle rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
                    >
                        <option value={1} >1</option>
                        <option value={2} >2</option>
                        <option value={5} >5</option>
                        <option value={10} >10</option>
                        <option value={20} >20</option>
                        <option value={50} >50</option>
                        <option value={100} >100</option>
                    </select>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest pl-1">Follow Ups</label>
                        <select
                            value={followUps}
                            onChange={(e) => {
                                const val = parseInt(e.target.value);
                                setFollowUps(val);
                                // Adjust delays array to match count
                                setFollowUpDelays(prev => {
                                    const newDelays = [...prev];
                                    if (val > prev.length) {
                                        for (let i = prev.length; i < val; i++) newDelays.push(1);
                                    } else {
                                        return newDelays.slice(0, val);
                                    }
                                    return newDelays;
                                });
                            }}
                            className="w-full bg-bg border border-border-subtle rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
                        >
                            <option value={0}>No Follow Up</option>
                            <option value={1}>1 Follow Up</option>
                            <option value={2}>2 Follow Ups</option>
                            <option value={3}>3 Follow Ups</option>
                        </select>
                    </div>


                </div>

                <div>
                    {followUps > 0 && (
                        <div className="w-[full] space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                            <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest pl-1">Follow-up Schedule (Days)</label>

                            {followUpDelays.map((delay, index) => (
                                <div key={index} className="flex items-center gap-3 bg-bg-alt/30 p-2 rounded-xl border border-border-subtle/50">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">
                                        #{index + 1}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[12px] text-text-muted">Wait</span>
                                        <input
                                            type="number"
                                            min={1}
                                            value={delay}
                                            onChange={(e) => {
                                                const newVal = parseInt(e.target.value) || 1;
                                                const newDelays = [...followUpDelays];
                                                newDelays[index] = newVal;
                                                setFollowUpDelays(newDelays);
                                            }}
                                            className="w-16 px-2 py-1 bg-white border border-border-subtle rounded-lg text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary"
                                        />
                                        <span className="text-[12px] text-text-muted">days after {index === 0 ? 'the initial call' : `follow-up #${index}`}</span>
                                    </div>
                                </div>
                            ))}

                        </div>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest pl-1">Timing (Start)</label>
                        <input
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="w-full bg-bg border border-border-subtle rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest pl-1">Timing (End)</label>
                        <input
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="w-full bg-bg border border-border-subtle rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <label className="text-xs font-bold ">Start Date</label>
                        <input
                            type="date"
                            value={formData.startDate}
                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            className="input w-full"
                            disabled
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold ">End Date</label>
                        <input
                            type="date"
                            value={formData.endDate}
                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                            className="input w-full"
                            disabled
                        />
                        <span className="text-[10px] text-text-subtle">End date will be updated automatically</span>

                    </div>
                </div>


            </div>

            <div className="flex gap-4">
                <button
                    onClick={onClose}
                    className="flex-1 px-4 py-3 rounded-2xl border border-border-subtle text-xs font-bold text-text-main hover:bg-bg transition-all"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex-[2] btn btn-primary py-3 rounded-2xl flex items-center justify-center gap-2 shadow-glow"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : ""}
                    {loading ? "Updating..." : "Save Changes"}
                </button>
            </div>
        </div>
    );
}
