// src/shared/utils/format.js
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};
// Add this new function
export const formatDate = (date) => {
  if (!date) return "";

  // If date is already in YYYY-MM-DD format, return as is
  if (typeof date === "string" && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return date;
  }

  // Convert to Date object if it isn't already
  const dateObj = typeof date === "string" ? new Date(date) : date;

  // Format as YYYY-MM-DD
  return dateObj.toISOString().split("T")[0];
};
