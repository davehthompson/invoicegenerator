// src/invoice/utils/generatePDF.js
import html2pdf from "html2pdf.js";

export const generatePDF = async (invoiceData, lineItems) => {
  const element = document.querySelector(".invoice-preview-content");

  if (!element) {
    console.error("Preview element not found");
    return;
  }

  const opt = {
    margin: [0.5, 0.5],
    filename: `invoice-${invoiceData.invoiceNumber}.pdf`,
    image: { type: "jpeg", quality: 1 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      logging: false,
    },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
  };

  try {
    await html2pdf().set(opt).from(element).save();
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};
