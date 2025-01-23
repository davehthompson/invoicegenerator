import html2canvas from "html2canvas";

export const generatePNG = async (invoiceData, lineItems) => {
  // Wait for next render cycle to ensure content is updated
  await new Promise((resolve) => setTimeout(resolve, 100));

  const element = document.querySelector(".invoice-preview-content");

  if (!element) {
    console.error("Preview element not found");
    return;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      logging: false,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const link = document.createElement("a");
    link.download = `invoice-${invoiceData.invoiceNumber || "download"}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  } catch (error) {
    console.error("Error generating PNG:", error);
  }
};
