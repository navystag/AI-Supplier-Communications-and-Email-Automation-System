import { InvoiceItem } from '../types';

export const INITIAL_INVOICES: InvoiceItem[] = [
  {
    id: 'inv-1058',
    invoiceNumber: 'INV-1058',
    supplierName: 'Tan Brothers Metal Works',
    supplierEmail: 'accounts@tanbrothersmetal.com.sg',
    invoiceDate: '2026-07-28',
    amount: 14500.00,
    description: 'High-tensile steel rebars (16mm) - 100 units',
    threeWayMatchResult: 'Failed - Quantity Mismatch',
    matchDetails: {
      poNumber: 'PO-9942',
      grnNumber: 'GRN-5510',
      poAmount: 13775.00,
      invoiceAmount: 14500.00,
      poQty: 95,
      invoiceQty: 100,
      grnQty: 95,
      unitPricePo: 145.00,
      unitPriceInvoice: 145.00
    },
    invoiceStatus: 'Pending Review',
    paymentStatus: 'Hold',
    additionalNotes: 'Quantity received on site by warehouse team is 95 units, but supplier invoiced for 100 units.',
    communicationHistory: [
      {
        id: 'comm-1',
        date: '2026-08-01 10:30',
        sender: 'Supplier',
        message: 'Checking status of INV-1058 amounting to $14,500. Kindly update on payment schedule.'
      }
    ]
  },
  {
    id: 'inv-1062',
    invoiceNumber: 'INV-1062',
    supplierName: 'Lian Seng Steel Pte Ltd',
    supplierEmail: 'billing@liansengsteel.com',
    invoiceDate: '2026-08-01',
    amount: 8250.50,
    description: 'Galvanized iron pipes 2-inch (Bundle of 50)',
    threeWayMatchResult: 'Passed',
    matchDetails: {
      poNumber: 'PO-9950',
      grnNumber: 'GRN-5518',
      poAmount: 8250.50,
      invoiceAmount: 8250.50,
      poQty: 50,
      invoiceQty: 50,
      grnQty: 50
    },
    invoiceStatus: 'Approved',
    paymentStatus: 'Scheduled',
    paymentDueDate: '2026-08-18',
    additionalNotes: 'All quantities and unit prices match PO and GRN perfectly. Scheduled for bi-monthly GI payment run.',
    communicationHistory: [
      {
        id: 'comm-2',
        date: '2026-08-03 14:15',
        sender: 'Supplier',
        message: 'Good afternoon, confirming receipt of PO-9950 invoice. When can we expect payment disbursement?'
      }
    ]
  },
  {
    id: 'inv-1045',
    invoiceNumber: 'INV-1045',
    supplierName: 'Chop Seng Huat Hardware',
    supplierEmail: 'finance@chopsenghuat.com.sg',
    invoiceDate: '2026-07-15',
    amount: 3420.00,
    description: 'Heavy duty construction fasteners & bolts',
    threeWayMatchResult: 'Passed',
    matchDetails: {
      poNumber: 'PO-9912',
      grnNumber: 'GRN-5480',
      poAmount: 3420.00,
      invoiceAmount: 3420.00
    },
    invoiceStatus: 'Approved',
    paymentStatus: 'Paid',
    paymentDueDate: '2026-07-30',
    paymentDate: '2026-07-30',
    additionalNotes: 'Payment successfully processed via OCBC corporate GIRO transfer.',
    communicationHistory: [
      {
        id: 'comm-3',
        date: '2026-07-31 09:00',
        sender: 'Supplier',
        message: 'Thank you for prompt settlement of INV-1045.'
      }
    ]
  },
  {
    id: 'inv-1070',
    invoiceNumber: 'INV-1070',
    supplierName: 'Federal Hardware Supplies',
    supplierEmail: 'accounts@federalhardware.sg',
    invoiceDate: '2026-08-02',
    amount: 5400.00,
    description: 'Copper wire coils 4mm (120 rolls)',
    threeWayMatchResult: 'Failed - Price Mismatch',
    matchDetails: {
      poNumber: 'PO-9965',
      grnNumber: 'GRN-5525',
      poAmount: 5040.00,
      invoiceAmount: 5400.00,
      unitPricePo: 42.00,
      unitPriceInvoice: 45.00
    },
    invoiceStatus: 'Pending Review',
    paymentStatus: 'Hold',
    additionalNotes: 'PO unit price agreed at $42.00 per roll, but invoice states $45.00 per roll (+ $360 variance).',
    communicationHistory: [
      {
        id: 'comm-4',
        date: '2026-08-04 11:20',
        sender: 'Supplier',
        message: 'Please process INV-1070 for copper wire coils.'
      }
    ]
  },
  {
    id: 'inv-1075',
    invoiceNumber: 'INV-1075',
    supplierName: 'Hin Leong Bolts & Nuts',
    supplierEmail: 'sales@hinleongbolts.com',
    invoiceDate: '2026-08-03',
    amount: 1850.00,
    description: 'M12 Galvanized Hex Bolts & Nuts',
    threeWayMatchResult: 'Duplicate Detected',
    matchDetails: {
      poNumber: 'PO-9930',
      grnNumber: 'GRN-5501',
      poAmount: 1850.00,
      invoiceAmount: 1850.00
    },
    invoiceStatus: 'Rejected / Duplicate',
    paymentStatus: 'Hold',
    duplicateAlert: {
      isDuplicate: true,
      matchedInvoiceNumber: 'INV-1031',
      similarityReason: 'Exact invoice amount ($1,850.00), same supplier, and matching PO-9930 which was already paid on 2026-07-10.'
    },
    additionalNotes: 'Flagged by AI Duplicate Payment Detection system (App 2). Invoice was re-submitted by supplier erroneously.',
    communicationHistory: []
  },
  {
    id: 'inv-1081',
    invoiceNumber: 'INV-1081',
    supplierName: 'Soon Heng Timber & Hardware',
    supplierEmail: 'finance@soonheng.com.sg',
    invoiceDate: '2026-08-04',
    amount: 6700.00,
    description: 'Marine plywood panels 18mm',
    threeWayMatchResult: 'Missing GRN',
    matchDetails: {
      poNumber: 'PO-9978',
      grnNumber: 'PENDING',
      poAmount: 6700.00,
      invoiceAmount: 6700.00
    },
    invoiceStatus: 'Pending Review',
    paymentStatus: 'Hold',
    additionalNotes: 'Goods received note has not been signed off by warehouse supervisor Mr. Muthu yet as delivery arrived late yesterday.',
    communicationHistory: []
  }
];
