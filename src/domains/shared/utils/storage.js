// Key for localStorage
const STORAGE_KEY = "invoice_data";

// Save invoice data to localStorage
export const storeInvoice = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error storing invoice data:", error);
  }
};

// Retrieve invoice data from localStorage
export const getStoredInvoice = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error retrieving invoice data:", error);
    return null;
  }
};
