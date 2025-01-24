import { formatDate, formatCurrency } from "../../shared/utils/format";

const generateInvoiceNumber = (poNumber, index = "") => {
  const prefix = "INV";
  const poRef = poNumber.replace("PO-", "");
  return `${prefix}-${poRef}${index ? `-${index}` : ""}`;
};

export const generateInvoiceFromPO = (
  poData,
  lineItems,
  selectedItems,
  quantities,
  includeIndex = false,
  index = ""
) => {
  console.log("generateInvoiceFromPO called with:", {
    poData,
    lineItems,
    selectedItems,
    quantities,
  });
  // Filter and map selected line items with their quantities
  const invoiceLineItems = Object.entries(selectedItems)
    .filter(([_, isSelected]) => isSelected)
    .map(([itemId]) => {
      const originalItem = lineItems.find(
        (item) => item.id.toString() === itemId
      );
      return {
        ...originalItem,
        quantity: quantities[itemId] || 0,
        amount: (quantities[itemId] || 0) * originalItem.unitPrice,
      };
    });

  // Calculate total amount
  const total = invoiceLineItems.reduce((sum, item) => sum + item.amount, 0);

  // Generate invoice data
  return {
    invoiceNumber: generateInvoiceNumber(
      poData.poNumber,
      includeIndex ? index : ""
    ),
    poNumber: poData.poNumber,
    date: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    vendor: {
      name: poData.vendor.name,
      address: poData.vendor.address,
      email: poData.vendor.email,
    },
    client: {
      name: "Your Company Name", // Should come from settings
      address: "Your Company Address",
      email: "accounts@yourcompany.com",
    },
    lineItems: invoiceLineItems,
    total,
    status: "draft",
    matchType: poData.matchType,
  };
};

export const generateMultipleInvoices = (poData, selectedItems, quantities) => {
  // Group items by delivery or other criteria
  // For now, we'll split into equal groups
  const selectedItemIds = Object.entries(selectedItems)
    .filter(([_, isSelected]) => isSelected)
    .map(([itemId]) => itemId);

  const numInvoices = Math.min(3, Math.ceil(selectedItemIds.length / 2));
  const invoices = [];

  // Split items across invoices
  for (let i = 0; i < numInvoices; i++) {
    const startIdx = Math.floor((selectedItemIds.length * i) / numInvoices);
    const endIdx = Math.floor((selectedItemIds.length * (i + 1)) / numInvoices);
    const invoiceItems = selectedItemIds.slice(startIdx, endIdx);

    // Create selected items object for this invoice
    const invoiceSelectedItems = {};
    const invoiceQuantities = {};
    invoiceItems.forEach((itemId) => {
      invoiceSelectedItems[itemId] = true;
      invoiceQuantities[itemId] = Math.ceil(quantities[itemId] / numInvoices);
    });

    invoices.push(
      generateInvoiceFromPO(
        poData,
        invoiceSelectedItems,
        invoiceQuantities,
        true,
        String(i + 1).padStart(2, "0")
      )
    );
  }

  return invoices;
};

export const validateInvoiceGeneration = (selectedItems, quantities) => {
  const errors = [];

  // Check if any items are selected
  const hasSelectedItems = Object.values(selectedItems).some(
    (isSelected) => isSelected
  );
  if (!hasSelectedItems) {
    errors.push("Please select at least one line item");
  }

  // Check if selected items have valid quantities
  Object.entries(selectedItems).forEach(([itemId, isSelected]) => {
    if (isSelected) {
      const quantity = quantities[itemId];
      if (!quantity || quantity <= 0) {
        errors.push("All selected items must have a quantity greater than 0");
      }
    }
  });

  return errors;
};
