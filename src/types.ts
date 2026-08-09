export type InvoiceStatus = 'Pending Review' | 'Approved' | 'Rejected / Duplicate';
export type PaymentStatus = 'Pending' | 'Scheduled' | 'Paid' | 'Hold';
export type MatchStatus = 'Passed' | 'Failed - Quantity Mismatch' | 'Failed - Price Mismatch' | 'Failed - Supplier Mismatch' | 'Missing PO' | 'Missing GRN' | 'Duplicate Detected';

export interface InvoiceItem {
  id: string;
  invoiceNumber: string;
  supplierName: string;
  supplierEmail: string;
  invoiceDate: string;
  amount: number;
  description: string;
  threeWayMatchResult: MatchStatus;
  matchDetails: {
    poNumber: string;
    grnNumber: string;
    poAmount: number;
    invoiceAmount: number;
    poQty?: number;
    invoiceQty?: number;
    grnQty?: number;
    unitPricePo?: number;
    unitPriceInvoice?: number;
  };
  invoiceStatus: InvoiceStatus;
  paymentStatus: PaymentStatus;
  paymentDueDate?: string;
  paymentDate?: string;
  duplicateAlert?: {
    isDuplicate: boolean;
    matchedInvoiceNumber?: string;
    similarityReason?: string;
  };
  additionalNotes?: string;
  communicationHistory: {
    id: string;
    date: string;
    sender: 'Supplier' | 'Madam Lim (Boon Huat)';
    message: string;
  }[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'edith';
  text: string;
  timestamp: string;
  modelUsed?: string;
  invoiceContext?: string;
}

export interface EnquiryRequest {
  invoiceNumber: string;
  supplierName: string;
  questionType: 'approval_status' | 'payment_delay' | 'payment_schedule' | 'under_review' | 'missing_documents' | 'custom';
  customQuestion?: string;
}

export interface ResolutionResponse {
  supplier: string;
  invoiceNumber: string;
  currentInvoiceStatus: string;
  currentPaymentStatus: string;
  reason: string;
  recommendedNextAction: string;
  paymentDueDate?: string;
  paymentDate?: string;
  threeWayMatchResult?: string;
  emailDraft: {
    subject: string;
    greeting: string;
    body: string;
    closing: string;
  };
}
