import { useState, useRef, useEffect, useCallback } from 'react';
import { Sparkles, X, Send, MessageCircleX, Mic, MicOff } from 'lucide-react';


const SAMPLE_QUERIES = [
  'Show loans maturing soon',
  'Vendors with long lead time',
  'View overdue invoices',
  'Check quote status'
];

const mockResponses: Record<string, string> = {
  'loans maturing': 'I found 2 loans maturing in the next 30 days: L-2024-0089 (Sarah Mitchell) on Oct 15, 2029, and L-2024-0102 (James Anderson) on Nov 1, 2027.',
  'lead time': 'Based on your data, I found 2 vendors with lead times over 30 days: Global Electronics Ltd. (45 days) and Steel Suppliers Inc. (30 days).',
  'overdue': 'You have 1 overdue invoice: INV-2024-0156 from Steel Suppliers Inc. for $45,000, due on Dec 15, 2024.',
  'quote': 'You have 3 active quotes: 2 sent and 1 draft. The acceptance rate this month is 67%.',
  'default': 'I can help you with:\n- Finding records (e.g., "show loans maturing soon")\n- Analyzing data (e.g., "vendors with long lead times")\n- Creating records (e.g., "create a new quote")\n- Extracting data from documents\n\nWhat would you like to know?'
};

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    { role: 'assistant', content: 'Hello! I\'m your AI assistant. I can help you search records, extract data from documents, and provide insights. Try asking me something!' }
  ]);

  const handleSend = useCallback((text: string) => {
    if (!text.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: text }]);

    setTimeout(() => {
      const lowerQuery = text.toLowerCase();
      let response = mockResponses.default;

      for (const [key, value] of Object.entries(mockResponses)) {
        if (lowerQuery.includes(key)) {
          response = value;
          break;
        }
      }

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    }, 500);
  }, []);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onerror = (event: any) => {
        if (event.error === 'no-speech') {
          setIsListening(false);
          return;
        }
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleSend(transcript);
        setQuery('');
        setIsListening(false);
      };
    }
  }, [handleSend]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(query);
    setQuery('');
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-12 h-12 bg-gradient-to-r from-primary-strong via-primary to-accent text-white rounded-full shadow-glow flex items-center justify-center transition-all z-40 hover:scale-110 hover:shadow-card shadow-card"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-6 w-[400px] h-[520px] bg-white/95 backdrop-blur-lg rounded-xl shadow-card border border-border-subtle flex flex-col z-40">
          <div className='flex justify-between bg-gradient-to-r from-primary to-accent text-white rounded-t-xl shadow-soft opacity-95 px-4'>
            <div className="p-4 text-white rounded-t-xl shadow-soft opacity-90">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <h3 className="text-md text-white font-semibold">AI Assistant</h3>
              </div>
              <p className="text-sm mt-0.5">Ask me anything about your data</p>
            </div>
            <div className='mt-4'>
              <button onClick={() => setIsOpen(false)}>
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-white via-white to-bg/60">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-2.5 rounded-lg ${message.role === 'user'
                    ? 'bg-primary text-white shadow-glow'
                    : 'bg-white text-text-main shadow-soft border border-border-subtle'
                    }`}
                >
                  <p className="text-xs whitespace-pre-line">{message.content}</p>
                </div>
              </div>
            ))}

            {messages.length === 1 && (
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border-subtle">
                <p className="text-[10px] text-text-muted uppercase font-semibold tracking-wider px-1">Ask me anything</p>
                <div className="flex flex-wrap gap-2">
                  {SAMPLE_QUERIES.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSend(q)}
                      className="text-[11px] bg-white hover:bg-primary/5 text-primary border border-primary/20 hover:border-primary/40 px-3 py-1.5 rounded-full transition-all text-left shadow-sm"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-3 bg-bg/90 rounded-b-xl border-t border-border-subtle">
            <div className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={isListening ? "Listening..." : "Ask me anything..."}
                className={`input flex-1 bg-white transition-all ${isListening ? 'border-primary ring-2 ring-primary/20' : ''}`}
              />
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`btn px-3 flex items-center justify-center transition-all ${isListening
                    ? 'bg-red-500 text-white animate-pulse hover:bg-red-600'
                    : 'bg-white text-text-muted hover:text-primary border border-border-subtle hover:border-primary/50'
                    }`}
                >
                  {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="submit"
                  disabled={!query.trim()}
                  className="btn btn-primary px-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
