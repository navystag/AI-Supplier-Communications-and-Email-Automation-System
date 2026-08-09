import React, { useState } from 'react';
import { X, Sparkles, Mail, Copy, Check, ArrowUpRight } from 'lucide-react';
import { InvoiceItem, ResolutionResponse } from '../types';

interface InvoiceDetailModalProps {
  invoice: InvoiceItem | null;
  onClose: () => void;
  onOpenEmailTabWithDraft: (draft: any, invoice: InvoiceItem) => void;
  darkMode: boolean;
}

export const InvoiceDetailModal: React.FC<InvoiceDetailModalProps> = ({
  invoice,
  onClose,
  onOpenEmailTabWithDraft,
  darkMode
}) => {
  const [selectedEnquiry, setSelectedEnquiry] = useState<string>('approval_status');
  const [aiResolution, setAiResolution] = useState<ResolutionResponse | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!invoice) return null;

  const handleFetchAiResolution = () => {
    setLoadingAi(true);
    setTimeout(() => {
      setLoadingAi(false);
      let reason = '';
      let nextAction = '';
      let subject = `Regarding Invoice ${invoice.invoiceNumber} - Boon Huat Hardware & Supplies`;
      let body = '';

      if (invoice.threeWayMatchResult === 'Passed') {
        reason = `Invoice ${invoice.invoiceNumber} has passed the automated 3-way match against Purchase Order ${invoice.matchDetails.poNumber} and Goods Received Note ${invoice.matchDetails.grnNumber}. Quantities and unit prices are fully verified.`;
        nextAction = 'Scheduled for regular bi-monthly GIRO payment disbursement run.';
        body = `Dear ${invoice.supplierName},\n\nWe are pleased to inform you that Invoice ${invoice.invoiceNumber} for the amount of $${invoice.amount.toLocaleString('en-SG', { minimumFractionDigits: 2 })} has successfully passed our automated 3-way match verification.\n\nPayment has been scheduled for disbursement on ${invoice.paymentDueDate || 'the next scheduled payment run'}.\n\nThank you for your reliable service.`;
      } else if (invoice.threeWayMatchResult.includes('Quantity')) {
        reason = `Discrepancy detected: Supplier invoiced for ${invoice.matchDetails.invoiceQty} units while warehouse GRN recorded receipt of ${invoice.matchDetails.grnQty} units.`;
        nextAction = 'Finance Officer to verify delivery logs with warehouse supervisor before releasing approval.';
        body = `Dear ${invoice.supplierName},\n\nWe are writing regarding Invoice ${invoice.invoiceNumber} ($${invoice.amount.toLocaleString('en-SG', { minimumFractionDigits: 2 })}). Our warehouse receiving records indicate a quantity discrepancy (Invoiced: ${invoice.matchDetails.invoiceQty}, Received: ${invoice.matchDetails.grnQty}).\n\nKindly clarify or issue a revised invoice so we can proceed with payment approval.`;
      } else {
        reason = invoice.additionalNotes || 'Invoice requires manual review by the Accounts Payable team.';
        nextAction = 'Conduct manual verification with supplier.';
        body = `Dear ${invoice.supplierName},\n\nWe are currently reviewing Invoice ${invoice.invoiceNumber}. Please provide additional supporting documentation at your earliest convenience.`;
      }

      setAiResolution({
        supplier: invoice.supplierName,
        invoiceNumber: invoice.invoiceNumber,
        currentInvoiceStatus: invoice.invoiceStatus,
        currentPaymentStatus: invoice.paymentStatus,
        reason,
        recommendedNextAction: nextAction,
        paymentDueDate: invoice.paymentDueDate,
        emailDraft: {
          subject,
          greeting: `Dear ${invoice.supplierName} Accounts Team,`,
          body,
          closing: 'Best regards,\nAccounts Payable Department\nBoon Huat Hardware & Supplies Pte Ltd'
        }
      });
    }, 600);
  };

  const currentRes = aiResolution || {
    supplier: invoice.supplierName,
    invoiceNumber: invoice.invoiceNumber,
    currentInvoiceStatus: invoice.invoiceStatus,
    currentPaymentStatus: invoice.paymentStatus,
    reason: invoice.additionalNotes || 'Invoice verification in progress.',
    recommendedNextAction: 'Review details and approve or flag for discrepancy resolution.',
    emailDraft: {
      subject: `Enquiry regarding Invoice ${invoice.invoiceNumber}`,
      greeting: `Dear ${invoice.supplierName} Accounts Team,`,
      body: `We are reviewing Invoice ${invoice.invoiceNumber} for $${invoice.amount.toLocaleString('en-SG', { minimumFractionDigits: 2 })}.`,
      closing: 'Best regards,\nAccounts Department\nBoon Huat Hardware & Supplies Pte Ltd'
    }
  };

  const handleCopyEmail = () => {
    const fullText = `${currentRes.emailDraft.subject}\n\n${currentRes.emailDraft.greeting}\n\n${currentRes.emailDraft.body}\n\n${currentRes.emailDraft.closing}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className={`w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl border flex flex-col overflow-hidden ${
        darkMode ? 'bg-[#2A3441] border-[#3A4654] text-[#F3F4F6]' : 'bg-white border-[#DCE3EA] text-[#1F2937]'
      }`}>
        {/* Modal Header */}
        <div className={`px-6 py-5 border-b flex justify-between items-center ${
          darkMode ? 'border-[#3A4654] bg-[#24303D]' : 'border-[#DCE3EA] bg-[#EEF3F8]'
        }`}>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono font-bold text-base">{invoice.invoiceNumber}</span>
              <span className="text-gray-400">•</span>
              <span className="font-semibold text-sm">{invoice.supplierName}</span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">{invoice.description} (${invoice.amount.toLocaleString('en-SG', { minimumFractionDigits: 2 })})</p>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-full transition-colors ${
              darkMode ? 'hover:bg-[#3A4654] text-gray-300' : 'hover:bg-gray-200 text-gray-600'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Quick Match & Details Grid */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl border text-xs ${
            darkMode ? 'bg-[#1E2630] border-[#3A4654]' : 'bg-gray-50 border-gray-200'
          }`}>
            <div>
              <span className="text-gray-400 block mb-1 font-semibold uppercase text-[10px]">Three-Way Match</span>
              <span className={`font-bold px-2.5 py-1 rounded-full text-[11px] inline-block ${
                invoice.threeWayMatchResult === 'Passed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
              }`}>
                {invoice.threeWayMatchResult}
              </span>
              <div className="mt-2 text-gray-400 text-[11px]">
                PO: {invoice.matchDetails.poNumber} | GRN: {invoice.matchDetails.grnNumber}
              </div>
            </div>
            <div>
              <span className="text-gray-400 block mb-1 font-semibold uppercase text-[10px]">Invoice Status</span>
              <span className="font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[11px] inline-block">
                {invoice.invoiceStatus}
              </span>
              <div className="mt-2 text-gray-400 text-[11px]">Date: {invoice.invoiceDate}</div>
            </div>
            <div>
              <span className="text-gray-400 block mb-1 font-semibold uppercase text-[10px]">Payment Status</span>
              <span className="font-semibold uppercase text-xs">{invoice.paymentStatus}</span>
              {invoice.paymentDueDate && <div className="mt-2 text-gray-400 text-[11px]">Due: {invoice.paymentDueDate}</div>}
            </div>
          </div>

          {/* AI Resolution Generator Button */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">AI Resolution Assistant</span>
            <button
              onClick={handleFetchAiResolution}
              disabled={loadingAi}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold inline-flex items-center space-x-2 shadow-md shadow-blue-500/20 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{loadingAi ? 'Analyzing Record...' : 'Generate AI Resolution & Draft'}</span>
            </button>
          </div>

          {/* Resolution Card */}
          <div className={`p-6 rounded-2xl border space-y-4 ${
            darkMode ? 'bg-[#1E2630] border-[#3A4654]' : 'bg-gray-900 text-white'
          }`}>
            <div className="flex items-center justify-between border-b border-gray-700 pb-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                AI Resolution & Recommended Action
              </h3>
              <span className="text-[11px] text-gray-400">Authorized Review Ready</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-semibold">Plain English Explanation</span>
                <p className="mt-1 leading-relaxed p-3.5 rounded-xl bg-black/30 border border-gray-800">
                  {currentRes.reason}
                </p>
              </div>
              <div>
                <span className="text-amber-400 block text-[10px] uppercase font-semibold">Recommended Next Step for Finance Officer</span>
                <p className="mt-1 leading-relaxed p-3.5 rounded-xl bg-amber-950/40 border border-amber-900/50 text-amber-200">
                  {currentRes.recommendedNextAction}
                </p>
              </div>
            </div>
          </div>

          {/* Email Draft Preview */}
          <div className={`p-6 rounded-2xl border space-y-4 ${
            darkMode ? 'bg-[#1E2630] border-[#3A4654]' : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5">
                <Mail className="w-4 h-4 text-blue-500" />
                <span>Professional Email Draft (Requires Authorization)</span>
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={handleCopyEmail}
                  className="px-3.5 py-1.5 bg-white text-gray-800 dark:bg-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 rounded-xl text-xs font-medium inline-flex items-center space-x-1 shadow-xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Draft'}</span>
                </button>
                <button
                  onClick={() => {
                    onOpenEmailTabWithDraft(currentRes.emailDraft, invoice);
                    onClose();
                  }}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold inline-flex items-center space-x-1 shadow-xs"
                >
                  <span>Open in Email Generator</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-[#2A3441] border border-gray-200 dark:border-gray-700 font-mono text-xs space-y-2">
              <div><span className="text-gray-400">Subject:</span> {currentRes.emailDraft.subject}</div>
              <div className="pt-2"><span className="text-gray-400">Greeting:</span> {currentRes.emailDraft.greeting}</div>
              <div className="pt-2 whitespace-pre-wrap font-sans text-gray-700 dark:text-gray-300 leading-relaxed">
                {currentRes.emailDraft.body}
              </div>
              <div className="pt-2 whitespace-pre-wrap font-sans text-gray-500 dark:text-gray-400">
                {currentRes.emailDraft.closing}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className={`px-6 py-4 border-t flex justify-end ${
          darkMode ? 'border-[#3A4654] bg-[#24303D]' : 'border-[#DCE3EA] bg-[#EEF3F8]'
        }`}>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-500/20 transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
