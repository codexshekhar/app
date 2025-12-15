import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Bot, User, Minimize2 } from 'lucide-react';
import { Chat, GenerateContentResponse } from "@google/genai";
import { createChatSession, checkRateLimit } from '../services/geminiService';
import { Language } from '../types';

interface Props {
  language: Language;
}

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

const AiChatbot: React.FC<Props> = ({ language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 'welcome', 
      role: 'model', 
      text: language === 'hi' 
        ? 'नमस्ते! मैं आपका किसान सहायक हूँ। आप मुझसे खेती, मौसम या मंडी भाव के बारे में कुछ भी पूछ सकते हैं।' 
        : 'Hello! I am your Kisan Assistant. Ask me anything about farming, weather, or market prices.' 
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat session on open or language change
  useEffect(() => {
    if (isOpen && !chatSessionRef.current) {
      chatSessionRef.current = createChatSession(language);
    }
  }, [isOpen, language]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    setInput('');
    
    // Add user message
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: userText };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // 1. Check Rate Limit
      if (!checkRateLimit()) {
        const errorMsg: Message = { 
          id: Date.now().toString(), 
          role: 'model', 
          text: language === 'hi' ? 'दैनिक सीमा समाप्त हो गई है। कृपया कल प्रयास करें।' : 'Daily limit reached. Please try again tomorrow.' 
        };
        setMessages(prev => [...prev, errorMsg]);
        setIsLoading(false);
        return;
      }

      // 2. Initialize Session if missing
      if (!chatSessionRef.current) {
        chatSessionRef.current = createChatSession(language);
      }

      if (!chatSessionRef.current) {
         throw new Error("Chat unavailable");
      }

      // 3. Create Placeholder for AI Response
      const aiMsgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: aiMsgId, role: 'model', text: '' }]);

      // 4. Stream Response
      const result = await chatSessionRef.current.sendMessageStream({ message: userText });
      
      let fullText = '';
      for await (const chunk of result) {
        const chunkText = (chunk as GenerateContentResponse).text || '';
        fullText += chunkText;
        
        setMessages(prev => prev.map(m => 
          m.id === aiMsgId ? { ...m, text: fullText } : m
        ));
      }

    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'model', 
        text: language === 'hi' ? 'क्षमा करें, कुछ तकनीकी समस्या है। कृपया पुनः प्रयास करें।' : 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform z-50 flex items-center gap-2 group"
      >
        <MessageCircle className="w-7 h-7" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 font-bold whitespace-nowrap">
          {language === 'hi' ? 'सहायक' : 'Assistant'}
        </span>
      </button>
    );
  }

  return (
    <div className={`fixed z-50 transition-all duration-300 shadow-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col
      ${isMinimized 
        ? 'bottom-6 right-6 w-72 h-14 rounded-full' 
        : 'bottom-6 right-6 w-[90vw] md:w-96 h-[600px] max-h-[80vh] rounded-2xl'
      }`}
    >
      {/* Header */}
      <div 
        className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 flex items-center justify-between cursor-pointer"
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <div className="flex items-center gap-2 text-white">
          <Bot className="w-6 h-6" />
          <h3 className="font-bold">{language === 'hi' ? 'किसान सहायक' : 'Kisan Assistant'}</h3>
        </div>
        <div className="flex items-center gap-2 text-white/80">
          {isMinimized ? <Bot className="w-5 h-5" /> : <Minimize2 className="w-5 h-5 hover:text-white" />}
          {!isMinimized && (
            <button 
              onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
              className="hover:text-white hover:bg-white/20 rounded-full p-1 transition"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Body (Hidden if minimized) */}
      {!isMinimized && (
        <>
          <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'model' && (
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                )}
                <div 
                  className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
                    ${msg.role === 'user' 
                      ? 'bg-green-600 text-white rounded-tr-none' 
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-tl-none shadow-sm'
                    }`}
                >
                  {msg.text}
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role === 'user' && (
               <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <Loader2 className="w-4 h-4 text-green-600 animate-spin" />
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                    </div>
                  </div>
               </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
            <form onSubmit={handleSend} className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={language === 'hi' ? 'अपना प्रश्न यहाँ लिखें...' : 'Type your question here...'}
                className="w-full pl-4 pr-12 py-3 rounded-full bg-slate-100 dark:bg-slate-800 border-transparent focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-green-500 outline-none text-sm text-slate-900 dark:text-white transition-all"
              />
              <button 
                type="submit" 
                disabled={!input.trim() || isLoading}
                className="absolute right-2 p-2 bg-green-600 text-white rounded-full hover:bg-green-700 disabled:opacity-50 disabled:hover:bg-green-600 transition-colors shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="text-center mt-2">
               <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Powered by Gemini 3.0</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AiChatbot;