import { InvoiceItem, MatchStatus, InvoiceStatus, PaymentStatus } from '../types';

export interface MasterApRecord {
  invoiceNumber: string;
  supplierName: string;
  poNumber: string;
  invoiceAmount: number;
  threeWayMatchStatus: string;
  matchReason: string;
  approvalStatus: string;
  dueDate: string;
  paymentStatus: string;
  duplicateInvoiceStatus: string;
  paymentDate: string;
  lastUpdated: string;
}

export interface GetInvoiceRecordResult {
  success: boolean;
  records: MasterApRecord[];
  items: InvoiceItem[];
  message: string;
  source?: 'apps-script' | 'sheet-csv';
}

export const DEFAULT_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1-VuTBVMpxlizBK6qseCbYfpGhXJ3xwkj2fFUJih_tyo/edit?usp=sharing';

export function getMasterDbConfig() {
  let sheetUrl = localStorage.getItem('master_db_sheet_url') || DEFAULT_SHEET_URL;

  // Auto-migrate old default URLs
  if (sheetUrl.includes('14RiLgdStO2O0gpaR1fm50fvztfd7K60o2Ik75VeWT0g')) {
    sheetUrl = DEFAULT_SHEET_URL;
    localStorage.setItem('master_db_sheet_url', DEFAULT_SHEET_URL);
  }

  return { webAppUrl: '', sheetUrl };
}

export function setMasterDbConfig(webAppUrl: string, sheetUrl: string) {
  // We keep the webAppUrl parameter for signature backward compatibility, but we only persist sheetUrl
  if (sheetUrl) {
    localStorage.setItem('master_db_sheet_url', sheetUrl.trim());
  }
}

/**
 * Extracts Google Spreadsheet ID from a standard Google Sheet URL.
 */
export function extractSpreadsheetId(sheetUrl: string): string | null {
  const match = sheetUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : null;
}

/**
 * Parses raw CSV text into a 2D array of string cells handling quoted fields.
 */
