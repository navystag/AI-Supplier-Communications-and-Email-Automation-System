import React from 'react';
import { HelpCircle, BookOpen, ShieldCheck, FileText, MessageSquare } from 'lucide-react';

interface HelpProps {
  darkMode: boolean;
}

export const Help: React.FC<HelpProps> = ({ darkMode }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className={`p-6 rounded-2xl border ${
        darkMode ? 'bg-[#2A3441] border-[#3A4654]' : 'bg-white border-[#DCE3EA] shadow-xs'
      }`}>
        <div className="flex items-center space-x-2">
          <HelpCircle className="w-5 h-5 text-blue-500" />
          <h2 className={`text-base font-bold ${darkMode ? 'text-[#F3F4F6]' : 'text-[#1F2937]'}`}>
            Help & Enterprise User Documentation
          </h2>
        </div>
        <p className={`text-xs mt-1 ${darkMode ? 'text-[#CBD5E1]' : 'text-[#6B7280]'}`}>
          Standard Operating Procedures (SOP) for Accounts Payable, 3-way matching rules, and AI resolution assistants.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`p-6 rounded-2xl border space-y-3 ${
          darkMode ? 'bg-[#2A3441] border-[#3A4654]' : 'bg-white border-[#DCE3EA] shadow-xs'
        }`}>
          <div className="flex items-center space-x-2 text-blue-500 font-semibold text-xs">
            <BookOpen className="w-4 h-4" />
            <span>Three-Way Match Verification</span>
          </div>
          <p className={`text-xs leading-relaxed ${darkMode ? 'text-[#CBD5E1]' : 'text-[#6B7280]'}`}>
            The system automatically compares the Purchase Order (PO), Goods Received Note (GRN), and Supplier Invoice. Any quantity discrepancy or unit price variance triggers an automated review flag.
          </p>
        </div>

        <div className={`p-6 rounded-2xl border space-y-3 ${
          darkMode ? 'bg-[#2A3441] border-[#3A4654]' : 'bg-white border-[#DCE3EA] shadow-xs'
        }`}>
          <div className="flex items-center space-x-2 text-emerald-500 font-semibold text-xs">
            <ShieldCheck className="w-4 h-4" />
            <span>Authorized Review Guardrails</span>
          </div>
          <p className={`text-xs leading-relaxed ${darkMode ? 'text-[#CBD5E1]' : 'text-[#6B7280]'}`}>
            The AI assistant provides recommendations and professional email drafts. All communications and payment approvals require explicit authorization from the Finance Team or Accounts Department.
          </p>
        </div>
      </div>
    </div>
  );
};
