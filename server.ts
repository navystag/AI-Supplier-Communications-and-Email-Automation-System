import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory invoice store (or starting from mock)
let invoicesDb = [
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

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/invoices", (req, res) => {
  res.json(invoicesDb);
});

app.post("/api/invoices", (req, res) => {
  const newInvoice = req.body;
  if (!newInvoice.invoiceNumber || !newInvoice.supplierName) {
    return res.status(400).json({ error: "Missing required invoice fields" });
  }
  invoicesDb.unshift(newInvoice);
  res.json({ success: true, invoice: newInvoice });
});

// AI Resolution & Email Draft API
app.post("/api/resolve-enquiry", async (req, res) => {
  try {
    const { invoiceNumber, questionType, customQuestion, allInvoices } = req.body;
    const currentInvoices = allInvoices || invoicesDb;
    const invoice = currentInvoices.find(i => i.invoiceNumber === invoiceNumber);

    if (!invoice) {
      return res.status(404).json({
        error: "Unable to determine because the required information has not been provided."
      });
    }

    // Check if Gemini API key is available
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `
You are the AI Supplier Communication & Resolution Assistant for Boon Huat Hardware & Supplies Pte Ltd.
Your task is to assist Madam Lim (Accounts Executive) by answering a supplier enquiry and drafting a professional email.

Invoice details:
- Supplier: ${invoice.supplierName}
- Invoice Number: ${invoice.invoiceNumber}
- Invoice Status: ${invoice.invoiceStatus}
- Payment Status: ${invoice.paymentStatus}
- Three-Way Match Result: ${invoice.threeWayMatchResult}
- Payment Due Date: ${invoice.paymentDueDate || 'N/A'}
- Payment Date: ${invoice.paymentDate || 'N/A'}
- Additional Notes: ${invoice.additionalNotes || 'N/A'}
- Enquiry type / question: ${questionType} - ${customQuestion || 'General enquiry'}

Provide a JSON response with the following keys:
{
  "reason": "Clear plain English explanation of the invoice/payment status or discrepancy for Mr. Boon and the supplier",
  "recommendedNextAction": "Recommended next action for Madam Lim",
  "emailSubject": "Subject line for email",
  "emailGreeting": "Dear [Supplier Name],",
  "emailBody": "Professional email body explaining status and asking for cooperation",
  "emailClosing": "Thank you for your cooperation.\\n\\nKind regards,\\nMadam Lim\\nAccounts Executive\\nBoon Huat Hardware & Supplies Pte Ltd"
}
Return ONLY valid JSON.
`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        const text = response.text || '';
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return res.json({
            supplier: invoice.supplierName,
            invoiceNumber: invoice.invoiceNumber,
            currentInvoiceStatus: invoice.invoiceStatus,
            currentPaymentStatus: invoice.paymentStatus,
            reason: parsed.reason,
            recommendedNextAction: parsed.recommendedNextAction,
            paymentDueDate: invoice.paymentDueDate,
            paymentDate: invoice.paymentDate,
            threeWayMatchResult: invoice.threeWayMatchResult,
            emailDraft: {
              subject: parsed.emailSubject,
              greeting: parsed.emailGreeting,
              body: parsed.emailBody,
              closing: parsed.emailClosing
            }
          });
        }
      } catch (err) {
        console.error("Gemini AI generation error, falling back to rule-based:", err);
      }
    }

    // Rule-based fallback adhering strictly to guidelines
    let reason = "";
    let nextAction = "";
    let emailSubject = `Invoice ${invoice.invoiceNumber} Status Update`;
    let emailBody = "";

    if (invoice.invoiceStatus === 'Approved' && invoice.paymentStatus === 'Scheduled') {
      reason = `Your invoice has been approved and payment has been scheduled. Payment will be processed on the scheduled due date (${invoice.paymentDueDate}) after Madam Lim's final payment approval.`;
      nextAction = "No action required from Madam Lim. Payment will disburse automatically on the due date.";
      emailSubject = `Invoice ${invoice.invoiceNumber} – Payment Scheduled`;
      emailBody = `We are pleased to inform you that Invoice ${invoice.invoiceNumber} has been approved.\n\nPayment has been scheduled and will be processed on the scheduled due date (${invoice.paymentDueDate}) after final payment approval.\n\nThank you for your continued partnership.`;
    } else if (invoice.invoiceStatus === 'Approved' && invoice.paymentStatus === 'Paid') {
      reason = `Payment has been successfully processed on ${invoice.paymentDate}.`;
      nextAction = "Archive record. No further action needed.";
      emailSubject = `Invoice ${invoice.invoiceNumber} – Payment Successfully Processed`;
      emailBody = `Payment for Invoice ${invoice.invoiceNumber} has been successfully processed on ${invoice.paymentDate}.\n\nThank you for your continued partnership.`;
    } else if (invoice.threeWayMatchResult.startsWith('Failed') || invoice.threeWayMatchResult.includes('Missing') || invoice.invoiceStatus === 'Pending Review') {
      reason = `The invoice is under review because of a verification discrepancy: ${invoice.additionalNotes || invoice.threeWayMatchResult}.`;
      nextAction = "Madam Lim to review discrepancy and verify supporting documents with warehouse team before approval.";
      emailSubject = `Invoice ${invoice.invoiceNumber} – Verification Required`;
      emailBody = `We are currently reviewing Invoice ${invoice.invoiceNumber}.\n\nDuring our verification process we identified: ${invoice.additionalNotes || invoice.threeWayMatchResult}.\n\nCould you kindly verify the invoice details or provide supporting documents?\n\nOnce confirmed, we will continue with the payment review.`;
    } else if (invoice.invoiceStatus.includes('Rejected') || invoice.duplicateAlert?.isDuplicate) {
      reason = `Invoice flagged as a duplicate of ${invoice.duplicateAlert?.matchedInvoiceNumber || 'previous invoice'}. ${invoice.duplicateAlert?.similarityReason || ''}`;
      nextAction = "Notify supplier regarding duplicate submission and hold payment.";
      emailSubject = `Invoice ${invoice.invoiceNumber} – Duplicate Invoice Notice`;
      emailBody = `We are writing regarding Invoice ${invoice.invoiceNumber}.\n\nOur system has identified this as a duplicate submission matching ${invoice.duplicateAlert?.matchedInvoiceNumber || 'a previously processed invoice'}.\n\nKindly verify your records as this invoice will not be processed twice.`;
    } else {
      reason = `Invoice status is currently ${invoice.invoiceStatus} and payment status is ${invoice.paymentStatus}.`;
      nextAction = "Review invoice history and follow up with relevant department.";
      emailBody = `We are reviewing your enquiry regarding Invoice ${invoice.invoiceNumber}.\n\nStatus is currently ${invoice.invoiceStatus}. We will provide updates shortly.`;
    }

    res.json({
      supplier: invoice.supplierName,
      invoiceNumber: invoice.invoiceNumber,
      currentInvoiceStatus: invoice.invoiceStatus,
      currentPaymentStatus: invoice.paymentStatus,
      reason,
      recommendedNextAction: nextAction,
      paymentDueDate: invoice.paymentDueDate,
      paymentDate: invoice.paymentDate,
      threeWayMatchResult: invoice.threeWayMatchResult,
      emailDraft: {
        subject: emailSubject,
        greeting: `Dear ${invoice.supplierName},`,
        body: emailBody,
        closing: "Thank you for your cooperation.\n\nKind regards,\nMadam Lim\nAccounts Executive\nBoon Huat Hardware & Supplies Pte Ltd"
      }
    });

  } catch (error: any) {
    console.error("Error in resolve-enquiry:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// Edith AI Assistant Multi-Turn Chat API
app.post("/api/edith-chat", async (req, res) => {
  try {
    const { messages, modelName = 'gemini-3.5-flash', invoiceContext, allInvoices } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    const edithSystemInstruction = `
You are Edith, the AI Finance Assistant for Boon Huat Hardware & Supplies Pte Ltd.

Your role is to assist users with Accounts Payable processes by providing accurate, professional, and easy-to-understand guidance. You should always communicate in a friendly, helpful, and concise manner suitable for finance staff with varying levels of technical knowledge.

Your responsibilities include:
- Answering questions about invoices, purchase orders, goods received notes, supplier payments, and procurement.
- Explaining application features and guiding users through workflows.
- Interpreting data displayed within the application.
- Helping users understand errors, warnings, and system notifications.
- Recommending best practices for Accounts Payable and three-way matching.
- Assisting with supplier communication by helping draft professional emails and enquiries.
- Explaining payment schedules, due dates, approval status, and matching results in simple English.
- Providing troubleshooting advice when uploads, document extraction, or integrations fail.

When responding:
- Be clear, concise, and professional.
- Avoid technical jargon unless specifically requested.
- Break complex explanations into simple steps.
- Use bullet points where appropriate.
- If you are uncertain, clearly state that the information should be reviewed by the user instead of guessing.
- Never fabricate invoice details, supplier information, financial figures, or document contents.
- Base all answers on the information available within the application or provided by the user.
- If data is missing or incomplete, explain what is missing and suggest the next action.
- If an action requires managerial approval, remind the user that the final decision rests with the authorised finance personnel (such as Madam Lim or Mr. Boon).

Greeting guideline:
When greeting the user or introduce yourself, say naturally:
"Hello! I'm Edith, your AI Finance Assistant. I'm here to help you with invoices, payments, three-way matching, supplier enquiries, and any questions about the application."

Never claim to perform actions that you cannot actually perform (e.g. transferring money directly or issuing bank payments). If a requested action requires user confirmation or another system, explain the limitation and provide the appropriate next steps.

Current Accounts Payable Records in System:
${JSON.stringify(allInvoices || invoicesDb, null, 2)}
${invoiceContext ? `\nUser Selected Invoice Context:\n${JSON.stringify(invoiceContext, null, 2)}` : ''}
`;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            }
          }
        });

        // Convert messages to history format expected by @google/genai
        const history = messages.slice(0, -1).map((m: any) => ({
          role: m.sender === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }]
        }));

        const lastUserMessage = messages[messages.length - 1].text;

        const chat = ai.chats.create({
          model: modelName,
          config: {
            systemInstruction: edithSystemInstruction,
            temperature: 0.7,
          },
          history: history,
        });

        const response = await chat.sendMessage({ message: lastUserMessage });
        const replyText = response.text || "I'm sorry, I couldn't generate a response. Please check the invoice details or try rephrasing your question.";

        return res.json({
          reply: replyText,
          modelUsed: modelName
        });
      } catch (geminiErr: any) {
        console.error("Gemini API error in /api/edith-chat:", geminiErr);
      }
    }

    // Smart fallback if API key is missing or model call fails
    const lastMsg = messages[messages.length - 1].text.toLowerCase();
    let fallbackReply = "";

    if (lastMsg.includes("hello") || lastMsg.includes("hi") || lastMsg.includes("who are you") || lastMsg.includes("introduce")) {
      fallbackReply = "Hello! I'm Edith, your AI Finance Assistant. I'm here to help you with invoices, payments, three-way matching, supplier enquiries, and any questions about the application.";
    } else if (lastMsg.includes("3-way") || lastMsg.includes("three-way") || lastMsg.includes("match")) {
      fallbackReply = "Three-way matching verifies that three key procurement documents agree before payment is approved:\n\n" +
        "• **Purchase Order (PO)**: Confirms the agreed prices and quantities.\n" +
        "• **Goods Received Note (GRN)**: Confirms the actual items received at our site.\n" +
        "• **Supplier Invoice**: Details the final amounts billed by the supplier.\n\n" +
        "When all three match, the invoice moves straight to scheduled payment.";
    } else if (lastMsg.includes("inv-1058") || lastMsg.includes("tan brothers")) {
      fallbackReply = "Here is the details for **INV-1058 (Tan Brothers Metal Works)**:\n\n" +
        "• **Amount**: $14,500.00\n" +
        "• **Status**: Pending Review (Payment on Hold)\n" +
        "• **Reason**: Quantity Mismatch. The site received 95 units (GRN-5510), but invoice bills for 100 units.\n" +
        "• **Suggested Next Step**: Madam Lim to confirm with warehouse supervisor Mr. Muthu and request a credit note for 5 units ($725.00).";
    } else {
      fallbackReply = "Hello! I'm Edith, your AI Finance Assistant. I'm here to help you with invoices, payments, three-way matching, supplier enquiries, and any questions about the application.\n\n" +
        "Feel free to ask me about any invoice (e.g. INV-1058, INV-1062, INV-1070), payment schedules, or drafting supplier communications.";
    }

    return res.json({
      reply: fallbackReply,
      modelUsed: 'edith-fallback-engine'
    });

  } catch (err: any) {
    console.error("Error in /api/edith-chat:", err);
    res.status(500).json({ error: "Internal server error communicating with Edith" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