function parseCsvLines(csvText: string): string[][] {
  const lines: string[][] = [];
  const rawLines = csvText.split(/\r?\n/);
  
  for (let rawLine of rawLines) {
    if (!rawLine.trim()) continue;
    
    const row: string[] = [];
    let cur = '';
    let inQuotes = false;
    
    for (let i = 0; i < rawLine.length; i++) {
      const char = rawLine[i];
      if (char === '"') {
        if (inQuotes && rawLine[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        row.push(cur);
        cur = '';
      } else {
        cur += char;
      }
    }
    row.push(cur);
    
    // Clean up surrounding quotes from each cell
    const cleanedRow = row.map(cell => {
      let c = cell.trim();
      while (c.startsWith('"') && c.endsWith('"') && c.length >= 2) {
        c = c.substring(1, c.length - 1).trim();
      }
      return c;
    });
    
    lines.push(cleanedRow);
  }
  
  return lines;
}

/**
 * Direct Google Sheet CSV reader reading from worksheet named "MasterSheet".
 */
async function fetchFromGoogleSheetCsv(sheetUrl: string): Promise<{ success: boolean; records: MasterApRecord[]; message: string }> {
  const spreadsheetId = extractSpreadsheetId(sheetUrl) || '1-VuTBVMpxlizBK6qseCbYfpGhXJ3xwkj2fFUJih_tyo';
  // Use worksheet named "MasterSheet" parameter to target it specifically
  const csvExportUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&sheet=MasterSheet`;

  try {
    const res = await fetch(csvExportUrl);
    if (!res.ok) {
      return {
        success: false,
        records: [],
        message: 'Unable to retrieve data from the Master Database. Please check the Google Sheet URL and sharing permissions.'
      };
    }

    const csvText = await res.text();
    const rows = parseCsvLines(csvText);

    if (rows.length < 1) {
      return {
        success: false,
        records: [],
        message: 'Unable to retrieve data from the Master Database. Please check the Google Sheet URL and sharing permissions.'
      };
    }

    const records: MasterApRecord[] = [];

    // Columns are mapped as:
    // A (0) – Invoice Number
    // B (1) – Supplier
    // C (2) – PO Number
    // D (3) – Invoice Amount
    // E (4) – Amount
    // F (5) – Match Status
    // G (6) – Match Reason
    // H (7) – Approval Status
    // I (8) – Due Date
    // J (9) – Payment Status
    // K (10) – Duplicate Invoice
    // L (11) – Payment Date
    // M (12) – Last Updated
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.length === 0) continue;

      const invNum = String(row[0] || '').trim();
      
      // Skip headers if repeated or empty lines
      if (!invNum || invNum.toLowerCase().includes('invoice number') || invNum === 'A') continue;

      const rawAmountStr = String(row[3] || '0').replace(/[^0-9.]/g, '');

      records.push({
        invoiceNumber: invNum,
        supplierName: String(row[1] || '').trim(),
        poNumber: String(row[2] || '').trim(),
        invoiceAmount: parseFloat(rawAmountStr) || 0,
        threeWayMatchStatus: String(row[5] || '').trim(),
        matchReason: String(row[6] || '').trim(),
        approvalStatus: String(row[7] || '').trim(),
        dueDate: String(row[8] || '').trim(),
        paymentStatus: String(row[9] || '').trim(),
        duplicateInvoiceStatus: String(row[10] || '').trim(),
        paymentDate: String(row[11] || '').trim(),
        lastUpdated: String(row[12] || '').trim(),
      });
    }

    return {
      success: true,
      records,
      message: ''
    };
  } catch (err: any) {
    return {
      success: false,
      records: [],
      message: 'Unable to retrieve data from the Master Database. Please check the Google Sheet URL and sharing permissions.'
    };
  }
}

/**
 * Direct retriever that reads from Google Sheet Master AP Database.
 */
export async function getInvoiceRecord(query?: string): Promise<GetInvoiceRecordResult> {
  const { sheetUrl } = getMasterDbConfig();

  const csvResult = await fetchFromGoogleSheetCsv(sheetUrl);
  if (!csvResult.success) {
    return {
      success: false,
      records: [],
      items: [],
      message: csvResult.message,
      source: 'sheet-csv'
    };
  }

  const rawRecords = csvResult.records;
  let filteredRecords = rawRecords;

  if (query && query.trim()) {
    const q = query.trim().toLowerCase();
    filteredRecords = rawRecords.filter(
      rec =>
        rec.invoiceNumber.toLowerCase().includes(q) ||
        rec.supplierName.toLowerCase().includes(q) ||
        rec.poNumber.toLowerCase().includes(q)
    );

    if (filteredRecords.length === 0) {
      return {
        success: false,
        records: [],
        items: [],
        message: '⚠ No matching invoice record was found in the Master AP Database.',
        source: 'sheet-csv'
      };
    }
  }

  const items = filteredRecords.map(convertMasterRecordToInvoiceItem);

  return {
    success: true,
    records: filteredRecords,
    items,
    message: '',
    source: 'sheet-csv'
  };
}

export function convertMasterRecordToInvoiceItem(rec: MasterApRecord, idx: number): InvoiceItem {
  let threeWayMatchResult: MatchStatus = 'Passed';
  const matchStatusStr = rec.threeWayMatchStatus.toLowerCase();
  const reasonStr = rec.matchReason.toLowerCase();

  if (matchStatusStr.includes('passed')) {
    threeWayMatchResult = 'Passed';
  } else if (reasonStr.includes('duplicate') || rec.duplicateInvoiceStatus.toLowerCase() === 'yes') {
    threeWayMatchResult = 'Duplicate Detected';
  } else if (reasonStr.includes('price') || reasonStr.includes('overbilling') || reasonStr.includes('unit price')) {
    threeWayMatchResult = 'Failed - Price Mismatch';
  } else if (reasonStr.includes('quantity') || reasonStr.includes('units') || reasonStr.includes('qty') || reasonStr.includes('damaged') || reasonStr.includes('exceeds')) {
    threeWayMatchResult = 'Failed - Quantity Mismatch';
  } else if (reasonStr.includes('missing purchase order') || reasonStr.includes('missing po') || rec.poNumber === 'N/A') {
    threeWayMatchResult = 'Missing PO';
  } else if (reasonStr.includes('missing grn') || reasonStr.includes('missing goods')) {
    threeWayMatchResult = 'Missing GRN';
  } else if (matchStatusStr.includes('failed')) {
    threeWayMatchResult = 'Failed - Quantity Mismatch';
  }

  let invoiceStatus: InvoiceStatus = 'Pending Review';
  if (rec.approvalStatus.toLowerCase().includes('approved')) {
    invoiceStatus = 'Approved';
  } else if (
    rec.approvalStatus.toLowerCase().includes('flagged') ||
    rec.approvalStatus.toLowerCase().includes('rejected') ||
    rec.approvalStatus.toLowerCase().includes('investigation')
  ) {
    invoiceStatus = 'Rejected / Duplicate';
  } else {
    invoiceStatus = 'Pending Review';
  }

  let paymentStatus: PaymentStatus = 'Pending';
  if (rec.paymentStatus.toLowerCase().includes('paid')) {
    paymentStatus = 'Paid';
  } else if (rec.paymentStatus.toLowerCase().includes('scheduled')) {
    paymentStatus = 'Scheduled';
  } else if (rec.paymentStatus.toLowerCase().includes('hold')) {
    paymentStatus = 'Hold';
  } else if (invoiceStatus === 'Rejected / Duplicate') {
    paymentStatus = 'Hold';
  }

  const sanitizedSupplier = rec.supplierName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const supplierEmail = `accounts@${sanitizedSupplier || 'supplier'}.com.sg`;

  return {
    id: `master-${rec.invoiceNumber || idx}`,
    invoiceNumber: rec.invoiceNumber,
    supplierName: rec.supplierName,
    supplierEmail,
    invoiceDate: rec.dueDate ? rec.dueDate.split('T')[0] : '2026-08-05',
    amount: rec.invoiceAmount,
    description: rec.matchReason || `Invoice ${rec.invoiceNumber} for ${rec.supplierName}`,
    threeWayMatchResult,
    matchDetails: {
      poNumber: rec.poNumber || 'N/A',
      grnNumber: rec.poNumber !== 'N/A' ? rec.poNumber.replace('PO-', 'GRN-') : 'N/A',
      poAmount: rec.invoiceAmount,
      invoiceAmount: rec.invoiceAmount
    },
    invoiceStatus,
    paymentStatus,
    paymentDueDate: rec.dueDate ? rec.dueDate.split('T')[0] : undefined,
    paymentDate: rec.paymentDate ? rec.paymentDate.split('T')[0] : undefined,
    additionalNotes: rec.matchReason,
    communicationHistory: []
  };
}
