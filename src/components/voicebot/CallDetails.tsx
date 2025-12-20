import { useState } from "react";
import { User, Bot, Clock, Calendar, MessageSquare, List, Play, Pause, Volume2 } from "lucide-react";

interface CallDetailsProps {
    call: any; // Using any for now, but should be properly typed
}

export function CallDetails({ call }: CallDetailsProps) {
    const [playingIndex, setPlayingIndex] = useState<number | null>(null);

    const dummyTranscript = [
        { role: 'bot', text: 'Hello, I am your AI assistant calling from Business OS. Am I speaking with ' + call.customerName + '?' },
        { role: 'user', text: 'Yes, this is ' + call.customerName + '. How can I help you?' },
        { role: 'bot', text: 'I am calling to follow up on your interest in our voicebot solutions. Do you have a few minutes to talk?' },
        { role: 'user', text: 'Actually, I was just looking into that. How does it integrate with my CRM?' },
        { role: 'bot', text: 'We have seamless integrations with most major CRMs. Our AI can automatically log call summaries and update lead statuses.' },
        { role: 'user', text: 'That sounds useful. Can you send me some documentation?' },
        { role: 'bot', text: 'Absolutely! I will send the technical documentation to your registered email right away.' },
    ];

    const dummyVoiceForm = [
        { label: 'Customer Name', value: call.customerName },
        { label: 'Customer Mobile', value: call.customerMobile },
        { label: 'Intent', value: call.intent },
        { label: 'Sentiment', value: call.sentiment },
        { label: 'Duration', value: `${Math.floor(call.duration / 60)}m ${call.duration % 60}s` },
        { label: 'Call Status', value: call.status },
        { label: 'Follow-up Required', value: 'Yes' },
        { label: 'Language', value: 'English' },
    ];

    return (
        <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-bg rounded-xl p-3 border border-border-subtle flex flex-col items-center">
                    <Clock className="w-4 h-4 text-primary mb-1" />
                    <span className="text-[10px] text-text-muted">Duration</span>
                    <span className="text-xs font-semibold">{Math.floor(call.duration / 60)}m {call.duration % 60}s</span>
                </div>
                <div className="bg-bg rounded-xl p-3 border border-border-subtle flex flex-col items-center">
                    <MessageSquare className="w-4 h-4 text-accent mb-1" />
                    <span className="text-[10px] text-text-muted">Sentiment</span>
                    <span className="text-xs font-semibold capitalize">{call.sentiment}</span>
                </div>
                <div className="bg-bg rounded-xl p-3 border border-border-subtle flex flex-col items-center">
                    <Calendar className="w-4 h-4 text-success mb-1" />
                    <span className="text-[10px] text-text-muted">Date</span>
                    <span className="text-xs font-semibold">{new Date(call.createdAt).toLocaleDateString()}</span>
                </div>
            </div>

            {/* Transcript */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="text-md font-semibold text-text-main">Call Transcript</h3>
                </div>
                <div className="space-y-4">
                    {dummyTranscript.map((msg, index) => {
                        const isPlaying = playingIndex === index;
                        return (
                            <div key={index} className={`flex gap-3 ${msg.role === 'bot' ? 'flex-row' : 'flex-row-reverse'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'bot' ? 'bg-primary/20 text-primary' : 'bg-accent/20 text-accent'
                                    }`}>
                                    {msg.role === 'bot' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                                </div>
                                <div className="flex flex-col gap-1 max-w-[85%]">
                                    <div className={`relative group rounded-2xl p-3 text-sm ${msg.role === 'bot'
                                        ? 'bg-bg border border-border-subtle rounded-tl-none'
                                        : 'bg-primary text-white rounded-tr-none shadow-soft'
                                        }`}>
                                        <div className="flex justify-between items-start gap-4">
                                            <span>{msg.text}</span>
                                            <button
                                                onClick={() => setPlayingIndex(isPlaying ? null : index)}
                                                className={`p-1.5 rounded-full transition-all flex-shrink-0 ${msg.role === 'bot'
                                                    ? 'hover:bg-primary/10 text-primary'
                                                    : 'hover:bg-white/20 text-white'
                                                    }`}
                                            >
                                                {isPlaying ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
                                            </button>
                                        </div>

                                        {/* Mock Audio Visualizer */}
                                        {isPlaying && (
                                            <div className="mt-3 flex items-end gap-[2px] h-4">
                                                {[...Array(20)].map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className={`w-1 rounded-full animate-bounce ${msg.role === 'bot' ? 'bg-primary' : 'bg-white'
                                                            }`}
                                                        style={{
                                                            height: `${Math.random() * 100}%`,
                                                            animationDelay: `${i * 0.05}s`,
                                                            animationDuration: '0.6s'
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className={`flex items-center gap-1.5 text-[10px] text-text-muted mt-0.5 ${msg.role === 'bot' ? 'flex-row' : 'flex-row-reverse'
                                        }`}>
                                        <Volume2 className="w-2.5 h-2.5" />
                                        <span>0:0{index + 2}s</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Voice Form Data */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                        <List className="w-4 h-4 text-accent" />
                    </div>
                    <h3 className="text-md font-semibold text-text-main">Extracted Information</h3>
                </div>
                <div className="bg-bg rounded-2xl border border-border-subtle overflow-hidden">
                    <div className="grid grid-cols-1 divide-y divide-border-subtle">
                        {dummyVoiceForm.map((item, index) => (
                            <div key={index} className="flex justify-between items-center p-4 hover:bg-white/50 transition-colors">
                                <span className="text-sm text-text-muted">{item.label}</span>
                                <span className="text-sm font-medium text-text-main capitalize">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
