import { User, Bot, Clock, Calendar, MessageSquare, List, Volume2 } from "lucide-react";

interface CallDetailsProps {
    call: any;
}

export function CallDetails({ call }: CallDetailsProps) {
    // Standardize system/bot/user roles
    const messages = call.messages || [];

    const infoItems = [
        { label: 'Customer', value: call.customer?.number || call.customerNumber },
        { label: 'AI Phone', value: call.phoneNumber },
        { label: 'Status', value: call.status || 'Ended' },
        { label: 'Cost', value: `$${call.cost || call.costBreakdown?.total || '0.00'}` },
        { label: 'Started At', value: call.startedAt ? new Date(call.startedAt).toLocaleString() : 'N/A' },
        { label: 'Ended At', value: call.endedAt ? new Date(call.endedAt).toLocaleString() : 'N/A' },
    ];

    return (
        <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-bg rounded-xl p-3 border border-border-subtle flex flex-col items-center">
                    <Clock className="w-4 h-4 text-primary mb-1" />
                    <span className="text-[10px] text-text-muted">Type</span>
                    <span className="text-[10px] font-semibold text-center leading-tight mt-1 truncate w-full">{call.type?.replace(/([A-Z])/g, ' $1').trim() || 'Call'}</span>
                </div>
                <div className="bg-bg rounded-xl p-3 border border-border-subtle flex flex-col items-center">
                    <Bot className="w-4 h-4 text-accent mb-1" />
                    <span className="text-[10px] text-text-muted">Status</span>
                    <span className="text-xs font-semibold capitalize">{call.status || 'Ended'}</span>
                </div>
                <div className="bg-bg rounded-xl p-3 border border-border-subtle flex flex-col items-center">
                    <Calendar className="w-4 h-4 text-success mb-1" />
                    <span className="text-[10px] text-text-muted">Date</span>
                    <span className="text-[10px] font-semibold">{call.startedAt ? new Date(call.startedAt).toLocaleDateString() : 'N/A'}</span>
                </div>
            </div>

            {/* AI Summary */}
            {call.summary && (
                <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Bot className="w-4 h-4 text-primary" />
                        </div>
                        <h3 className="text-sm font-semibold text-text-main">AI Case Summary</h3>
                    </div>
                    <div className="bg-bg rounded-2xl p-4 border border-border-subtle italic text-sm text-text-main leading-relaxed">
                        "{call.summary}"
                    </div>
                </div>
            )}

            {/* Transcript */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="text-sm font-semibold text-text-main">Full Transcript History</h3>
                </div>
                <div className="space-y-6">
                    {messages.filter((m: any) => m.role !== 'system').map((msg: any, index: number) => {
                        const isBot = msg.role === 'bot' || msg.role === 'assistant';

                        return (
                            <div key={index} className={`flex gap-3 ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isBot ? 'bg-primary/20 text-primary' : 'bg-accent/20 text-accent'}`}>
                                    {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                                </div>
                                <div className={`flex flex-col gap-1 max-w-[85%] ${isBot ? 'items-start' : 'items-end'}`}>
                                    <div className={`relative rounded-2xl p-3.5 text-sm leading-relaxed ${isBot
                                        ? 'bg-bg border border-border-subtle rounded-tl-none'
                                        : 'bg-primary text-white rounded-tr-none shadow-sm'
                                        }`}>
                                        <span>{msg.message}</span>
                                    </div>
                                    <div className="text-[10px] text-text-muted px-1">
                                        {msg.secondsFromStart ? `${msg.secondsFromStart.toFixed(1)}s` : msg.time ? new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Technical Logs */}
            <div className="space-y-4 pb-4">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                        <List className="w-4 h-4 text-accent" />
                    </div>
                    <h3 className="text-sm font-semibold text-text-main">Call Metadata</h3>
                </div>
                <div className="bg-bg rounded-2xl border border-border-subtle overflow-hidden">
                    <div className="grid grid-cols-1 divide-y divide-border-subtle">
                        {infoItems.map((item, index) => (
                            <div key={index} className="flex justify-between items-center px-4 py-3 hover:bg-white/50 transition-colors">
                                <span className="text-xs text-text-muted">{item.label}</span>
                                <span className="text-xs font-semibold text-text-main">{item.value || 'N/A'}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recording Audio Player */}
            {(call.stereoRecordingUrl || call.recordingUrl || call.recordings?.stereo) && (
                <div className="sticky bottom-0 bg-white border-t border-border-subtle p-4 -mx-6 mb--6 shadow-lg rounded-b-2xl">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <Volume2 className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] font-bold text-text-main uppercase tracking-wider">Play Call Recording</p>
                            <audio controls className="w-full h-8 mt-1.5 opacity-90">
                                <source src={call.stereoRecordingUrl || call.recordingUrl || call.recordings?.stereo} type="audio/wav" />
                            </audio>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
