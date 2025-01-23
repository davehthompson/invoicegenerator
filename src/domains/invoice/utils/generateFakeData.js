// src/utils/generateFakeData.js
import {
  industries,
  generateIndustryLineItems,
  generateCompanyName,
  generateRemittanceInfo,
} from "./generateIndustryData.js";

// Logo mapping for company names to their corresponding files
const LOGO_MAPPING = {
  // Construction & Engineering Companies
  "Bechtel Corporation": "bechtel.com.png",
  AECOM: "aecom.com.png",
  "Fluor Corporation": "fluor.com.png",
  "Kiewit Corporation": "kiewit.com.png",
  "Turner Construction": "turner.com.png",
  "Skanska USA": "skanska.com.png",
  "Jacobs Engineering Group": "jacobs.com.png",
  "Walsh Group": "walshgroup.com.png",
  "DPR Construction": "dpr.com.png",
  "Gilbane Building Company": "gilbaneco.com.png",

  // Cloud & Technology Companies
  "Amazon Web Services": "amazon.com.png",
  "Microsoft Azure": "microsoft.com.png",
  "Google Cloud Platform": "google.com.png",
  Salesforce: "salesforce.com.png",
  "Oracle Cloud": "oracle.com.png",
  "IBM Cloud": "ibm.com.png",
  VMware: "vmware.com.png",
  Snowflake: "snowflake.com.png",
  ServiceNow: "servicenow.com.png",
  Workday: "workday.com.png",

  // Insurance Services Companies
  "UnitedHealth Group": "unitedhealthgroup.com.png",
  "Anthem Blue Cross": "anthem.com.png",
  "State Farm": "statefarm.com.png",
  MetLife: "metlife.com.png",
  "Prudential Financial": "prudential.com.png",
  AIG: "aig.com.png",
  Cigna: "cigna.com.png",
  "The Hartford": "thehartford.com.png",
  Progressive: "progressive.com.png",
  Allstate: "allstate.com.png",

  // Common variations/shortcuts
  Bechtel: "bechtel.com.png",
  Fluor: "fluor.com.png",
  Skanska: "skanska.com.png",
  AWS: "amazon.com.png",
  Microsoft: "microsoft.com.png",
  Google: "google.com.png",
  Oracle: "oracle.com.png",
  IBM: "ibm.com.png",
  Anthem: "anthem.com.png",
  CIGNA: "cigna.com.png",
};

// State sales tax rates (as of 2024)
const stateTaxRates = [
  { state: "CA", rate: 7.25 },
  { state: "NY", rate: 4.0 },
  { state: "TX", rate: 6.25 },
  { state: "FL", rate: 6.0 },
  { state: "WA", rate: 6.5 },
  { state: "NV", rate: 6.85 },
  { state: "TN", rate: 7.0 },
  { state: "IN", rate: 7.0 },
  { state: "MS", rate: 7.0 },
  { state: "RI", rate: 7.0 },
  { state: "NJ", rate: 6.625 },
  { state: "MN", rate: 6.875 },
  { state: "IL", rate: 6.25 },
  { state: "MA", rate: 6.25 },
  { state: "PA", rate: 6.0 },
];

const streets = [
  "Tech Park Ave",
  "Innovation Drive",
  "Commerce Street",
  "Enterprise Road",
  "Business Boulevard",
];

const cities = {
  CA: "San Francisco",
  NY: "New York City",
  TX: "Austin",
  FL: "Miami",
  WA: "Seattle",
  NV: "Las Vegas",
  TN: "Nashville",
  IN: "Indianapolis",
  MS: "Jackson",
  RI: "Providence",
  NJ: "Newark",
  MN: "Minneapolis",
  IL: "Chicago",
  MA: "Boston",
  PA: "Philadelphia",
};

// Helper to get random element from array
const getRandom = (arr) => {
  if (!Array.isArray(arr) || arr.length === 0) {
    console.error("Invalid array provided to getRandom");
    return null;
  }
  return arr[Math.floor(Math.random() * arr.length)];
};

// Helper to get random number between min and max
const getRandomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// Format dates as YYYY-MM-DD
const formatDate = (date) => date.toISOString().split("T")[0];

// Generate address based on state
const generateAddress = (state) => {
  if (!state || !state.state || !cities[state.state]) {
    // Fallback to a default state if invalid
    state = stateTaxRates[0];
  }
  return `${getRandomNumber(100, 9999)} ${getRandom(streets)}\n${
    cities[state.state]
  }, ${state.state} ${getRandomNumber(10000, 99999)}`;
};

