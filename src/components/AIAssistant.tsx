import { useState } from 'react';
import { Sparkles, X, Send } from 'lucide-react';

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    { role: 'assistant', content: 'Hello! I\'m your AI assistant. I can help you search records, extract data from documents, and provide insights. Try asking me something!' }
  ]);

  const mockResponses: Record<string, string> = {
    'loans maturing': 'I found 2 loans maturing in the next 30 days: L-2024-0089 (Sarah Mitchell) on Oct 15, 2029, and L-2024-0102 (James Anderson) on Nov 1, 2027.',
    'vendors lead time': 'Based on your data, I found 2 vendors with lead times over 30 days: Global Electronics Ltd. (45 days) and Steel Suppliers Inc. (30 days).',
    'overdue invoices': 'You have 1 overdue invoice: INV-2024-0156 from Steel Suppliers Inc. for $45,000, due on Dec 15, 2024.',
    'quote status': 'You have 3 active quotes: 2 sent and 1 draft. The acceptance rate this month is 67%.',
    'default': 'I can help you with:\n- Finding records (e.g., "show loans maturing soon")\n- Analyzing data (e.g., "vendors with long lead times")\n- Creating records (e.g., "create a new quote")\n- Extracting data from documents\n\nWhat would you like to know?'
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: query }]);

    setTimeout(() => {
      const lowerQuery = query.toLowerCase();
      let response = mockResponses.default;

      for (const [key, value] of Object.entries(mockResponses)) {
        if (lowerQuery.includes(key)) {
          response = value;
          break;
        }
      }

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    }, 500);

    setQuery('');
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#E55A1E] transition-all z-40 hover:scale-110"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-surface rounded-lg shadow-xl flex flex-col z-40">
          <div className="p-4 bg-primary text-white rounded-t-lg">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <h3 className="text-sm font-semibold">AI Assistant</h3>
            </div>
            <p className="text-xs opacity-90 mt-0.5">Ask me anything about your data</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-2.5 rounded-lg ${message.role === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-bg text-text-main'
                    }`}
                >
                  <p className="text-xs whitespace-pre-line">{message.content}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="p-3 bg-bg">
            <div className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask me anything..."
                className="input flex-1"
              />
              <button
                type="submit"
                className="btn btn-primary px-3"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
