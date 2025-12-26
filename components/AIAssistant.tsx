
import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Bot, X, MessageSquare } from 'lucide-react';
import { getMusicAdvice } from '../services/geminiService';
import { Product } from '../types';

interface AIAssistantProps {
  products: Product[];
}

const AIAssistant: React.FC<AIAssistantProps> = ({ products }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    { role: 'bot', text: "Hello! I'm your digital music consultant. Looking for a specific mood or instrumentation?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsTyping(true);

    const context = products.map(p => `${p.title}: ${p.description}`).join(' | ');
    const advice = await getMusicAdvice(userText, context);
    
    setIsTyping(false);
    setMessages(prev => [...prev, { role: 'bot', text: advice }]);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-stone-900 text-white p-4 rounded-full shadow-2xl hover:bg-stone-800 transition-all z-40 active:scale-95 flex items-center gap-2 group"
      >
        <MessageSquare size={24} />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap font-medium">
          Ask Maestro AI
        </span>
      </button>

      {isOpen && (
        <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col border-l border-stone-200 animate-in slide-in-from-right duration-300">
          <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-stone-50">
            <div className="flex items-center gap-2">
              <Sparkles className="text-amber-600" size={20} />
              <h3 className="font-bold text-stone-900">Music Consultant</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-stone-400 hover:text-stone-600">
              <X size={20} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50/30">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  m.role === 'user' 
                    ? 'bg-stone-900 text-white rounded-tr-none' 
                    : 'bg-white border border-stone-200 text-stone-700 rounded-tl-none shadow-sm'
                }`}>
                  <div className="flex items-center gap-1 mb-1 opacity-50 font-bold uppercase text-[9px]">
                    {m.role === 'user' ? <User size={10}/> : <Bot size={10}/>}
                    {m.role === 'user' ? 'You' : 'Maestro AI'}
                  </div>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-stone-200 p-3 rounded-2xl rounded-tl-none shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce delay-75"></div>
                    <div className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-stone-100">
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Suggest a moody piano piece..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 bg-stone-50 border border-stone-200 px-4 py-2 rounded-xl text-sm outline-none focus:ring-2 focus:ring-stone-900 transition-all"
              />
              <button 
                onClick={handleSend}
                className="bg-stone-900 text-white p-2 rounded-xl hover:bg-stone-800 transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;
