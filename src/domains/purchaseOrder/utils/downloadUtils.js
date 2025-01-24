// src/domains/purchaseOrder/utils/downloadUtils.js
import html2pdf from "html2pdf.js";
import JSZip from "jszip";
import { formatCurrency } from "../../shared/utils/format";

export const generatePOPDF = async (poData, lineItems) => {
  const element = document.querySelector(".po-preview-content");
  if (!element) {
    throw new Error("Preview element not found");
  }

  const opt = {
    margin: [0.5, 0.5],
    filename: `PO-${poData.poNumber}.pdf`,
    html2canvas: {
      scale: 2,
      useCORS: true,
      logging: false,
    },
    jsPDF: {
      unit: "in",
      format: "letter",
      orientation: "portrait",
    },
  };

  try {
    const pdfBlob = await html2pdf().set(opt).from(element).output("blob");
    return pdfBlob;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};

// Generate matching invoice data from PO line items
export const generateInvoiceFromPO = (poData, lineItems, invoiceNumber) => {
  return {
    invoiceNumber,
    date: new Date().toISOString().split("T")[0],
    dueDate: new Date(new Date().setDate(new Date().getDate() + 30))
      .toISOString()
      .split("T")[0],
    currency: { symbol: "$", code: "USD", name: "US Dollar" },
    companyDetails: {
      name: poData.vendor.name,
      address: poData.vendor.address,
      email: poData.vendor.email,
      phone: "", // Could be added to vendor details in future
    },
    clientDetails: {
      name: "Your Company Name", // Should be configured in settings
      address: "Your Company Address",
      email: "your.email@company.com",
    },
    lineItems: lineItems.map((item) => ({
      id: item.id,
      description: item.description,
      quantity: item.quantity,
      rate: item.unitPrice,
      amount: item.quantity * item.unitPrice,
    })),
    remittanceInfo: {
      bankName: "",
      accountName: "",
      routingNumber: "",
      accountNumber: "",
      swiftCode: "",
      paymentTerms: "Net 30",
      additionalInstructions: "",
    },
  };
};

// Generate multiple invoices for partial deliveries
export const generatePartialInvoices = (poData, lineItems) => {
  // Split line items into multiple deliveries/invoices
  const numDeliveries = Math.min(
    3,
    Math.max(1, Math.ceil(lineItems.length / 2))
  );
  const invoices = [];

  for (let i = 0; i < numDeliveries; i++) {
    const startIdx = Math.floor((lineItems.length * i) / numDeliveries);
    const endIdx = Math.floor((lineItems.length * (i + 1)) / numDeliveries);
    const partialItems = lineItems.slice(startIdx, endIdx).map((item) => ({
      ...item,
      quantity: Math.ceil(item.quantity / numDeliveries), // Split quantities
    }));

    const invoiceNumber = `INV-${poData.poNumber}-${String(i + 1).padStart(
      2,
      "0"
    )}`;
    invoices.push(generateInvoiceFromPO(poData, partialItems, invoiceNumber));
  }

  return invoices;
};

// Bundle PO with all related documents
export const generatePOBundle = async (poData, lineItems) => {
  const zip = new JSZip();

  try {
    // Add PO to zip
    const poPDF = await generatePOPDF(poData, lineItems);
    zip.file(`PO-${poData.poNumber}.pdf`, poPDF);

    // Generate and add invoices if PO is not in draft status
    if (poData.status !== "draft") {
      const invoices = generatePartialInvoices(poData, lineItems);
      for (const invoice of invoices) {
        // Here we would generate PDF for each invoice
        // For now, we'll add a placeholder JSON file
        zip.file(
          `Invoice-${invoice.invoiceNumber}.json`,
          JSON.stringify(invoice, null, 2)
        );
      }
    }

    // Generate the zip file
    const zipBlob = await zip.generateAsync({ type: "blob" });
    return zipBlob;
  } catch (error) {
    console.error("Error generating PO bundle:", error);
    throw error;
  }
};
