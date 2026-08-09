import React from 'react';
import { Link2, ShieldCheck, CheckCircle } from 'lucide-react';

interface IntegrationHubProps {
  darkMode: boolean;
}

export const IntegrationHub: React.FC<IntegrationHubProps> = ({ darkMode }) => {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className={`p-6 rounded-2xl border ${
        darkMode ? 'bg-[#2A3441] border-[#3A4654]' : 'bg-white border-[#DCE3EA] shadow-xs'
      }`}>
        <div className="flex items-center space-x-2">
          <Link2 className="w-5 h-5 text-blue-500" />
          <h2 className={`text-base font-bold ${darkMode ? 'text-[#F3F4F6]' : 'text-[#1F2937]'}`}>
            Enterprise Integration Hub & Data Pipelines
          </h2>
        </div>
        <p className={`text-xs mt-1 ${darkMode ? 'text-[#CBD5E1]' : 'text-[#6B7280]'}`}>
          Seamlessly connected with enterprise ERP modules, AI Three-Way Match Engine, and Payment Scheduler.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`p-6 rounded-2xl border space-y-4 ${
          darkMode ? 'bg-[#2A3441] border-[#3A4654]' : 'bg-white border-[#DCE3EA] shadow-xs'
        }`}>
          <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold text-xs">
                A1
              </div>
              <div>
                <h3 className={`text-sm font-bold ${darkMode ? 'text-[#F3F4F6]' : 'text-[#1F2937]'}`}>
                  AI Three-Way Match Assistant
                </h3>
                <p className="text-[11px] text-emerald-500 font-medium flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                  <span>Connected & Active</span>
                </p>
              </div>
            </div>
          </div>
          <p className={`text-xs leading-relaxed ${darkMode ? 'text-[#CBD5E1]' : 'text-[#6B7280]'}`}>
            Provides automated reconciliation between Purchase Orders (PO), Goods Received Notes (GRN), and Supplier Invoices.
          </p>
          <div className={`p-3 rounded-xl border font-mono text-[11px] space-y-1 ${
            darkMode ? 'bg-[#1E2630] border-[#3A4654]' : 'bg-gray-50 border-gray-200'
          }`}>
            <div><span className="text-gray-400">Endpoint:</span> /api/integration/three-way-match</div>
            <div><span className="text-gray-400">Match Logic:</span> Qty & Unit Price Tolerance Check</div>
          </div>
        </div>

        <div className={`p-6 rounded-2xl border space-y-4 ${
          darkMode ? 'bg-[#2A3441] border-[#3A4654]' : 'bg-white border-[#DCE3EA] shadow-xs'
        }`}>
          <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-xs">
                A2
              </div>
              <div>
                <h3 className={`text-sm font-bold ${darkMode ? 'text-[#F3F4F6]' : 'text-[#1F2937]'}`}>
                  AI Payment Scheduler & Duplicate Detection
                </h3>
                <p className="text-[11px] text-emerald-500 font-medium flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                  <span>Connected & Active</span>
                </p>
              </div>
            </div>
          </div>
          <p className={`text-xs leading-relaxed ${darkMode ? 'text-[#CBD5E1]' : 'text-[#6B7280]'}`}>
            Manages cash-flow disbursement schedules, payment runs, and fuzzy-matching duplicate invoice detection across supplier history.
          </p>
          <div className={`p-3 rounded-xl border font-mono text-[11px] space-y-1 ${
            darkMode ? 'bg-[#1E2630] border-[#3A4654]' : 'bg-gray-50 border-gray-200'
          }`}>
            <div><span className="text-gray-400">Endpoint:</span> /api/integration/payment-schedule</div>
            <div><span className="text-gray-400">Duplicate Check:</span> Amount + Supplier + PO Hash</div>
          </div>
        </div>
      </div>
    </div>
  );
};
