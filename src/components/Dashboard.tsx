import React from 'react';
import { 
  FileText, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  Mail, 
  MessageSquare,
  Sparkles,
  FileSpreadsheet,
  TrendingUp,
  Database,
  ArrowRight,
  ChevronRight,
  ShieldAlert,
  ShieldCheck
} from 'lucide-react';
import { InvoiceItem } from '../types';

interface DashboardProps {
  invoices: InvoiceItem[];
  onSelectInvoice: (inv: InvoiceItem) => void;
  onOpenEmailForInvoice: (inv: InvoiceItem) => void;
  onOpenSimulatorForInvoice?: (inv: InvoiceItem) => void;
  darkMode: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({
  invoices,
  onSelectInvoice,
  onOpenEmailForInvoice,
  onOpenSimulatorForInvoice,
  darkMode
}) => {
  const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const flaggedInvoices = invoices.filter(inv => inv.threeWayMatchResult !== 'Passed');
  const passedInvoicesCount = invoices.filter(inv => inv.threeWayMatchResult === 'Passed').length;
  
  const pendingCount = invoices.filter(inv => inv.invoiceStatus === 'Pending Review').length;
  const approvedCount = invoices.filter(inv => inv.invoiceStatus === 'Approved').length;
  const scheduledCount = invoices.filter(inv => inv.paymentStatus === 'Scheduled').length;
  const paidCount = invoices.filter(inv => inv.paymentStatus === 'Paid').length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Executive Header Banner */}
      <div className={`p-6 rounded-2xl border ${
        darkMode ? 'bg-[#2A3441] border-[#3A4654]' : 'bg-white border-[#DCE3EA] shadow-xs'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className={`text-base font-bold flex items-center space-x-2 ${darkMode ? 'text-[#F3F4F6]' : 'text-[#1F2937]'}`}>
              <span>AI Supplier Communication & Email Automation System</span>
            </h2>
            <p className={`text-xs mt-1 ${darkMode ? 'text-[#CBD5E1]' : 'text-[#6B7280]'}`}>
              Real-time Accounts Payable summary synced with the Master AP Google Database.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-semibold flex items-center space-x-1.5">
              <Database className="w-3.5 h-3.5" />
              <span>Master AP DB Connected</span>
            </span>
          </div>
        </div>
      </div>

      {/* Executive KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Documents */}
        <div className={`p-5 rounded-2xl border transition-all ${
          darkMode ? 'bg-[#2A3441] border-[#3A4654]' : 'bg-white border-[#DCE3EA] shadow-xs'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${darkMode ? 'text-[#CBD5E1]' : 'text-stone-500'}`}>
              Total Documents
            </span>
            <FileText className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className={`text-2xl font-bold ${darkMode ? 'text-[#F3F4F6]' : 'text-stone-900'}`}>
              {invoices.length} <span className="text-xs font-normal text-stone-400">records</span>
            </span>
            <span className="text-xs font-semibold text-emerald-500 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" /> 100% Synced
            </span>
          </div>
          <div className={`mt-2 text-[11px] ${darkMode ? 'text-[#CBD5E1]' : 'text-stone-500'}`}>
            Master AP Database records
          </div>
        </div>

        {/* 3-Way Match Discrepancies */}
        <div className={`p-5 rounded-2xl border transition-all ${
          darkMode ? 'bg-[#2A3441] border-amber-500/30 bg-gradient-to-br from-amber-950/20 to-transparent' : 'bg-white border-amber-200/80 shadow-xs bg-gradient-to-br from-amber-50/40 to-white'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              3-Way Match Discrepancies
            </span>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {flaggedInvoices.length}
            </span>
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400">Requires Attention</span>
          </div>
          <div className="mt-2 text-[11px] text-amber-700/80 dark:text-amber-300/80">
            Quantity or price variance flagged
          </div>
        </div>

        {/* Total Accounts Payable Value */}
        <div className={`p-5 rounded-2xl border transition-all ${
          darkMode ? 'bg-[#2A3441] border-emerald-500/30 bg-gradient-to-br from-emerald-950/20 to-transparent' : 'bg-white border-emerald-200/80 shadow-xs bg-gradient-to-br from-emerald-50/40 to-white'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Total AP Value
            </span>
            <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              ${totalAmount.toLocaleString('en-SG', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Live Exposure</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-700/80 dark:text-emerald-300/80">
            Cumulative invoice total
          </div>
        </div>

        {/* Payment Scheduled */}
        <div className={`p-5 rounded-2xl border transition-all ${
          darkMode ? 'bg-[#2A3441] border-blue-500/30 bg-gradient-to-br from-blue-950/20 to-transparent' : 'bg-white border-blue-200/80 shadow-xs bg-gradient-to-br from-blue-50/40 to-white'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Payment Scheduled
            </span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {scheduledCount}
            </span>
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Ready for batch</span>
          </div>
          <div className="mt-2 text-[11px] text-blue-700/80 dark:text-blue-300/80">
            Next GIRO disbursement run
          </div>
        </div>
      </div>

      {/* Main Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Audit & Workflow Breakdown */}
        <div className={`p-6 rounded-2xl border space-y-6 ${
          darkMode ? 'bg-[#2A3441] border-[#3A4654]' : 'bg-white border-[#DCE3EA] shadow-xs'
        }`}>
          <div>
            <h3 className={`text-sm font-bold border-b pb-2 ${darkMode ? 'border-[#3A4654] text-[#F3F4F6]' : 'border-gray-200 text-[#1F2937]'}`}>
              3-Way Match & Pipeline Status
            </h3>
            <p className={`text-xs mt-1 ${darkMode ? 'text-[#CBD5E1]' : 'text-[#6B7280]'}`}>
              Summary breakdown of verification checks and payment workflow stages.
            </p>
          </div>

          {/* 3-Way Match Verification Card */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-gray-500 uppercase text-[10px]">3-Way Match Audit</span>
              <span className="font-mono text-gray-400">{passedInvoicesCount} Passed / {flaggedInvoices.length} Discrepancies</span>
            </div>

            {/* Visual Bar */}
            <div className="w-full h-3 bg-gray-200/80 dark:bg-[#2A3441] border border-gray-300/40 dark:border-[#3A4654] rounded-full overflow-hidden flex shadow-inner">
              <div 
                className="bg-emerald-500 h-full transition-all" 
                style={{ width: `${(passedInvoicesCount / (invoices.length || 1)) * 100}%` }}
                title={`${passedInvoicesCount} Passed`}
              />
              <div 
                className="bg-amber-500 h-full transition-all" 
                style={{ width: `${(flaggedInvoices.length / (invoices.length || 1)) * 100}%` }}
                title={`${flaggedInvoices.length} Discrepancies`}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">Passed</span>
                </div>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{passedInvoicesCount}</span>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShieldAlert className="w-4 h-4 text-amber-500" />
                  <span className="font-semibold text-amber-600 dark:text-amber-400">Discrepancies</span>
                </div>
                <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{flaggedInvoices.length}</span>
              </div>
            </div>
          </div>

          {/* Workflow Status Stats */}
          <div className="space-y-3 pt-2">
            <span className="font-semibold text-gray-500 uppercase text-[10px] block">Approval & Disbursement Stages</span>
            <div className="grid grid-cols-3 gap-2 text-xs text-center font-medium">
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#1E2630] border border-gray-200 dark:border-gray-700">
                <div className="text-lg font-bold text-gray-900 dark:text-white">{approvedCount}</div>
                <div className="text-[10px] text-gray-400">Approved</div>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#1E2630] border border-gray-200 dark:border-gray-700">
                <div className="text-lg font-bold text-amber-500">{pendingCount}</div>
                <div className="text-[10px] text-gray-400">Pending Review</div>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#1E2630] border border-gray-200 dark:border-gray-700">
                <div className="text-lg font-bold text-emerald-500">{paidCount}</div>
                <div className="text-[10px] text-gray-400">Paid</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Needed Spotlight: Discrepancies Needing Communication */}
        <div className={`p-6 rounded-2xl border space-y-4 ${
          darkMode ? 'bg-[#2A3441] border-[#3A4654]' : 'bg-white border-[#DCE3EA] shadow-xs'
        }`}>
          <div className="flex items-center justify-between border-b pb-2 border-gray-200 dark:border-gray-700">
            <div>
              <h3 className={`text-sm font-bold flex items-center space-x-2 ${darkMode ? 'text-[#F3F4F6]' : 'text-[#1F2937]'}`}>
                <AlertCircle className="w-4 h-4 text-amber-500" />
                <span>Flagged Invoices Needing Action ({flaggedInvoices.length})</span>
              </h3>
              <p className={`text-xs ${darkMode ? 'text-[#CBD5E1]' : 'text-[#6B7280]'}`}>
                Invoices with quantity or price discrepancies from PO/GRN.
              </p>
            </div>
          </div>

          <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
            {flaggedInvoices.length === 0 ? (
              <div className="p-6 text-center text-xs text-gray-500">
                No discrepancies flagged. All invoices match PO and GRN.
              </div>
            ) : (
              flaggedInvoices.map((inv) => (
                <div 
                  key={inv.id} 
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 text-xs transition-colors ${
                    darkMode ? 'bg-[#1E2630] border-[#3A4654]' : 'bg-amber-50/50 border-amber-200/70'
                  }`}
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-gray-900 dark:text-white">{inv.invoiceNumber}</span>
                      <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                        {inv.threeWayMatchResult}
                      </span>
                    </div>
                    <div className="text-gray-500 dark:text-gray-400 truncate text-[11px]">
                      {inv.supplierName} • <span className="font-semibold text-gray-700 dark:text-gray-300">${inv.amount.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5 shrink-0">
                    {onOpenSimulatorForInvoice && (
                      <button
                        onClick={() => onOpenSimulatorForInvoice(inv)}
                        className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-semibold flex items-center space-x-1 shadow-xs transition-colors"
                        title="Generate Enquiry"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>Enquire</span>
                      </button>
                    )}

                    <button
                      onClick={() => onOpenEmailForInvoice(inv)}
                      className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold flex items-center space-x-1 shadow-xs transition-colors"
                      title="Send Email"
                    >
                      <Mail className="w-3 h-3" />
                      <span>Email</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Launchers for Core AI Tools */}
      <div className={`p-6 rounded-2xl border ${
        darkMode ? 'bg-[#2A3441] border-[#3A4654]' : 'bg-white border-[#DCE3EA] shadow-xs'
      }`}>
        <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Communication Action Hub
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div 
            onClick={() => onOpenSimulatorForInvoice && onOpenSimulatorForInvoice(invoices[0])}
            className={`p-4 rounded-xl border cursor-pointer group transition-all ${
              darkMode ? 'bg-[#1E2630] border-[#3A4654] hover:border-blue-500' : 'bg-blue-50/50 border-blue-200/80 hover:border-blue-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-lg bg-blue-600 text-white">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white flex items-center space-x-1">
                    <span>AI Supplier Enquiry</span>
                    <Sparkles className="w-3 h-3 text-amber-400" />
                  </h4>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    Type any enquiry type to craft formal supplier inquiries.
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
            </div>
          </div>

          <div 
            onClick={() => onOpenEmailForInvoice(invoices[0])}
            className={`p-4 rounded-xl border cursor-pointer group transition-all ${
              darkMode ? 'bg-[#1E2630] border-[#3A4654] hover:border-emerald-500' : 'bg-emerald-50/50 border-emerald-200/80 hover:border-emerald-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-lg bg-emerald-600 text-white">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white">
                    AI Email Generator & Dispatcher
                  </h4>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    Draft, review, and send supplier emails directly.
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
