import { useState } from "react"
import { Phone, Mail, User, Calendar, Plus, Trash2, Save, Activity, Edit2, X, ChevronRight, MessageSquare, Clock } from "lucide-react"
import { Lead } from "@/types/voicebotTypes"
import voiceBotService from "@/api/voicebotService"
import { toast } from "@/hooks/useToast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockCallSessions } from "@/data/mockData"
import { CallDetails } from "./CallDetails"

interface LeadDetailsProps {
    lead: Lead;
    onUpdate?: (updatedLead: Lead) => void;
    onDelete?: (leadId: string) => void;
    onClose: () => void;
}

export function LeadDetails({ lead: initialLead, onUpdate, onDelete, onClose }: LeadDetailsProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedLead, setEditedLead] = useState<Lead>(initialLead);
    const [attributes, setAttributes] = useState<{ key: string, value: string }[]>(
        Object.entries(initialLead.attributes || {}).map(([key, value]) => ({ key, value: String(value) }))
    );
    const [loading, setLoading] = useState(false);
    const [selectedCall, setSelectedCall] = useState<any>(null);

    // Filter calls for this lead (by phone)
    const leadCalls = mockCallSessions.filter(c => c.customerPhone === initialLead.leadPhoneNumber);

    const handleSave = async () => {
        try {
            setLoading(true);
            const attributeObj = attributes.reduce((acc, curr) => {
                if (curr.key.trim()) acc[curr.key.trim()] = curr.value;
                return acc;
            }, {} as Record<string, any>);

            const payload = {
                ...editedLead,
                attributes: attributeObj
            };

            await voiceBotService.updateLead(initialLead.id, payload, {});
            toast.success("Lead updated successfully");
            setIsEditing(false);
            if (onUpdate) onUpdate(payload);
        } catch (error) {
            console.error(error);
            toast.danger("Failed to update lead");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this lead?")) return;
        try {
            setLoading(true);
            await voiceBotService.deleteLead(initialLead.id, {});
            toast.success("Lead deleted successfully");
            if (onDelete) onDelete(initialLead.id);
            onClose();
        } catch (error) {
            console.error(error);
            toast.danger("Failed to delete lead");
        } finally {
            setLoading(false);
        }
    };

    const addAttribute = () => {
        setAttributes([...attributes, { key: "", value: "" }]);
    };

    const removeAttribute = (index: number) => {
        setAttributes(attributes.filter((_, i) => i !== index));
    };

    const updateAttribute = (index: number, field: 'key' | 'value', value: string) => {
        const newAttrs = [...attributes];
        newAttrs[index][field] = value;
        setAttributes(newAttrs);
    };

    return (
        <div className="space-y-6">
            {/* Header section with profile summary */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/5 via-accent/5 to-transparent border border-border-subtle p-6 mb-2">
                <div className="relative z-10">
                    <div>
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white shadow-glow">
                                <User className="w-8 h-8" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-strong to-accent">
                                    {isEditing ? editedLead.leadName : initialLead.leadName}
                                </h2>
                                <div className="flex items-center gap-3 mt-1 text-sm text-text-muted font-medium">
                                    <span className="flex items-center gap-1.5">
                                        <Mail className="w-3.5 h-3.5" />
                                        {isEditing ? editedLead.leadEmail : initialLead.leadEmail}
                                    </span>
                                    <span className="w-1 h-1 rounded-full bg-border-muted" />
                                    <span className="flex items-center gap-1.5">
                                        <Phone className="w-3.5 h-3.5" />
                                        {isEditing ? editedLead.leadPhoneNumber : initialLead.leadPhoneNumber}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>



                </div>

                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/10 rounded-full blur-3xl -ml-12 -mb-12" />
            </div>

            <Tabs defaultValue="overview" className="w-full">
                <div className="flex text-center justify-between">
                    <TabsList className="bg-bg-alt/40 border border-border-subtle p-1 mb-6 rounded-2xl overflow-hidden shadow-soft">
                        <TabsTrigger value="overview" className="flex-1 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-soft">
                            <User className="w-4 h-4 mr-2" />
                            Details
                        </TabsTrigger>
                        <TabsTrigger value="calls" className="flex-1 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-soft">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Calls ({leadCalls.length})
                        </TabsTrigger>
                    </TabsList>

                    <div>
                        <button
                            onClick={() => {
                                if (isEditing) setEditedLead(initialLead);
                                setIsEditing(!isEditing);
                            }}
                            className={`btn ${isEditing ? 'btn-secondary' : 'btn-primary'} !rounded-xl group shadow-sm`}
                        >
                            {isEditing ? (
                                <>
                                    <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
                                    Cancel
                                </>
                            ) : (
                                <>
                                    <Edit2 className="w-4 h-4 group-hover:-rotate-12 transition-transform duration-200" />
                                    Edit Profile
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <TabsContent value="overview" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 bg-white/40 backdrop-blur-sm rounded-3xl p-6 border border-border-subtle shadow-soft">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.1em] px-1">Full Name</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    className="input"
                                    value={editedLead.leadName}
                                    onChange={e => setEditedLead({ ...editedLead, leadName: e.target.value })}
                                />
                            ) : (
                                <div className="p-3 bg-white/60 rounded-xl border border-border-subtle/50 text-text-main font-medium shadow-sm">{initialLead.leadName}</div>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.1em] px-1">Email Address</label>
                            {isEditing ? (
                                <input
                                    type="email"
                                    className="input"
                                    value={editedLead.leadEmail}
                                    onChange={e => setEditedLead({ ...editedLead, leadEmail: e.target.value })}
                                />
                            ) : (
                                <div className="p-3 bg-white/60 rounded-xl border border-border-subtle/50 text-text-main font-medium shadow-sm">{initialLead.leadEmail}</div>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.1em] px-1">Phone Number</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    className="input"
                                    value={editedLead.leadPhoneNumber}
                                    onChange={e => setEditedLead({ ...editedLead, leadPhoneNumber: e.target.value })}
                                />
                            ) : (
                                <div className="p-3 bg-white/60 rounded-xl border border-border-subtle/50 text-text-main font-medium shadow-sm">{initialLead.leadPhoneNumber}</div>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.1em] px-1">Company</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    className="input"
                                    value={editedLead.leadCompany}
                                    onChange={e => setEditedLead({ ...editedLead, leadCompany: e.target.value })}
                                />
                            ) : (
                                <div className="p-3 bg-white/60 rounded-xl border border-border-subtle/50 text-text-main font-medium shadow-sm">{initialLead.leadCompany || 'N/A'}</div>
                            )}
                        </div>
                    </div>

                    {/* Attributes Section */}
                    <div className="bg-white/40 backdrop-blur-sm rounded-3xl p-6 border border-border-subtle shadow-soft">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-base font-bold text-text-main flex items-center gap-2">
                                <div className="p-1.5 bg-primary/10 rounded-lg">
                                    <Activity className="w-4 h-4 text-primary" />
                                </div>
                                Additional Attributes
                            </h3>
                            {isEditing && (
                                <button
                                    onClick={addAttribute}
                                    className="text-xs font-bold text-primary hover:text-primary-strong flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/20 bg-primary/5 transition-colors"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    Add Attribute
                                </button>
                            )}
                        </div>

                        <div className="space-y-3">
                            {attributes.length === 0 && !isEditing && (
                                <div className="text-center py-6">
                                    <p className="text-sm text-text-muted italic">No custom attributes added.</p>
                                </div>
                            )}
                            {attributes.map((attr, idx) => (
                                <div key={idx} className="flex gap-4 items-center animate-in fade-in slide-in-from-left-2 duration-300">
                                    <div className="flex-1">
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                placeholder="Key (e.g. Industry)"
                                                className="input h-10"
                                                value={attr.key}
                                                onChange={e => updateAttribute(idx, 'key', e.target.value)}
                                            />
                                        ) : (
                                            <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider bg-bg-alt/50 px-2.5 py-1.5 rounded-lg border border-border-subtle/50">{attr.key}</div>
                                        )}
                                    </div>
                                    <div className="flex-[2]">
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                placeholder="Value"
                                                className="input h-10"
                                                value={attr.value}
                                                onChange={e => updateAttribute(idx, 'value', e.target.value)}
                                            />
                                        ) : (
                                            <div className="text-sm text-text-main font-medium pl-1">{attr.value}</div>
                                        )}
                                    </div>
                                    {isEditing && (
                                        <button
                                            onClick={() => removeAttribute(idx)}
                                            className="p-2.5 bg-danger/5 hover:bg-danger/10 text-danger rounded-xl transition-colors border border-danger/10"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {isEditing ? (
                        <div className="flex gap-4">
                            <button
                                onClick={handleSave}
                                disabled={loading}
                                className="flex-1 btn btn-primary py-4 rounded-2xl flex items-center justify-center gap-3 shadow-glow-primary"
                            >
                                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
                                <span className="text-base">Save Profile Changes</span>
                            </button>
                        </div>
                    ) : (
                        <div className="flex justify-end pt-4">
                            <button
                                onClick={handleDelete}
                                className="text-xs font-bold text-danger/60 hover:text-danger flex items-center gap-1.5 px-4 py-2 rounded-xl hover:bg-danger/5 transition-all"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                Remove from Database
                            </button>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="calls" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {selectedCall ? (
                        <div className="space-y-4">
                            <button
                                onClick={() => setSelectedCall(null)}
                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-bold hover:bg-primary/20 transition-all mb-4"
                            >
                                <ChevronRight className="w-4 h-4 rotate-180" />
                                Back to Call List
                            </button>
                            <CallDetails call={selectedCall} />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {leadCalls.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 bg-white/40 border-2 border-dashed border-border-subtle rounded-3xl animate-pulse">
                                    <div className="p-4 bg-bg-alt rounded-2xl mb-4">
                                        <Phone className="w-10 h-10 text-text-muted opacity-40" />
                                    </div>
                                    <p className="text-text-muted font-medium">No recorded calls in history.</p>
                                    <p className="text-xs text-text-muted mt-1">Start a campaign to reach out to this lead.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {leadCalls.map((call, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => setSelectedCall(call)}
                                            className="group bg-white/60 hover:bg-white border border-border-subtle hover:border-primary/50 p-5 rounded-2xl transition-all duration-300 cursor-pointer shadow-soft hover:shadow-card hover:-translate-y-0.5"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 duration-200 ${call.status === 'Completed' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                                                        <Phone className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <div className="text-base font-bold text-text-main flex items-center gap-2">
                                                            ID: {call.sessionId.substring(0, 8)}...
                                                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest ${call.status === 'Completed' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                                                                {call.status}
                                                            </span>
                                                        </div>
                                                        <div className="text-xs text-text-muted flex items-center gap-3 mt-1 font-medium">
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="w-3.5 h-3.5" />
                                                                {call.startTime}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="w-3.5 h-3.5" />
                                                                {call.duration}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="p-2.5 rounded-xl bg-primary/5 text-primary opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                                    <ChevronRight className="w-5 h-5" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
