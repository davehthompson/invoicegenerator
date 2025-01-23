// src/domains/purchaseOrder/utils/generateFakeData.js
import {
  industries,
  generateCompanyName,
} from "../../invoice/utils/generateIndustryData";

const generatePONumber = () => {
  const prefix = "PO";
  const number = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
  const year = new Date().getFullYear();
  return `${prefix}-${number}-${year}`;
};

const generateAddress = () => {
  const streetNumbers = ["123", "456", "789", "1010", "2020"];
  const streets = [
    "Main St",
    "Business Ave",
    "Corporate Blvd",
    "Industry Way",
    "Commerce Dr",
  ];
  const cities = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"];
  const states = ["NY", "CA", "IL", "TX", "AZ"];
  const zips = ["10001", "90001", "60601", "77001", "85001"];

  const randomIndex = Math.floor(Math.random() * 5);
  return `${streetNumbers[randomIndex]} ${streets[randomIndex]}\n${cities[randomIndex]}, ${states[randomIndex]} ${zips[randomIndex]}`;
};

const generateEmailFromCompany = (companyName) => {
  const domain = companyName.toLowerCase().replace(/[^a-z0-9]/g, "") + ".com";
  return `purchasing@${domain}`;
};

const generateDemoLineItems = (industry) => {
  if (!industry?.items) return [];

  const numItems = Math.floor(Math.random() * 3) + 2; // 2-4 items
  const items = [];
  const usedItems = new Set();

  while (items.length < numItems && items.length < industry.items.length) {
    const itemIndex = Math.floor(Math.random() * industry.items.length);
    const item = industry.items[itemIndex];

    if (!usedItems.has(item.name)) {
      usedItems.add(item.name);
      const quantity = Math.floor(Math.random() * 5) + 1;
      const unitPrice =
        Math.floor(Math.random() * (item.maxPrice - item.minPrice)) +
        item.minPrice;

      items.push({
        id: Date.now() + items.length,
        description: `${item.name} (${item.unit})`,
        quantity,
        unitPrice,
        totalPrice: quantity * unitPrice,
      });
    }
  }

  return items;
};

export const generateDemoPOData = (industryKey = null) => {
  // If no industry specified, randomly select one
  if (!industryKey || !industries[industryKey]) {
    const industryKeys = Object.keys(industries);
    industryKey = industryKeys[Math.floor(Math.random() * industryKeys.length)];
  }

  const industry = industries[industryKey];
  const vendorName = generateCompanyName(industry);
  const lineItems = generateDemoLineItems(industry);

  return {
    poData: {
      poNumber: generatePONumber(),
      date: new Date().toISOString().split("T")[0],
      vendor: {
        name: vendorName,
        address: generateAddress(),
        email: generateEmailFromCompany(vendorName),
      },
      matchType: Math.random() > 0.5 ? "2-way" : "3-way",
      status: "draft",
    },
    lineItems,
  };
};

// Export available industries for UI selection
export const getAvailableIndustries = () => {
  return Object.entries(industries).map(([key, value]) => ({
    key,
    name: value.name || "Unknown Industry",
  }));
};
