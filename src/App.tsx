import React, { useState, useEffect } from 'react';
import { InvoiceItem } from './types';
import { LoginPage } from './components/LoginPage';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { InvoiceDetailModal } from './components/InvoiceDetailModal';
import { EnquirySimulator } from './components/EnquirySimulator';
import { EmailGenerator } from './components/EmailGenerator';
import { EdithChat } from './components/EdithChat';
import { Settings } from './components/Settings';
import { Help } from './components/Help';
import { getInvoiceRecord } from './services/masterDbService';
import { RefreshCw, Database, AlertTriangle, Bot, MessageSquare, Sparkles } from 'lucide-react';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isEdithWidgetOpen, setIsEdithWidgetOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [isLoadingDb, setIsLoadingDb] = useState(true);
  const [dbErrorMessage, setDbErrorMessage] = useState<string | null>(null);

  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceItem | null>(null);
  const [emailDraft, setEmailDraft] = useState<any>(null);
  const [emailSelectedInvoice, setEmailSelectedInvoice] = useState<InvoiceItem | null>(null);

  const loadMasterDbRecords = async () => {
    setIsLoadingDb(true);
    setDbErrorMessage(null);
    const res = await getInvoiceRecord();
    setIsLoadingDb(false);

    if (!res.success) {
      setDbErrorMessage(res.message);
    } else {
      setInvoices(res.items);
    }
  };

  useEffect(() => {
    loadMasterDbRecords();
  }, []);

  const handleOpenEmailTabWithDraft = (draft: any, invoice: InvoiceItem) => {
    setEmailDraft(draft);
    setEmailSelectedInvoice(invoice);
    setActiveTab('email');
  };

  if (!isLoggedIn) {
    return (
      <LoginPage
        onLoginSuccess={() => setIsLoggedIn(true)}
        darkMode={darkMode}
      />
    );
  }

  return (
    <div className={`h-screen w-screen flex p-5 md:p-6 gap-5 md:gap-6 font-sans transition-colors duration-300 overflow-hidden ${
      darkMode ? 'bg-[#1E2630] text-[#F3F4F6]' : 'bg-[#F5F7FA] text-[#1F2937]'
    }`}>
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onLogout={() => setIsLoggedIn(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden space-y-5 md:space-y-6">
        {/* Top Header Bar */}
        <header className={`shrink-0 h-16 px-6 border rounded-2xl flex items-center justify-between shadow-xs transition-colors duration-300 ${
          darkMode ? 'bg-[#24303D] border-[#3A4654]' : 'bg-white border-[#DCE3EA]'
        }`}>
          <div className="flex items-center space-x-3 truncate">
            <h1 className="text-sm font-bold capitalize tracking-tight truncate">
              {activeTab === 'dashboard' && 'AI Supplier Communication & Email Automation System'}
              {activeTab === 'edith' && 'Edith AI Finance Assistant'}
              {activeTab === 'simulator' && 'AI Supplier Enquiry'}
              {activeTab === 'email' && 'AI Supplier Email Generator'}
              {activeTab === 'settings' && 'System Settings'}
              {activeTab === 'help' && 'Help & Documentation'}
            </h1>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={loadMasterDbRecords}
              disabled={isLoadingDb}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 transition-colors ${
                darkMode ? 'border-[#3A4654] bg-[#1E2630] hover:bg-[#3A4654]' : 'border-[#DCE3EA] bg-white hover:bg-gray-100'
              }`}
              title="Refresh and sync data with Google Sheet Master AP Database"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-blue-500 ${isLoadingDb ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isLoadingDb ? 'Refreshing...' : 'Refresh Data'}</span>
            </button>

            <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center space-x-1.5 ${
              darkMode ? 'bg-blue-900/30 border-blue-800 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-700'
            }`}>
              <Database className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Master AP DB (Read Only)</span>
            </span>
          </div>
        </header>

        {/* Master AP DB Warning Banner if error */}
        {dbErrorMessage && (
          <div className="shrink-0 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold flex items-center space-x-2 shadow-xs">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
            <span>{dbErrorMessage}</span>
          </div>
        )}

        {/* Scrollable Tab Content Container */}
        <div className={`flex-1 rounded-3xl border overflow-y-auto p-6 lg:p-8 shadow-xs transition-colors duration-300 ${
          darkMode ? 'bg-[#24303D]/40 border-[#3A4654]' : 'bg-white/80 border-[#DCE3EA]'
        }`}>
          <main className="max-w-7xl w-full mx-auto">
            {activeTab === 'edith' && (
              <div className="h-[78vh]">
                <EdithChat
                  darkMode={darkMode}
                  invoices={invoices}
                  selectedInvoice={selectedInvoice}
                  onClearSelectedInvoice={() => setSelectedInvoice(null)}
                  onCloseTab={() => setActiveTab('dashboard')}
                />
              </div>
            )}

            {activeTab === 'simulator' && (
              <EnquirySimulator
                invoices={invoices}
                onOpenEmailTabWithDraft={handleOpenEmailTabWithDraft}
                darkMode={darkMode}
              />
            )}

            {activeTab === 'email' && (
              <EmailGenerator
                invoices={invoices}
                initialDraft={emailDraft}
                selectedInvoiceForEmail={emailSelectedInvoice}
                darkMode={darkMode}
              />
            )}

            {activeTab === 'dashboard' && (
              <Dashboard
                invoices={invoices}
                onSelectInvoice={(inv) => setSelectedInvoice(inv)}
                onOpenEmailForInvoice={(inv) => {
                  setEmailSelectedInvoice(inv);
                  setActiveTab('email');
                }}
                onOpenSimulatorForInvoice={(inv) => {
                  setActiveTab('simulator');
                }}
                darkMode={darkMode}
              />
            )}

            {activeTab === 'settings' && (
              <Settings darkMode={darkMode} onRefreshMasterDb={loadMasterDbRecords} />
            )}

            {activeTab === 'help' && (
              <Help darkMode={darkMode} />
            )}
          </main>
        </div>

        {/* Footer */}
        <footer className={`shrink-0 py-3 px-6 rounded-2xl border text-xs flex flex-col sm:flex-row items-center justify-between transition-colors duration-300 ${
          darkMode ? 'bg-[#24303D] border-[#3A4654] text-[#CBD5E1]' : 'bg-white border-[#DCE3EA] text-gray-500'
        }`}>
          <div>
            Boon Huat Hardware & Supplies Pte Ltd • Master AP Database Integration (READ ONLY)
          </div>
          <div className="mt-1 sm:mt-0 font-medium">
            Supplier Email Automation & AI Enquiry Portal
          </div>
        </footer>
      </div>

      {/* Invoice Detail Inspector Modal */}
      <InvoiceDetailModal
        invoice={selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        onOpenEmailTabWithDraft={handleOpenEmailTabWithDraft}
        darkMode={darkMode}
      />

      {/* Floating Edith AI Assistant Widget */}
      {activeTab !== 'edith' && (
        <div className="fixed bottom-6 right-6 z-40">
          {isEdithWidgetOpen ? (
            <div className="w-[380px] sm:w-[440px] h-[580px] shadow-[0_20px_60px_-15px_rgba(37,99,235,0.4)] rounded-[28px] overflow-hidden border border-blue-500/40 bg-[#1E2630]/95 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-5 duration-300 ring-1 ring-blue-400/20">
              <EdithChat
                darkMode={darkMode}
                invoices={invoices}
                selectedInvoice={selectedInvoice}
                onClearSelectedInvoice={() => setSelectedInvoice(null)}
                isFloatingWidget={true}
                onCloseWidget={() => setIsEdithWidgetOpen(false)}
              />
            </div>
          ) : (
            <button
              onClick={() => setIsEdithWidgetOpen(true)}
              className="group relative flex items-center space-x-3 px-5 py-3.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white font-bold text-xs shadow-[0_10px_35px_rgba(37,99,235,0.45)] hover:shadow-[0_15px_45px_rgba(6,182,212,0.55)] hover:scale-105 active:scale-95 transition-all duration-300 ring-2 ring-cyan-400/50 hover:ring-cyan-300"
              title="Ask Edith AI Finance Assistant"
            >
              {/* Glowing Aura Effect behind button */}
              <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 opacity-40 blur-sm group-hover:opacity-80 transition duration-300"></span>

              <div className="relative flex items-center space-x-3 z-10">
                <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs shadow-inner ring-1 ring-white/40">
                  <Bot className="w-4 h-4 text-white group-hover:rotate-12 transition-transform duration-300" />
                  <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-300 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400"></span>
                  </span>
                </div>

                <div className="flex flex-col items-start leading-none text-left">
                  <div className="flex items-center space-x-1">
                    <span className="text-xs font-black tracking-wide text-white">Ask Edith</span>
                    <Sparkles className="w-3 h-3 text-cyan-200 animate-pulse" />
                  </div>
                  <span className="text-[10px] text-cyan-100 font-medium opacity-90 mt-0.5">Finance AI Assistant</span>
                </div>

                <span className="ml-1 px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-extrabold uppercase tracking-wider text-white border border-white/30 backdrop-blur-xs">
                  AI
                </span>
              </div>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
