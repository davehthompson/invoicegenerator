// src/utils/generateIndustryData.js

// Bank data for each industry
const bankData = {
  construction: {
    banks: [
      { name: "JPMorgan Chase Bank", swift: "CHASUS33" },
      { name: "Bank of America", swift: "BOFAUS3N" },
      { name: "Wells Fargo Bank", swift: "WFBIUS6S" },
    ],
    paymentTerms: [
      "Net 30 - Progress Payment",
      "50% Upfront, 50% Upon Completion",
      "Progress Payments - 30/30/40",
    ],
    instructions: [
      "Please reference PO number in payment details",
      "Progress payments subject to inspection approval",
      "Include project code in wire memo",
    ],
  },
  cloudServices: {
    banks: [
      { name: "Citibank", swift: "CITIUS33" },
      { name: "HSBC Bank", swift: "MRMDUS33" },
      { name: "Goldman Sachs", swift: "GOLDUS33" },
    ],
    paymentTerms: [
      "Net 30 - Enterprise",
      "Annual Subscription - Net 30",
      "Pay-as-you-go Net 15",
    ],
    instructions: [
      "Include subscription ID in payment reference",
      "Auto-billing enabled for recurring charges",
      "Reference client ID for processing",
    ],
  },
  insurance: {
    banks: [
      { name: "U.S. Bank", swift: "USBKUS44" },
      { name: "PNC Bank", swift: "PNCCUS33" },
      { name: "Capital One", swift: "NFBKUS33" },
    ],
    paymentTerms: [
      "Net 30 - Premium Payment",
      "Monthly Premium Schedule",
      "Quarterly Payment Plan",
    ],
    instructions: [
      "Include policy number in payment reference",
      "Separate payment per policy required",
      "Include broker code if applicable",
    ],
  },
};

const industries = {
  construction: {
    name: "Construction & Engineering",
    companyNames: [
      "Bechtel Corporation",
      "AECOM",
      "Fluor Corporation",
      "Kiewit Corporation",
      "Turner Construction",
      "Skanska USA",
      "Jacobs Engineering Group",
      "Walsh Group",
      "DPR Construction",
      "Gilbane Building Company",
    ],
    items: [
      {
        name: "Structural Steel Framework",
        minPrice: 25000,
        maxPrice: 75000,
        unit: "project",
      },
      {
        name: "Concrete Foundation Work",
        minPrice: 15000,
        maxPrice: 45000,
        unit: "project",
      },
      {
        name: "Building Design Services",
        minPrice: 10000,
        maxPrice: 30000,
        unit: "service",
      },
      {
        name: "Site Preparation",
        minPrice: 8000,
        maxPrice: 20000,
        unit: "project",
      },
      {
        name: "Project Management",
        minPrice: 5000,
        maxPrice: 15000,
        unit: "month",
      },
    ],
  },
  cloudServices: {
    name: "Cloud & Technology",
    companyNames: [
      "Amazon Web Services",
      "Microsoft Azure",
      "Google Cloud Platform",
      "Salesforce",
      "Oracle Cloud",
      "IBM Cloud",
      "VMware",
      "Snowflake",
      "ServiceNow",
      "Workday",
    ],
    items: [
      {
        name: "Cloud Infrastructure Services",
        minPrice: 5000,
        maxPrice: 50000,
        unit: "month",
      },
      {
        name: "Data Storage Solutions",
        minPrice: 2000,
        maxPrice: 20000,
        unit: "TB/month",
      },
      {
        name: "Enterprise Software License",
        minPrice: 10000,
        maxPrice: 100000,
        unit: "annual",
      },
      {
        name: "Technical Support Package",
        minPrice: 1500,
        maxPrice: 15000,
        unit: "month",
      },
      {
        name: "API Management Services",
        minPrice: 3000,
        maxPrice: 25000,
        unit: "month",
      },
    ],
  },
  insurance: {
    name: "Insurance Services",
    companyNames: [
      "UnitedHealth Group",
      "Anthem Blue Cross",
      "State Farm",
      "MetLife",
      "Prudential Financial",
      "AIG",
      "Cigna",
      "The Hartford",
      "Progressive",
      "Allstate",
    ],
    items: [
      {
        name: "Commercial Property Coverage",
        minPrice: 5000,
        maxPrice: 50000,
        unit: "annual",
      },
      {
        name: "General Liability Insurance",
        minPrice: 2500,
        maxPrice: 25000,
        unit: "annual",
      },
      {
        name: "Professional Liability Coverage",
        minPrice: 3000,
        maxPrice: 30000,
        unit: "annual",
      },
      {
        name: "Workers Compensation Policy",
        minPrice: 4000,
        maxPrice: 40000,
        unit: "annual",
      },
      {
        name: "Cyber Security Insurance",
        minPrice: 2000,
        maxPrice: 20000,
        unit: "annual",
      },
    ],
  },
};

// Helper to get random element from array
const getRandom = (arr) => {
  if (!Array.isArray(arr) || arr.length === 0) {
    console.error("Invalid array provided to getRandom");
    return null;
  }
  return arr[Math.floor(Math.random() * arr.length)];
};

// Generate line items specific to an industry
const generateIndustryLineItems = (industry) => {
  try {
    if (!industry || !industry.items || !Array.isArray(industry.items)) {
      throw new Error("Invalid industry data for line items");
    }

    const numItems = Math.floor(Math.random() * 3) + 2; // 2-4 items
    const selectedItems = new Set();
    const lineItems = [];

    while (
      selectedItems.size < numItems &&
      selectedItems.size < industry.items.length
    ) {
      const item = getRandom(industry.items);
      if (item && !selectedItems.has(item.name)) {
        selectedItems.add(item.name);
        const quantity = Math.floor(Math.random() * 5) + 1;
        const rate =
          Math.random() * (item.maxPrice - item.minPrice) + item.minPrice;
        lineItems.push({
          id: Date.now() + selectedItems.size,
          description: `${item.name} (${item.unit})`,
          quantity,
          rate: Number(rate.toFixed(2)),
          amount: Number((quantity * rate).toFixed(2)),
        });
      }
    }

    return lineItems;
  } catch (error) {
    console.error("Error generating line items:", error);
    throw error;
  }
};

// Generate company name for an industry
const generateCompanyName = (industry) => {
  if (!industry?.companyNames?.length) {
    throw new Error("Invalid industry data for company name generation");
  }
  return getRandom(industry.companyNames);
};

// Generate remittance info for an industry
const generateRemittanceInfo = (industryKey) => {
  try {
    if (!bankData[industryKey]) {
      throw new Error(`Invalid industry key: ${industryKey}`);
    }

    const bank = getRandom(bankData[industryKey].banks);
    const paymentTerms = getRandom(bankData[industryKey].paymentTerms);
    const instructions = getRandom(bankData[industryKey].instructions);

    // Generate routing and account numbers
    const routingNumber = Array.from({ length: 9 }, () =>
      Math.floor(Math.random() * 10)
    ).join("");
    const accountNumber = Array.from({ length: 10 }, () =>
      Math.floor(Math.random() * 10)
    ).join("");

    return {
      bankName: bank.name,
      accountName: generateCompanyName(industries[industryKey]),
      routingNumber,
      accountNumber,
      swiftCode: bank.swift,
      paymentTerms,
      additionalInstructions: instructions,
    };
  } catch (error) {
    console.error("Error generating remittance info:", error);
    throw error;
  }
};

export {
  industries,
  generateIndustryLineItems,
  generateCompanyName,
  generateRemittanceInfo,
};
