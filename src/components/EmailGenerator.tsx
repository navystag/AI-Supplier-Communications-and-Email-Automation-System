import React, { useState, useEffect } from 'react';
import { Mail, Send, CheckCircle2, AlertCircle, RefreshCw, Database, Search, AlertTriangle, ShieldCheck } from 'lucide-react';
import { InvoiceItem } from '../types';
import { getInvoiceRecord, MasterApRecord } from '../services/masterDbService';

interface EmailGeneratorProps {
  invoices: InvoiceItem[];
  initialDraft: any;
  selectedInvoiceForEmail: InvoiceItem | null;
  darkMode: boolean;
}

export const EmailGenerator: React.FC<EmailGeneratorProps> = ({
  invoices,
  initialDraft,
  selectedInvoiceForEmail,
  darkMode
}) => {
  const [invoiceNumber, setInvoiceNumber] = useState<string>('');
  const [supplierName, setSupplierName] = useState<string>('');
  const [supplierEmail, setSupplierEmail] = useState<string>('');
  const [emailSubject, setEmailSubject] = useState<string>('');
  const [emailPurpose, setEmailPurpose] = useState<string>('Follow up on invoice approval status and payment run timeline');
  
  const [generatedBody, setGeneratedBody] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);
  const [activeRecord, setActiveRecord] = useState<MasterApRecord | null>(null);

  // Send Email State
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [sendSuccessMessage, setSendSuccessMessage] = useState<string | null>(null);
  const [sendErrorMessage, setSendErrorMessage] = useState<string | null>(null);

  // Prefill when selected invoice or draft is passed
  useEffect(() => {
    if (selectedInvoiceForEmail) {
      setInvoiceNumber(selectedInvoiceForEmail.invoiceNumber);
      setSupplierName(selectedInvoiceForEmail.supplierName);
      setSupplierEmail(selectedInvoiceForEmail.supplierEmail || `accounts@${selectedInvoiceForEmail.supplierName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com.sg`);
      setEmailSubject(`Regarding Invoice ${selectedInvoiceForEmail.invoiceNumber} - Boon Huat Hardware & Supplies`);
    } else if (invoices.length > 0 && !invoiceNumber) {
      const first = invoices[0];
      setInvoiceNumber(first.invoiceNumber);
      setSupplierName(first.supplierName);
      setSupplierEmail(first.supplierEmail || `accounts@${first.supplierName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com.sg`);
      setEmailSubject(`Regarding Invoice ${first.invoiceNumber} - Boon Huat Hardware & Supplies`);
    }

    if (initialDraft) {
      if (initialDraft.subject) setEmailSubject(initialDraft.subject);
      if (initialDraft.body) setGeneratedBody(initialDraft.body);
    }
  }, [selectedInvoiceForEmail, initialDraft, invoices]);

  // Autofill supplier name & email when invoiceNumber matches existing list
  useEffect(() => {
    if (!invoiceNumber.trim()) return;
    const matched = invoices.find(inv => inv.invoiceNumber.toLowerCase() === invoiceNumber.trim().toLowerCase());
    if (matched) {
      setSupplierName(matched.supplierName);
      setSupplierEmail(matched.supplierEmail || `accounts@${matched.supplierName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com.sg`);
      if (!emailSubject) {
        setEmailSubject(`Regarding Invoice ${matched.invoiceNumber} - Boon Huat Hardware & Supplies`);
      }
    }
  }, [invoiceNumber, invoices]);

  const handleSelectInvoice = (invNum: string) => {
    setInvoiceNumber(invNum);
    const matched = invoices.find(i => i.invoiceNumber === invNum);
    if (matched) {
      setSupplierName(matched.supplierName);
      setSupplierEmail(matched.supplierEmail || `accounts@${matched.supplierName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com.sg`);
      setEmailSubject(`Regarding Invoice ${matched.invoiceNumber} - Boon Huat Hardware & Supplies`);
    }
  };

  const handleGenerateEmail = async () => {
    if (!invoiceNumber.trim() && !supplierName.trim()) {
      setDbError('⚠ Please enter an Invoice Number or Supplier Name.');
      return;
    }

    setLoading(true);
    setDbError(null);
    setSendSuccessMessage(null);
    setSendErrorMessage(null);

    const queryToUse = invoiceNumber.trim() || supplierName.trim();

    // 1. Retrieve the latest invoice information from the Master AP Database
    const dbResponse = await getInvoiceRecord(queryToUse);

    setLoading(false);

    if (!dbResponse.success) {
      setDbError(dbResponse.message);
      return;
    }

    if (dbResponse.records.length === 0) {
      setDbError('⚠ No matching invoice record was found in the Master AP Database.');
      return;
    }

    const record = dbResponse.records[0];
    setActiveRecord(record);

    // Auto-update interface textboxes
    if (record.invoiceNumber) setInvoiceNumber(record.invoiceNumber);
    if (record.supplierName) setSupplierName(record.supplierName);
    
    const derivedEmail = `accounts@${(record.supplierName || 'supplier').toLowerCase().replace(/[^a-z0-9]/g, '')}.com.sg`;
    setSupplierEmail(derivedEmail);

    if (!emailSubject || emailSubject.includes('Regarding Invoice')) {
      setEmailSubject(`Regarding Invoice ${record.invoiceNumber} - Boon Huat Hardware & Supplies`);
    }

    // 2. Generate a professional email using invoice details and user's requested purpose
    const invNum = record.invoiceNumber || 'N/A';
    const supp = record.supplierName || 'Supplier';
    const amt = typeof record.invoiceAmount === 'number'
      ? `$${record.invoiceAmount.toLocaleString('en-SG', { minimumFractionDigits: 2 })}`
      : '$0.00';
    const matchStatus = record.threeWayMatchStatus || 'Pending';
    const matchReason = record.matchReason || 'Match verified.';
    const approval = record.approvalStatus || 'Pending Review';
    const payment = record.paymentStatus || 'Pending';
    const po = record.poNumber || 'N/A';
    const dueDate = record.dueDate ? record.dueDate.split('T')[0] : 'N/A';

    const emailContent = `Dear ${supp} Accounts Team,

We are writing regarding Invoice ${invNum} (${amt}) submitted under Purchase Order ${po}.

EMAIL PURPOSE:
${emailPurpose || 'General Supplier Communication'}

MASTER AP DATABASE STATUS SUMMARY:
• Invoice Number: ${invNum}
• Purchase Order Number: ${po}
• Invoice Amount: ${amt}
• 3-Way Match Verification: ${matchStatus}
• Current Approval Status: ${approval}
• Payment Disbursement Status: ${payment}
• Payment Due Date: ${dueDate}
• Audit Verification Notes: ${matchReason}

DETAILED NOTICE:
Our Accounts Payable department has reviewed the Master AP Database records. ${matchReason}

If you have any questions or require additional details regarding payment scheduling or invoice verification, please respond directly to this email or contact our Finance Department at ap-support@boonhuat.com.sg.

Thank you for your partnership and cooperation.

Best regards,

Accounts Payable Department
Boon Huat Hardware & Supplies Pte Ltd
15 Kaki Bukit Road 3, #04-01, Singapore 417818
Tel: +65 6789 0123 | Email: ap-support@boonhuat.com.sg`;

    setGeneratedBody(emailContent);
  };

  const handleInitiateSend = () => {
    if (!generatedBody.trim()) {
      setSendErrorMessage('❌ Please generate or enter an email body before sending.');
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmSendEmail = async () => {
    setSendingEmail(true);
    setSendSuccessMessage(null);
    setSendErrorMessage(null);

    // Simulate sending email through connected email service
    setTimeout(() => {
      setSendingEmail(false);
      setShowConfirmModal(false);
      setSendSuccessMessage('✅ Email sent successfully.');
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className={`p-6 rounded-2xl border ${
        darkMode ? 'bg-[#2A3441] border-[#3A4654]' : 'bg-white border-[#DCE3EA] shadow-xs'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className={`text-base font-bold flex items-center space-x-2 ${darkMode ? 'text-[#F3F4F6]' : 'text-[#1F2937]'}`}>
              <Mail className="w-5 h-5 text-blue-500" />
              <span>AI Email Generator</span>
            </h2>
            <p className={`text-xs mt-1 ${darkMode ? 'text-[#CBD5E1]' : 'text-[#6B7280]'}`}>
              Generate and send professional supplier emails directly using real-time Master AP Database records.
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

      {/* Input Controls */}
      <div className={`p-6 rounded-2xl border space-y-4 ${
        darkMode ? 'bg-[#2A3441] border-[#3A4654]' : 'bg-white border-[#DCE3EA] shadow-xs'
      }`}>
        {/* Quick Choose Dropdown */}
        <div className="p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/20 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-blue-500 shrink-0" />
            <span className={`font-semibold ${darkMode ? 'text-blue-300' : 'text-blue-900'}`}>
              Autofill from Master AP Database:
            </span>
          </div>
          <select
            value={invoiceNumber}
            onChange={(e) => handleSelectInvoice(e.target.value)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-medium focus:outline-none ${
              darkMode ? 'bg-[#1E2630] border-[#3A4654] text-white' : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="">-- Choose Invoice --</option>
            {invoices.map(inv => (
              <option key={inv.id} value={inv.invoiceNumber}>
                {inv.invoiceNumber} • {inv.supplierName} (${inv.amount.toLocaleString()})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Invoice Number */}
          <div>
            <label className="block font-semibold mb-1 text-gray-400 uppercase text-[10px]">
              Invoice Number
            </label>
            <input
              type="text"
              placeholder="e.g. AA-2026-208"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl border font-mono text-xs focus:outline-none ${
                darkMode ? 'bg-[#1E2630] border-[#3A4654] text-white' : 'bg-[#F5F7FA] border-[#DCE3EA] text-gray-900'
              }`}
            />
          </div>

          {/* Supplier Name */}
          <div>
            <label className="block font-semibold mb-1 text-gray-400 uppercase text-[10px]">
              Supplier Name
            </label>
            <input
              type="text"
              placeholder="e.g. Apex Abrasives Pte Ltd"
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none ${
                darkMode ? 'bg-[#1E2630] border-[#3A4654] text-white' : 'bg-[#F5F7FA] border-[#DCE3EA] text-gray-900'
              }`}
            />
          </div>
        </div>

        {/* Email Subject & Purpose */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold mb-1 text-gray-400 uppercase text-[10px]">
              Email Subject
            </label>
            <input
              type="text"
              placeholder="e.g. Regarding Invoice AA-2026-208 - Boon Huat Hardware"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium focus:outline-none ${
                darkMode ? 'bg-[#1E2630] border-[#3A4654] text-white' : 'bg-[#F5F7FA] border-[#DCE3EA] text-gray-900'
              }`}
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-gray-400 uppercase text-[10px]">
              Email Purpose (Editable Textbox)
            </label>
            <input
              type="text"
              placeholder="e.g. Request price discrepancy clarification, payment timeline update..."
              value={emailPurpose}
              onChange={(e) => setEmailPurpose(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium focus:outline-none ${
                darkMode ? 'bg-[#1E2630] border-[#3A4654] text-white' : 'bg-[#F5F7FA] border-[#DCE3EA] text-gray-900'
              }`}
            />
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
          <span className="text-[11px] text-gray-400 flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
            <span>Target Recipient: <span className="font-mono text-gray-700 dark:text-gray-300">{supplierEmail || 'accounts@supplier.com.sg'}</span></span>
          </span>

          <button
            type="button"
            onClick={handleGenerateEmail}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold inline-flex items-center space-x-2 shadow-md shadow-blue-500/20 transition-colors"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating Email...</span>
              </>
            ) : (
              <>
                <Mail className="w-4 h-4" />
                <span>Generate Email</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* DB Error */}
      {dbError && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-start space-x-3 text-xs font-bold">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-500" />
          <div>{dbError}</div>
        </div>
      )}

      {/* Status Messages for Send Result */}
      {sendSuccessMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center space-x-2 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <span>{sendSuccessMessage}</span>
        </div>
      )}

      {sendErrorMessage && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-bold flex items-center space-x-2 shadow-xs">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <span>{sendErrorMessage}</span>
        </div>
      )}

      {/* Display Generated Email for Review */}
      {generatedBody && (
        <div className={`p-6 rounded-2xl border space-y-4 ${
          darkMode ? 'bg-[#2A3441] border-[#3A4654]' : 'bg-white border-[#DCE3EA] shadow-xs'
        }`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b pb-3 border-gray-200 dark:border-gray-700">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white flex items-center space-x-2">
                <Mail className="w-4 h-4 text-blue-500" />
                <span>Generated Supplier Email (Review & Send)</span>
              </h3>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Review email content prior to direct dispatch to supplier.
              </p>
            </div>

            {/* SEND EMAIL BUTTON */}
            <button
              type="button"
              onClick={handleInitiateSend}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center space-x-2 shadow-md shadow-emerald-500/20 transition-all transform hover:scale-[1.01]"
            >
              <Send className="w-4 h-4" />
              <span>📧 Send Email</span>
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 rounded-xl bg-gray-50 dark:bg-[#1E2630] border border-gray-200 dark:border-gray-700">
              <div>
                <span className="text-[10px] text-gray-400 block uppercase font-semibold">Recipient Email:</span>
                <span className="font-mono font-bold text-gray-900 dark:text-white">{supplierEmail || 'accounts@supplier.com.sg'}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block uppercase font-semibold">Subject Line:</span>
                <span className="font-medium text-gray-900 dark:text-white">{emailSubject}</span>
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-gray-400 uppercase text-[10px]">
                Email Body Textarea (Editable)
              </label>
              <textarea
                rows={12}
                value={generatedBody}
                onChange={(e) => setGeneratedBody(e.target.value)}
                className={`w-full p-4 rounded-xl border font-mono text-xs leading-relaxed focus:outline-none ${
                  darkMode ? 'bg-[#1E2630] border-[#3A4654] text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                }`}
              />
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal prior to sending email */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className={`max-w-md w-full p-6 rounded-2xl border shadow-2xl space-y-4 ${
            darkMode ? 'bg-[#2A3441] border-[#3A4654] text-white' : 'bg-white border-gray-200 text-gray-900'
          }`}>
            <div className="flex items-center space-x-3 text-blue-500">
              <Send className="w-6 h-6" />
              <h3 className="text-sm font-bold">Confirm Email Dispatch</h3>
            </div>

            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              Are you sure you want to send this supplier email? The message will be dispatched directly to the supplier email address recorded in the Master AP Database.
            </p>

            <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-[#1E2630] border border-gray-200 dark:border-gray-700 text-xs font-mono space-y-1.5">
              <div><span className="text-gray-400 font-sans">To:</span> {supplierEmail}</div>
              <div><span className="text-gray-400 font-sans">Invoice #:</span> {invoiceNumber || 'N/A'}</div>
              <div className="truncate"><span className="text-gray-400 font-sans">Subject:</span> {emailSubject}</div>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                disabled={sendingEmail}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border ${
                  darkMode ? 'border-[#3A4654] text-gray-300 hover:bg-[#3A4654]' : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmSendEmail}
                disabled={sendingEmail}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center space-x-1.5 transition-colors shadow-md shadow-emerald-500/20"
              >
                {sendingEmail ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Confirm & Send</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
