'use client';

import { useEffect, useState } from 'react';

export default function LiveChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ from: 'bot' | 'user'; text: string }[]>([
    { from: 'bot', text: 'Hi! 👋 How can we help you today?' },
  ]);
  const [input, setInput] = useState('');
  const [minimized, setMinimized] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setOpen(true), 10000);
    return () => clearTimeout(timer);
  }, []);

  if (!open) return null;

  const FAQ_RESPONSES: Record<string, string> = {
    hours: 'We\'re open Mon–Fri 8am–5pm and Sat 8am–1pm.',
    price: 'We offer free diagnostics! Contact us at 039 314 4359 for a quote.',
    repair: 'We repair laptops, desktops, Macs, consoles, phones & more. Walk-in or mail in your device!',
    shipping: 'We offer nationwide mail-in repairs. Ship your device to us from anywhere in SA.',
    location: 'We\'re at 202 Marine Drive, Ramsgate, KZN 4285.',
    contact: 'Call 039 314 4359 or WhatsApp 082 556 9875.',
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((m) => [...m, { from: 'user', text: userMsg }]);
    setInput('');

    const lower = userMsg.toLowerCase();
    let response = 'Thanks for your message! For detailed help, please call us at 039 314 4359 or WhatsApp 082 556 9875.';
    for (const [key, val] of Object.entries(FAQ_RESPONSES)) {
      if (lower.includes(key)) {
        response = val;
        break;
      }
    }

    setTimeout(() => {
      setMessages((m) => [...m, { from: 'bot', text: response }]);
    }, 800);
  };

  if (minimized) {
    return (
      <button
        onClick={() => setMinimized(false)}
        className="fixed bottom-24 right-6 z-30 bg-primary-600 hover:bg-primary-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
        aria-label="Open chat"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center font-bold animate-pulse">1</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-24 right-6 z-30 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col" style={{ maxHeight: '450px' }}>
      {/* Header */}
      <div className="bg-primary-600 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="font-semibold text-sm">Unlimited IT Support</span>
        </div>
        <div className="flex gap-1">
          <button onClick={() => setMinimized(true)} className="p-1 hover:bg-white/20 rounded" aria-label="Minimize">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeWidth={2} d="M18 12H6" /></svg>
          </button>
          <button onClick={() => setOpen(false)} className="p-1 hover:bg-white/20 rounded" aria-label="Close">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: '300px' }}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
              msg.from === 'user'
                ? 'bg-primary-600 text-white rounded-br-sm'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-3 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
        />
        <button
          onClick={handleSend}
          className="bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700 transition-colors"
          aria-label="Send"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
        </button>
      </div>
    </div>
  );
}