// Simple function to find logo using the mapping
const findLogoMatch = async (companyName) => {
  try {
    console.log("Looking for logo for company:", companyName);
    const logoFileName = LOGO_MAPPING[companyName];
    if (logoFileName) {
      console.log(`Found logo match: ${logoFileName}`);

      // Use Vite's asset handling
      const logoUrl = new URL(
        `../assets/company-logos/${logoFileName}`,
        import.meta.url
      ).href;

      console.log("Generated logo URL:", logoUrl);
      return logoUrl;
    }
    console.log("No logo mapping found for:", companyName);
    return null;
  } catch (error) {
    console.error("Error finding logo match:", error);
    return null;
  }
};

// Main function to generate fake invoice data for a specific industry
export const generateFakeInvoice = async (industryKey = null) => {
  try {
    // If no industry specified or invalid industry key provided, randomly select one
    if (!industryKey || !industries[industryKey]) {
      industryKey = getRandom(Object.keys(industries));
    }

    const industry = industries[industryKey];

    // Validate that we have a valid industry object
    if (!industry || !industry.companyNames) {
      throw new Error(`Invalid industry data: ${industryKey}`);
    }

    // Generate today's date and a future due date
    const today = new Date();
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + 30);

    // Select a random state and its tax rate
    const selectedState = getRandom(stateTaxRates);

    // Generate company names for this industry
    const companyName = generateCompanyName(industry);
    let clientName = generateCompanyName(industry);
    while (clientName === companyName) {
      clientName = generateCompanyName(industry);
    }

    // Select a different state for the client
    const clientState = getRandom(
      stateTaxRates.filter((s) => s.state !== selectedState.state)
    );

    const invoiceData = {
      invoiceNumber: `INV-${String(getRandomNumber(1000, 9999)).padStart(
        4,
        "0"
      )}`,
      date: formatDate(today),
      dueDate: formatDate(dueDate),
      currency: CURRENCIES.USD,
      companyDetails: {
        name: companyName,
        address: generateAddress(selectedState),
        email: `billing@${companyName
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]/g, "")}.com`,
        phone: `+1 (${getRandomNumber(200, 999)}) ${getRandomNumber(
          100,
          999
        )}-${getRandomNumber(1000, 9999)}`,
      },
      clientDetails: {
        name: clientName,
        address: generateAddress(clientState),
        email: `accounts@${clientName
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]/g, "")}.com`,
      },
      remittanceInfo: generateRemittanceInfo(industryKey),
    };

    const generatedLineItems = generateIndustryLineItems(industry);

    const taxSettings = {
      type: "percentage",
      value: selectedState.rate,
    };

    // Load company logo
    const logo = await findLogoMatch(companyName);

    console.log(
      `Generated ${industry.name} invoice using ${selectedState.state} tax rate: ${selectedState.rate}%`
    );

    return {
      invoiceData,
      lineItems: generatedLineItems,
      taxSettings,
      logo,
    };
  } catch (error) {
    console.error("Error generating fake invoice:", error);
    // Return default data structure
    const defaultCompanyName = "Default Company";
    return {
      invoiceData: {
        invoiceNumber: "INV-0000",
        date: formatDate(new Date()),
        dueDate: formatDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
        currency: CURRENCIES.USD,
        companyDetails: {
          name: defaultCompanyName,
          address: "123 Default St\nDefault City, CA 12345",
          email: "billing@defaultcompany.com",
          phone: "+1 (555) 555-5555",
        },
        clientDetails: {
          name: "Default Client",
          address: "456 Default Ave\nDefault City, NY 67890",
          email: "accounts@defaultclient.com",
        },
        remittanceInfo: {
          bankName: "Default Bank",
          accountName: "Default Account",
          routingNumber: "123456789",
          accountNumber: "987654321",
          swiftCode: "DEFAUS33",
          paymentTerms: "Net 30",
          additionalInstructions: "",
        },
      },
      lineItems: [
        {
          id: Date.now(),
          description: "Default Item",
          quantity: 1,
          rate: 100,
          amount: 100,
        },
      ],
      taxSettings: {
        type: "percentage",
        value: 7.25,
      },
      logo: null,
    };
  }
};

// Export available industries for UI selection
export const getAvailableIndustries = () => {
  try {
    return Object.entries(industries).map(([key, value]) => ({
      key,
      name: value.name || "Unknown Industry",
    }));
  } catch (error) {
    console.error("Error getting available industries:", error);
    return [];
  }
};

export const CURRENCIES = {
  USD: {
    symbol: "$",
    code: "USD",
    name: "US Dollar",
  },
  CAD: {
    symbol: "CA$",
    code: "CAD",
    name: "Canadian Dollar",
  },
  EUR: {
    symbol: "€",
    code: "EUR",
    name: "Euro",
  },
  GBP: {
    symbol: "£",
    code: "GBP",
    name: "British Pound",
  },
};
