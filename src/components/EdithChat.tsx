import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Trash2, 
  Copy, 
  Check, 
  Cpu, 
  FileText, 
  RefreshCw, 
  ChevronDown, 
  HelpCircle, 
  ShieldCheck, 
  Zap, 
  AlertCircle,
  FileSpreadsheet,
  X
} from 'lucide-react';
import { ChatMessage, InvoiceItem } from '../types';

interface EdithChatProps {
  darkMode: boolean;
  invoices: InvoiceItem[];
  selectedInvoice?: InvoiceItem | null;
  onClearSelectedInvoice?: () => void;
  isFloatingWidget?: boolean;
  onCloseWidget?: () => void;
  onCloseTab?: () => void;
}

export const EdithChat: React.FC<EdithChatProps> = ({
  darkMode,
  invoices,
  selectedInvoice,
  onClearSelectedInvoice,
  isFloatingWidget = false,
  onCloseWidget,
  onCloseTab
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'initial-greeting',
      sender: 'edith',
      text: "Hello! I'm Edith, your AI Finance Assistant. I'm here to help you with invoices, payments, three-way matching, supplier enquiries, and any questions about the application.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: 'gemini-3.5-flash'
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [modelName, setModelName] = useState<string>('gemini-3.5-flash');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeContext, setActiveContext] = useState<InvoiceItem | null>(selectedInvoice || null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedInvoice) {
      setActiveContext(selectedInvoice);
    }
  }, [selectedInvoice]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const queryText = (textToSend || input).trim();
    if (!queryText || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/edith-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          modelName: modelName,
          invoiceContext: activeContext,
          allInvoices: invoices
        })
      });

      const data = await response.json();

      if (data.reply) {
        const edithMsg: ChatMessage = {
          id: `edith-${Date.now()}`,
          sender: 'edith',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          modelUsed: data.modelUsed || modelName
        };
        setMessages(prev => [...prev, edithMsg]);
      } else {
        throw new Error(data.error || 'Failed to receive response from Edith');
      }
    } catch (err: any) {
      console.error('Edith chat error:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'edith',
        text: "I experienced a temporary connection error. Please review the invoice record directly or try asking again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: modelName
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    setMessages([
      {
        id: `greeting-${Date.now()}`,
        sender: 'edith',
        text: "Hello! I'm Edith, your AI Finance Assistant. I'm here to help you with invoices, payments, three-way matching, supplier enquiries, and any questions about the application.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: modelName
      }
    ]);
  };

  const starterQuestions = [
    "How does 3-way matching work?",
    "Summarize all invoices currently on hold",
    "Why did INV-1058 fail three-way match?",
    "Draft email to Federal Hardware for price discrepancy",
    "What is our scheduled payment workflow?",
    "What should I do if a GRN is missing?"
  ];

  return (
    <div className={`flex flex-col h-full rounded-3xl overflow-hidden transition-colors duration-300 ${
      isFloatingWidget ? 'shadow-2xl border' : 'w-full'
    } ${darkMode ? 'bg-[#24303D] border-[#3A4654] text-[#F3F4F6]' : 'bg-white border-[#DCE3EA] text-[#1F2937]'}`}>
      
      {/* Top Bar Header */}
      <div className={`p-4 border-b flex items-center justify-between shrink-0 ${
        darkMode ? 'bg-[#1E2630]/80 border-[#3A4654]' : 'bg-[#F5F7FA] border-[#DCE3EA]'
      }`}>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/25 ring-2 ring-cyan-400/40">
              <Bot className="w-5 h-5 text-white animate-pulse" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-cyan-400 border-2 border-white dark:border-[#1E2630] rounded-full shadow-xs"></span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-bold tracking-tight bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-200 bg-clip-text text-transparent">Edith</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/20 text-blue-400 border border-blue-400/30 flex items-center gap-1 shadow-xs">
                <Sparkles className="w-2.5 h-2.5 text-cyan-300 animate-pulse" /> AI Assistant
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Gemini Model Selector */}
          <div className="relative">
            <select
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              className={`text-xs px-2.5 py-1.5 rounded-xl border appearance-none pr-7 font-medium cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
                darkMode 
                  ? 'bg-[#2A3441] border-[#3A4654] text-[#CBD5E1] hover:text-white' 
                  : 'bg-white border-[#DCE3EA] text-gray-700 hover:bg-gray-50'
              }`}
              title="Select Gemini AI Model"
            >
              <option value="gemini-3.5-flash">⚡ Gemini 3.5 Flash (General)</option>
              <option value="gemini-3.1-pro-preview">🧠 Gemini 3.1 Pro (Complex Audit)</option>
              <option value="gemini-3.1-flash-lite">🚀 Gemini 3.1 Lite (Fast Response)</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
          </div>

          <button
            onClick={clearChat}
            className={`p-2 rounded-xl border transition-all ${
              darkMode 
                ? 'hover:bg-[#2A3441] border-[#3A4654] text-[#CBD5E1]' 
                : 'hover:bg-gray-100 border-[#DCE3EA] text-gray-600'
            }`}
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {(onCloseWidget || onCloseTab) && (
            <button
              onClick={() => {
                if (onCloseWidget) onCloseWidget();
                else if (onCloseTab) onCloseTab();
              }}
              className={`p-2 rounded-xl border transition-all flex items-center justify-center font-bold ${
                darkMode 
                  ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/25 hover:border-red-500/50' 
                  : 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300'
              }`}
              title={isFloatingWidget ? "Minimize Edith Assistant" : "Close Edith Assistant"}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Selected Invoice Context Chip */}
      {activeContext && (
        <div className={`px-4 py-2 border-b text-xs flex items-center justify-between shrink-0 ${
          darkMode ? 'bg-blue-950/30 border-[#3A4654] text-blue-300' : 'bg-blue-50 border-blue-100 text-blue-800'
        }`}>
          <div className="flex items-center space-x-2 truncate">
            <FileSpreadsheet className="w-3.5 h-3.5 shrink-0 text-blue-500" />
            <span className="font-semibold">Context Locked:</span>
            <span className="truncate">{activeContext.invoiceNumber} • {activeContext.supplierName} (${activeContext.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })})</span>
          </div>
          <button
            onClick={() => {
              setActiveContext(null);
              if (onClearSelectedInvoice) onClearSelectedInvoice();
            }}
            className="text-xs text-blue-500 hover:underline font-bold shrink-0 ml-2"
          >
            Clear Context
          </button>
        </div>
      )}

      {/* Chat Messages Body */}
      <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isEdith = msg.sender === 'edith';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isEdith ? 'justify-start' : 'justify-end'}`}
            >
              {isEdith && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shrink-0 shadow-xs ring-1 ring-cyan-400/30 mt-1">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}

              <div className={`max-w-[85%] rounded-2xl p-4 space-y-2 relative group shadow-2xs ${
                isEdith
                  ? darkMode
                    ? 'bg-[#2A3441] text-[#F3F4F6] border border-[#3A4654]'
                    : 'bg-[#F0F4F8] text-[#1F2937] border border-[#DCE3EA]'
                  : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white font-medium shadow-md shadow-blue-500/20'
              }`}>
                {/* Header info for Edith */}
                {isEdith && (
                  <div className="flex items-center justify-between text-[11px] border-b pb-1.5 opacity-80 border-gray-300/30 dark:border-gray-700/50">
                    <span className="font-bold text-blue-500 dark:text-blue-400 flex items-center gap-1">
                      Edith AI Assistant
                    </span>
                    <span className="text-[10px] opacity-70">
                      {msg.timestamp}
                    </span>
                  </div>
                )}

                {/* Message Body with clean spacing */}
                <div className="text-xs md:text-sm whitespace-pre-wrap leading-relaxed space-y-1">
                  {msg.text}
                </div>

                {/* Footer Controls */}
                {isEdith && (
                  <div className="flex items-center justify-between pt-1 text-[10px] opacity-70">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      {msg.modelUsed || 'Gemini AI'}
                    </span>
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="flex items-center gap-1 hover:text-blue-500 transition-colors"
                      title="Copy message"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                )}
              </div>

              {!isEdith && (
                <div className="w-8 h-8 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 flex items-center justify-center text-xs font-bold shrink-0 mt-1">
                  ML
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0 animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className={`p-4 rounded-2xl border flex items-center space-x-3 ${
              darkMode ? 'bg-[#2A3441] border-[#3A4654]' : 'bg-[#F0F4F8] border-[#DCE3EA]'
            }`}>
              <div className="flex space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]"></span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Edith is analyzing AP records...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Starter Question Chips - Horizontal Scrollable Single Row */}
      {messages.length < 5 && !loading && (
        <div className={`px-3 py-2 border-t shrink-0 ${darkMode ? 'bg-[#1E2630]/60 border-[#3A4654]' : 'bg-[#F8FAFC] border-[#DCE3EA]'}`}>
          <div className="flex items-center justify-between mb-1.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-500 shrink-0" /> Suggested Quick Prompts
            </div>
            <span className="text-[9px] text-gray-400 dark:text-gray-500 italic">Swipe for more →</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {starterQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className={`text-xs px-3 py-1.5 rounded-xl border transition-all font-medium whitespace-nowrap shrink-0 ${
                  darkMode 
                    ? 'bg-[#2A3441] border-[#3A4654] text-[#CBD5E1] hover:bg-blue-600/20 hover:text-blue-400 hover:border-blue-500/40' 
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 shadow-2xs'
                }`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Message Input Box */}
      <div className={`p-3 md:p-4 border-t shrink-0 ${
        darkMode ? 'bg-[#1E2630] border-[#3A4654]' : 'bg-white border-[#DCE3EA]'
      }`}>
        <div className="relative flex items-center">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Edith about invoices, matching failures, payment schedules, or drafting email replies..."
            rows={2}
            className={`w-full p-3 pr-12 rounded-2xl border text-xs md:text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-colors ${
              darkMode 
                ? 'bg-[#2A3441] border-[#3A4654] text-white placeholder-gray-500' 
                : 'bg-[#F8FAFC] border-[#DCE3EA] text-gray-900 placeholder-gray-400'
            }`}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className={`absolute right-2.5 p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold shadow-md shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed`}
            title="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-2 flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            Boon Huat AP Security Policy Compliant
          </span>
          <span>Press Enter to send, Shift+Enter for new line</span>
        </div>
      </div>

    </div>
  );
};
