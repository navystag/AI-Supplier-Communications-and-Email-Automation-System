import React from 'react';
import { Building2, ShieldAlert, FileText, MessageSquare, Mail, Link2, PlusCircle, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAddModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onOpenAddModal }) => {
  return (
    <header className="bg-white border-b border-stone-200/80 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#5A5A40] flex items-center justify-center text-white font-serif italic font-bold text-lg">
              BH
            </div>
            <div>
              <h1 className="text-xl font-serif text-[#2c2c2c] tracking-tight">
                Boon Huat Hardware & Supplies Pte Ltd
              </h1>
              <p className="text-xs text-stone-500 font-medium tracking-wide">
                AI Supplier Communication & Resolution Assistant • User: <span className="text-[#5A5A40] font-semibold">Madam Lim (Accounts Executive)</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[#5A5A40] hover:bg-[#4a4a34] text-white text-xs font-semibold transition-colors shadow-[0_4px_10px_rgba(90,90,64,0.2)]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Invoice Entry</span>
            </button>
            <div className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Apps 1 & 2 Connected</span>
            </div>
          </div>
        </div>

        {/* Guardrail Banner */}
        <div className="mb-3 px-4 py-2.5 bg-amber-50/80 border border-amber-200/80 rounded-2xl text-xs text-amber-900 flex items-start space-x-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Guardrail Notice:</span> Operating as an assistant only. Does not make business decisions, approve invoices, approve payments, or send emails automatically. All communications require Madam Lim&apos;s review and approval.
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 overflow-x-auto pb-px">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center space-x-2 px-4 py-3 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'border-[#5A5A40] text-[#5A5A40] font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Invoices & Status Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center space-x-2 px-4 py-3 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'simulator'
                ? 'border-[#5A5A40] text-[#5A5A40] font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Supplier Enquiry Simulator</span>
          </button>

          <button
            onClick={() => setActiveTab('email')}
            className={`flex items-center space-x-2 px-4 py-3 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'email'
                ? 'border-[#5A5A40] text-[#5A5A40] font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Professional Email Generator</span>
          </button>

          <button
            onClick={() => setActiveTab('integrations')}
            className={`flex items-center space-x-2 px-4 py-3 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'integrations'
                ? 'border-[#5A5A40] text-[#5A5A40] font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300'
            }`}
          >
            <Link2 className="w-4 h-4" />
            <span>Integration Hub (App 1 & 2)</span>
          </button>
        </div>
      </div>
    </header>
  );
};

