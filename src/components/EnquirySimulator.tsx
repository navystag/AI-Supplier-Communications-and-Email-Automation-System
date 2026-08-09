import React, { useState, useEffect } from 'react';
import { MessageSquare, Sparkles, Copy, Check, Database, RefreshCw, AlertTriangle, Search, Send } from 'lucide-react';
import { InvoiceItem } from '../types';
import { getInvoiceRecord, MasterApRecord } from '../services/masterDbService';

interface EnquirySimulatorProps {
  invoices: InvoiceItem[];
  onOpenEmailTabWithDraft?: (draft: any, invoice: InvoiceItem) => void;
  darkMode: boolean;
}

export const EnquirySimulator: React.FC<EnquirySimulatorProps> = ({
  invoices,
  onOpenEmailTabWithDraft,
  darkMode
}) => {
  const [invoiceNumber, setInvoiceNumber] = useState<string>('');
  const [supplierName, setSupplierName] = useState<string>('');
  const [enquiryType, setEnquiryType] = useState<string>('Request payment status update');
  const [generatedEnquiry, setGeneratedEnquiry] = useState<string>('');
  
  const [loading, setLoading] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);
  const [activeRecord, setActiveRecord] = useState<MasterApRecord | null>(null);
  const [copied, setCopied] = useState(false);

  // Quick preset examples for enquiry type
  const presetEnquiries = [
    'Request delivery update',
    'Clarify quantity discrepancy',
    'Follow up on overdue invoice',
    'Missing Goods Received Note',
    'Price discrepancy',
    'Request revised invoice',
    'Payment status enquiry'
  ];

  // Auto-fill supplier name whenever invoiceNumber changes and matches an invoice
  useEffect(() => {
    if (!invoiceNumber.trim()) return;
    const cleanNum = invoiceNumber.trim().toLowerCase();
    const matched = invoices.find(inv => inv.invoiceNumber.toLowerCase() === cleanNum);
    if (matched) {
      setSupplierName(matched.supplierName);
    }
  }, [invoiceNumber, invoices]);

  // Handle invoice selection from existing Master AP list
  const handleSelectInvoice = (invNum: string) => {
    setInvoiceNumber(invNum);
    const matched = invoices.find(i => i.invoiceNumber === invNum);
    if (matched) {
      setSupplierName(matched.supplierName);
    }
  };

  const handleGenerateEnquiry = async () => {
    if (!invoiceNumber.trim() && !supplierName.trim()) {
      setDbError('⚠ Please enter an Invoice Number or Supplier Name.');
      return;
    }

    setLoading(true);
    setDbError(null);
    setGeneratedEnquiry('');
    setActiveRecord(null);

    const queryToUse = invoiceNumber.trim() || supplierName.trim();

    // Retrieve invoice information from Master AP Database using Google Apps Script
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

    // Auto-populate input fields with real database values
    if (record.invoiceNumber) setInvoiceNumber(record.invoiceNumber);
    if (record.supplierName) setSupplierName(record.supplierName);

    // Construct a formal, professional supplier enquiry
    const invNum = record.invoiceNumber || invoiceNumber || 'N/A';
    const supp = record.supplierName || supplierName || 'Supplier';
    const amt = typeof record.invoiceAmount === 'number'
      ? `$${record.invoiceAmount.toLocaleString('en-SG', { minimumFractionDigits: 2 })}`
      : '$0.00';
    const matchStatus = record.threeWayMatchStatus || 'Pending';
    const matchReason = record.matchReason || 'Record matches PO and GRN specs.';
    const approval = record.approvalStatus || 'Pending Review';
    const payment = record.paymentStatus || 'Pending';
    const po = record.poNumber || 'N/A';
    const dueDate = record.dueDate ? record.dueDate.split('T')[0] : 'N/A';

    const formalText = `DEAR ${supp.toUpperCase()} ACCOUNTS TEAM,

RE: FORMAL SUPPLIER ENQUIRY - INVOICE ${invNum} (PO: ${po})

We are contacting you regarding Invoice ${invNum} for ${amt} issued to Boon Huat Hardware & Supplies Pte Ltd.

ENQUIRY SUBJECT:
"${enquiryType || 'General Invoice Status Enquiry'}"

MASTER AP DATABASE STATUS DETAILS:
• Invoice Number: ${invNum}
• Supplier Name: ${supp}
• Purchase Order: ${po}
• Invoice Amount: ${amt}
• 3-Way Match Status: ${matchStatus}
• Approval Status: ${approval}
• Payment Status: ${payment}
• Due Date: ${dueDate}
• Audit Verification Note: ${matchReason}

BUSINESS PURPOSE & ACTION REQUEST:
Regarding your enquiry ("${enquiryType}"), our Master AP Database reflects an Approval Status of "${approval}" and 3-Way Match Status of "${matchStatus}". ${matchReason}

Please verify the above details with your accounts receivable department. If any further supporting documentation (such as revised delivery orders or updated credit notes) is required, kindly advise at your earliest convenience.

Best regards,

Accounts Payable Department
Boon Huat Hardware & Supplies Pte Ltd
Contact: ap-support@boonhuat.com.sg | +65 6789 0123`;

    setGeneratedEnquiry(formalText);
  };

  const handleCopy = () => {
    if (!generatedEnquiry) return;
    navigator.clipboard.writeText(generatedEnquiry);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
              <MessageSquare className="w-5 h-5 text-blue-500" />
              <span>AI Supplier Enquiry</span>
            </h2>
            <p className={`text-xs mt-1 ${darkMode ? 'text-[#CBD5E1]' : 'text-[#6B7280]'}`}>
              Generate formal supplier enquiries based on real-time invoice records retrieved from the Master AP Database.
            </p>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-semibold flex items-center space-x-1.5">
              <Database className="w-3.5 h-3.5" />
              <span>Master AP DB Connected</span>
            </span>
            <span className="px-2.5 py-1 rounded-full bg-gray-500/10 text-gray-500 border border-gray-500/20 text-xs font-mono font-medium">
              READ ONLY
            </span>
          </div>
        </div>
      </div>

      {/* Input Form */}
      <div className={`p-6 rounded-2xl border space-y-5 ${
        darkMode ? 'bg-[#2A3441] border-[#3A4654]' : 'bg-white border-[#DCE3EA] shadow-xs'
      }`}>
        {/* Quick Select Dropdown for Autofill */}
        <div className="p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/20 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-blue-500 shrink-0" />
            <span className={`font-semibold ${darkMode ? 'text-blue-300' : 'text-blue-900'}`}>
              Select Existing Invoice to Autofill:
            </span>
          </div>
          <select
            value={invoiceNumber}
            onChange={(e) => handleSelectInvoice(e.target.value)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-medium focus:outline-none ${
              darkMode ? 'bg-[#1E2630] border-[#3A4654] text-white' : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="">-- Choose Invoice Number --</option>
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
            <label className="block font-semibold mb-1.5 text-gray-400 uppercase text-[10px]">
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
            <label className="block font-semibold mb-1.5 text-gray-400 uppercase text-[10px]">
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

        {/* Enquiry Type (Fully Typable Textbox) */}
        <div className="space-y-2">
          <label className="block font-semibold text-gray-400 uppercase text-[10px]">
            Enquiry Type (Fully Typable)
          </label>
          <input
            type="text"
            placeholder="e.g. Request delivery update, Clarify quantity discrepancy, Price discrepancy..."
            value={enquiryType}
            onChange={(e) => setEnquiryType(e.target.value)}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium focus:outline-none ${
              darkMode ? 'bg-[#1E2630] border-[#3A4654] text-white' : 'bg-[#F5F7FA] border-[#DCE3EA] text-gray-900'
            }`}
          />

          {/* Preset Example Pills */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="text-[10px] text-gray-400 font-medium py-1">Quick Suggestions:</span>
            {presetEnquiries.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setEnquiryType(preset)}
                className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors ${
                  enquiryType === preset
                    ? 'bg-blue-600 text-white border-blue-600'
                    : darkMode
                    ? 'bg-[#1E2630] border-[#3A4654] text-gray-300 hover:bg-[#3A4654]'
                    : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handleGenerateEnquiry}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold inline-flex items-center space-x-2 shadow-md shadow-blue-500/20 transition-colors"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Retrieving Master AP Database...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Generate Enquiry</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* DB Error or Not Found Display */}
      {dbError && (
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-start space-x-3 text-xs font-bold">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-500" />
          <div className="space-y-1">
            <div>{dbError}</div>
          </div>
        </div>
      )}

      {/* Active Record Details & Generated Enquiry Text Area */}
      {activeRecord && generatedEnquiry && (
        <div className="space-y-6">
          {/* Master AP Database Synced Record Details */}
          <div className={`p-5 rounded-2xl border space-y-3 ${
            darkMode ? 'bg-[#2A3441] border-[#3A4654]' : 'bg-white border-[#DCE3EA] shadow-xs'
          }`}>
            <div className="flex items-center justify-between border-b pb-2 border-gray-200 dark:border-gray-700">
              <span className="text-[11px] font-mono font-bold text-blue-500 uppercase flex items-center space-x-1.5">
                <Database className="w-3.5 h-3.5" />
                <span>Retrieved Master AP Database Record</span>
              </span>
              <span className="text-[10px] font-mono text-gray-400">
                PO: {activeRecord.poNumber || 'N/A'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div>
                <span className="text-[10px] text-gray-400 block font-sans">Invoice Number</span>
                <span className="font-bold text-gray-900 dark:text-white">{activeRecord.invoiceNumber}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block font-sans">Supplier</span>
                <span className="font-bold text-gray-900 dark:text-white truncate block">{activeRecord.supplierName}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block font-sans">Amount</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">${activeRecord.invoiceAmount}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block font-sans">3-Way Match</span>
                <span className={`font-bold ${activeRecord.threeWayMatchStatus.includes('Passed') ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {activeRecord.threeWayMatchStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Generated Enquiry Display */}
          <div className={`p-6 rounded-2xl border space-y-4 ${
            darkMode ? 'bg-[#2A3441] border-[#3A4654]' : 'bg-white border-[#DCE3EA] shadow-xs'
          }`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-blue-500" />
                  <span>Generated Supplier Enquiry (Editable)</span>
                </h3>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Formal, professional supplier enquiry generated using retrieved Master AP Database details.
                </p>
              </div>

              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold inline-flex items-center space-x-1.5 transition-colors shadow-xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied Enquiry!' : 'Copy Enquiry'}</span>
                </button>

                {onOpenEmailTabWithDraft && (
                  <button
                    type="button"
                    onClick={() => onOpenEmailTabWithDraft({
                      subject: `Supplier Enquiry: Invoice ${activeRecord.invoiceNumber} - Boon Huat Hardware`,
                      greeting: `Dear ${activeRecord.supplierName} Accounts Team,`,
                      body: generatedEnquiry,
                      closing: 'Best regards,\nAccounts Payable Department\nBoon Huat Hardware & Supplies Pte Ltd'
                    }, {
                      id: `master-${activeRecord.invoiceNumber}`,
                      invoiceNumber: activeRecord.invoiceNumber,
                      supplierName: activeRecord.supplierName,
                      supplierEmail: `accounts@${activeRecord.supplierName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com.sg`,
                      invoiceDate: activeRecord.dueDate ? activeRecord.dueDate.split('T')[0] : '2026-08-05',
                      amount: activeRecord.invoiceAmount,
                      description: activeRecord.matchReason,
                      threeWayMatchResult: (activeRecord.threeWayMatchStatus.includes('Passed') ? 'Passed' : 'Failed - Quantity Mismatch') as any,
                      matchDetails: {
                        poNumber: activeRecord.poNumber,
                        grnNumber: activeRecord.poNumber.replace('PO-', 'GRN-'),
                        poAmount: activeRecord.invoiceAmount,
                        invoiceAmount: activeRecord.invoiceAmount
                      },
                      invoiceStatus: (activeRecord.approvalStatus.includes('Approved') ? 'Approved' : 'Pending Review') as any,
                      paymentStatus: 'Pending',
                      communicationHistory: []
                    })}
                    className="px-4 py-2 rounded-xl border border-blue-500/30 text-blue-500 hover:bg-blue-500/10 text-xs font-semibold inline-flex items-center space-x-1.5 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Open in Email Generator</span>
                  </button>
                )}
              </div>
            </div>

            {/* Editable Text Area for generated enquiry */}
            <textarea
              rows={12}
              value={generatedEnquiry}
              onChange={(e) => setGeneratedEnquiry(e.target.value)}
              className={`w-full p-4 rounded-xl border font-mono text-xs leading-relaxed focus:outline-none ${
                darkMode ? 'bg-[#1E2630] border-[#3A4654] text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
              }`}
            />
          </div>
        </div>
      )}
    </div>
  );
};
