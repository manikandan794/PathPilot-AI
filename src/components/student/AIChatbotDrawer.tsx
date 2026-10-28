import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Bot, User, RefreshCw, AlertCircle, Terminal, HelpCircle } from 'lucide-react';
import { api } from '../../services/api';

interface AIChatbotDrawerProps {
  currentDomain?: string;
  currentLesson?: string;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  provider?: string;
  timestamp: string;
}

export const AIChatbotDrawer: React.FC<AIChatbotDrawerProps> = ({ currentDomain, currentLesson }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-01',
      sender: 'assistant',
      text: `Hello! I am your **PathPilot AI Technical Assistant**.\n\nI can explain algorithms, debug tricky errors, suggest code implementations, and guide your curriculum progression. How can I help you today?`,
      provider: 'PathPilot Intelligence Engine',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputValue.trim();
    if (!text || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      const res = await api.sendStudentChatMessage({
        message: text,
        domain: currentDomain,
        currentLesson: currentLesson
      });

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: res.reply,
        provider: res.provider === 'gemini' ? 'Gemini 1.5 Flash' : res.provider === 'ollama' ? 'Ollama Local' : 'Domain Intelligence Engine',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      setError(err.message || 'Unable to connect to AI assistant. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 p-4 rounded-2xl bg-charcoal-deep border border-lime-brand/40 text-lime-brand hover:border-lime-brand shadow-glow-lime hover:scale-105 transition-all flex items-center gap-2 group"
          title="Open AI Learning Assistant"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-lime-brand group-hover:rotate-12 transition-transform" />
            <span className="w-2.5 h-2.5 rounded-full bg-lime-brand absolute -top-1 -right-1 ring-2 ring-charcoal" />
          </div>
          <span className="text-xs font-bold text-text-white hidden sm:inline pr-1">
            Ask AI Assistant
          </span>
        </button>
      )}

      {/* Slide-out Drawer */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-md h-[580px] max-h-[85vh] rounded-2xl bg-charcoal-deep border border-charcoal-border shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Drawer Header */}
          <div className="p-4 bg-charcoal border-b border-charcoal-border flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-lime-brand/10 border border-lime-brand/30 flex items-center justify-center text-lime-brand">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-text-white">PathPilot Mentor</h3>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-lime-brand/20 text-lime-brand font-semibold uppercase">
                    AI Active
                  </span>
                </div>
                <p className="text-[10px] text-text-muted truncate max-w-[220px]">
                  Context: {currentDomain || 'Full-Stack'} {currentLesson ? `• ${currentLesson}` : ''}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-text-muted hover:text-text-white hover:bg-charcoal-card transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'assistant' && (
                  <div className="w-6 h-6 rounded-md bg-charcoal-card border border-lime-brand/30 flex items-center justify-center text-lime-brand shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-xl p-3 leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-lime-brand text-charcoal font-medium'
                      : 'bg-charcoal-card border border-charcoal-border text-text-white'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{m.text}</div>
                  
                  {m.provider && (
                    <div className="mt-2 pt-1 border-t border-charcoal-border/50 text-[9px] text-text-muted flex items-center justify-between">
                      <span>{m.provider}</span>
                      <span>{m.timestamp}</span>
                    </div>
                  )}
                </div>

                {m.sender === 'user' && (
                  <div className="w-6 h-6 rounded-md bg-lime-brand/20 flex items-center justify-center text-lime-brand shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-text-muted text-xs p-2">
                <span className="w-4 h-4 border-2 border-lime-brand border-t-transparent rounded-full animate-spin" />
                <span>PathPilot AI is analyzing curriculum context...</span>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
                <button
                  onClick={() => handleSend(messages[messages.length - 1]?.text)}
                  className="px-2 py-1 rounded bg-red-500/20 hover:bg-red-500/30 text-[10px] font-semibold flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Retry
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Suggestions */}
          <div className="px-3 py-1.5 bg-charcoal border-t border-charcoal-border/40 flex items-center gap-1.5 overflow-x-auto text-[10px] text-text-muted">
            <span className="shrink-0 text-lime-brand font-semibold">Quick:</span>
            <button
              onClick={() => handleSend('Explain this module with a concrete code snippet')}
              className="px-2 py-0.5 rounded-full bg-charcoal-card hover:bg-charcoal-hover border border-charcoal-border truncate shrink-0"
            >
              Explain with code
            </button>
            <button
              onClick={() => handleSend('How do I debug an asynchronous promise rejection in React?')}
              className="px-2 py-0.5 rounded-full bg-charcoal-card hover:bg-charcoal-hover border border-charcoal-border truncate shrink-0"
            >
              Debug async error
            </button>
            <button
              onClick={() => handleSend('What projects should I build to become job-ready for this domain?')}
              className="px-2 py-0.5 rounded-full bg-charcoal-card hover:bg-charcoal-hover border border-charcoal-border truncate shrink-0"
            >
              Portfolio projects
            </button>
          </div>

          {/* Input Box */}
          <div className="p-3 bg-charcoal-deep border-t border-charcoal-border">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about a concept, debug an error, or request code..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-charcoal-card border border-charcoal-border text-xs text-text-white placeholder:text-text-muted/60 focus:outline-none focus:border-lime-brand"
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="p-2.5 rounded-xl bg-lime-brand text-charcoal hover:bg-lime-brand/90 transition-all disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      )}
    </>
  );
};
