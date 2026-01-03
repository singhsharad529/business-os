import { useEffect, useState } from "react"
import { Phone, Mail, User, Calendar, Plus, Trash2, Activity, Edit2, X, ChevronRight, MessageSquare, Clock, Loader2 } from "lucide-react"
import voiceBotService from "@/api/voicebotService"
import { toast } from "@/hooks/useToast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockCallSessions } from "@/data/mockData"
import { CallDetails } from "@/components/voicebot/CallDetails"
import SideSheetLoader from "@/components/common/SideSheetLoader"
import { Lead } from "@/types/voicebotTypes"
import { AlertDialog } from "@/components/ui/AlertDialog"


interface LeadDetailsProps {
    leadId: string;
    onUpdate?: () => void;
    onDelete?: (leadId: string) => void;
    onClose: () => void;
}

export function LeadDetails({ leadId, onUpdate, onDelete, onClose }: LeadDetailsProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [leadFromApi, setLeadFromApi] = useState<Lead | null>(null);
    const [editedLead, setEditedLead] = useState<Lead | null>(null);
    const [attributes, setAttributes] = useState<{ key: string, value: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedCall, setSelectedCall] = useState<any>(null);
    const [activeTab, setActiveTab] = useState("overview");

    const [leadCalls, setLeadCalls] = useState<any[]>([]);

    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState<boolean>(false);
    const [leadToDelete, setLeadToDelete] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState<boolean>(false);



    const fetchLead = async () => {
        try {
            setLoading(true);
            const response = await voiceBotService.getLead(leadId, {});
            console.log(response);
            setLeadFromApi(response.lead);
            setEditedLead(response.lead);
            if (response.lead.attributes) {
                setAttributes(Object.entries(response.lead.attributes).map(([key, value]) => ({ key, value: String(value) })));
            } else {
                setAttributes([]);
            }
            setLeadCalls(response.calls);
        } catch (error) {
            console.error(error);
            toast.danger("Failed to fetch lead details");
        } finally {
            setLoading(false);
        }
    };


    const handleSave = async () => {
        try {
            setLoading(true);
            const payload = {
                leadName: editedLead?.leadName,
                leadEmail: editedLead?.leadEmail,
                leadPhoneNumber: editedLead?.leadPhoneNumber,
                leadCompany: editedLead?.leadCompany,
                leadExpertiseDomain: editedLead?.leadExpertiseDomain,
            };

            await voiceBotService.updateLead(leadId, payload, {});
            toast.success("Lead details updated successfully");
            setIsEditing(false);
            if (onUpdate) onUpdate();
            await fetchLead();
        } catch (error) {
            console.error(error);
            toast.danger("Failed to update leadFromApi");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteOpen = () => {
        setLeadToDelete(leadId);
        setIsDeleteAlertOpen(true);
    };
    const handleDelete = async () => {
        if (!leadToDelete) return;
        try {
            setDeleteLoading(true);
            await voiceBotService.deleteLead(leadToDelete, {});
            toast.success("lead deleted successfully");
            if (onUpdate) onUpdate();
            onClose();
        } catch (error) {
            console.error(error);
            toast.danger("Failed to delete lead");
        } finally {
            setDeleteLoading(false);
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



    useEffect(() => {
        fetchLead();
    }, []);

    return (
        <>
            <div className="space-y-6">
                {/* Header section with profile summary */}
                {
                    loading ? (
                        <SideSheetLoader />
                    ) : (
                        <div>
                            {
                                leadFromApi && editedLead ? (
                                    <div className="space-y-6">
                                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/5 via-accent/5 to-transparent border border-border-subtle p-6 mb-2">
                                            <div className="relative z-10">
                                                <div>
                                                    <div className="flex items-center gap-5">
                                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white shadow-glow">
                                                            <User className="w-8 h-8" />
                                                        </div>
                                                        <div>
                                                            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-strong to-accent">
                                                                {isEditing ? editedLead.leadName : leadFromApi?.leadName}
                                                            </h2>
                                                            <div className="flex items-center gap-3 mt-1 text-sm text-text-muted font-medium">
                                                                <span className="flex items-center gap-1.5">
                                                                    <Mail className="w-3.5 h-3.5" />
                                                                    {isEditing ? editedLead.leadEmail : leadFromApi?.leadEmail}
                                                                </span>
                                                                <span className="w-1 h-1 rounded-full bg-border-muted" />
                                                                <span className="flex items-center gap-1.5">
                                                                    <Phone className="w-3.5 h-3.5" />
                                                                    {isEditing ? editedLead.leadPhoneNumber : leadFromApi?.leadPhoneNumber}
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

                                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                            <div className="flex text-center justify-between">
                                                <TabsList className="bg-bg-alt/40 border border-border-subtle p-1 mb-4 rounded-2xl overflow-hidden shadow-soft">
                                                    <TabsTrigger value="overview" className="flex-1 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-soft">
                                                        <User className="w-4 h-4 mr-2" />
                                                        Details
                                                    </TabsTrigger>
                                                    <TabsTrigger value="calls" className="flex-1 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-soft">
                                                        <MessageSquare className="w-4 h-4 mr-2" />
                                                        Calls ({leadCalls.length})
                                                    </TabsTrigger>
                                                </TabsList>

                                                {activeTab === 'overview' && (
                                                    <div>
                                                        <button
                                                            onClick={() => {
                                                                if (isEditing) setEditedLead(leadFromApi);
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
                                                )}
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
                                                            <div className="p-3 bg-white/60 rounded-xl border border-border-subtle/50 text-text-main font-medium shadow-sm">{leadFromApi.leadName}</div>
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
                                                            <div className="p-3 bg-white/60 rounded-xl border border-border-subtle/50 text-text-main font-medium shadow-sm">{leadFromApi.leadEmail}</div>
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
                                                            <div className="p-3 bg-white/60 rounded-xl border border-border-subtle/50 text-text-main font-medium shadow-sm">{leadFromApi.leadPhoneNumber}</div>
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
                                                            <div className="p-3 bg-white/60 rounded-xl border border-border-subtle/50 text-text-main font-medium shadow-sm">{leadFromApi.leadCompany || 'N/A'}</div>
                                                        )}
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.1em] px-1">Expertise Domain</label>
                                                        {isEditing ? (
                                                            <input
                                                                type="text"
                                                                className="input"
                                                                value={editedLead.leadExpertiseDomain}
                                                                onChange={e => setEditedLead({ ...editedLead, leadExpertiseDomain: e.target.value })}
                                                            />
                                                        ) : (
                                                            <div className="p-3 bg-white/60 rounded-xl border border-border-subtle/50 text-text-main font-medium shadow-sm">{leadFromApi.leadExpertiseDomain || 'N/A'}</div>
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
                                                            className="btn btn-primary flex-1 rounded-xl"
                                                        >
                                                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Profile Changes"}
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex justify-end">
                                                        <button
                                                            onClick={handleDeleteOpen}
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
                                                            className="inline-flex items-center gap-2 px-3 rounded-lg text-primary text-sm font-bold transition-all mb-2"
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
                                                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 duration-200 ${call.status === 'customer-ended-call' || call.status === 'assistant-ended-call' || call.status === 'completed' ? 'bg-success/10 text-success' :
                                                                                    call.status === 'customer-did-not-answer' || call.status === 'customer-busy' || call.status === 'customer-rejected' ? 'bg-amber-500/10 text-amber-600' :
                                                                                        call.status === 'ended-with-error' || call.status === 'failed' ? 'bg-danger/10 text-danger' :
                                                                                            'bg-text-muted/10 text-text-muted'
                                                                                    }`}>
                                                                                    <Phone className="w-6 h-6" />
                                                                                </div>
                                                                                <div>
                                                                                    <div className="text-base font-bold text-text-main flex items-center gap-2">
                                                                                        {call.type === 'inboundPhoneCall' ? 'Inbound' : 'Outbound'} Call
                                                                                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest ${call.status === 'customer-ended-call' || call.status === 'assistant-ended-call' || call.status === 'completed' ? 'bg-success/10 text-success' :
                                                                                            call.status === 'customer-did-not-answer' || call.status === 'customer-busy' || call.status === 'customer-rejected' ? 'bg-amber-500/10 text-amber-600' :
                                                                                                call.status === 'ended-with-error' || call.status === 'failed' ? 'bg-danger/10 text-danger' :
                                                                                                    'bg-text-muted/10 text-text-muted'
                                                                                            }`}>
                                                                                            {call.status?.split('-').join(' ')}
                                                                                        </span>
                                                                                    </div>
                                                                                    <div className="text-xs text-text-muted flex items-center gap-3 mt-1 font-medium">
                                                                                        <span className="flex items-center gap-1">
                                                                                            <Calendar className="w-3.5 h-3.5" />
                                                                                            {call.startedAt ? new Date(call.startedAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'Pending'}
                                                                                        </span>
                                                                                        {(call.durationSeconds > 0 || call.durationMinutes > 0) && (
                                                                                            <span className="flex items-center gap-1">
                                                                                                <Clock className="w-3.5 h-3.5" />
                                                                                                {call.durationMinutes > 1 ? `${Math.floor(call.durationMinutes)}m ` : ''}
                                                                                                {Math.round(call.durationSeconds % 60)}s
                                                                                            </span>
                                                                                        )}
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
                                ) :
                                    (
                                        <div className="flex items-center justify-center h-full">
                                            <p className="text-text-muted font-medium">Failed to load lead details</p>
                                        </div>
                                    )
                            }

                        </div>
                    )
                }
            </div>

            <AlertDialog
                isOpen={isDeleteAlertOpen}
                onClose={() => setIsDeleteAlertOpen(false)}
                onConfirm={handleDelete}
                title="Delete Lead"
                description="Are you sure you want to delete this lead? This action cannot be undone and will remove the lead from your list."
                confirmText="Delete Lead"
                isLoading={deleteLoading}
            />
        </>
    );
}
