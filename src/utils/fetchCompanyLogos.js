// src/utils/fetchCompanyLogos.js
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BRANDFETCH_API_KEY = "YOUR_API_KEY_HERE"; // Replace with your API key
const LOGOS_DIR = path.join(__dirname, "..", "assets", "company-logos");

// List of companies you want to fetch logos for
const COMPANIES_TO_FETCH = [
  "Microsoft",
  "Apple",
  "Google",
  "Amazon",
  // Add more companies here
];

// Helper to convert company name to domain format
const getDomainFromName = (name) => {
  // Remove any common company suffixes
  const suffixesToRemove = [
    "Corporation",
    "Corp",
    "Inc",
    "LLC",
    "Ltd",
    "Group",
  ];

  let domain = name;

  // Remove suffixes
  suffixesToRemove.forEach((suffix) => {
    domain = domain.replace(new RegExp(suffix + "$"), "");
  });

  // Convert to lowercase, remove special chars, trim spaces
  domain = domain
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "");

  // Always append .com
  return `${domain}.com`;
};

// Function to extract the best PNG logo URL from Brandfetch data
const extractLogoUrl = (data) => {
  if (!data.logos?.length) return null;

  // First try to find a logo with light theme
  let logoEntry = data.logos.find(
    (logo) => logo.type === "logo" && logo.theme === "light"
  );

  // If no light theme found, fall back to any logo
  if (!logoEntry) {
    logoEntry = data.logos.find((logo) => logo.type === "logo");
  }

  if (!logoEntry?.formats) return null;

  // Find the PNG format with the highest resolution
  const pngFormats = logoEntry.formats.filter(
    (format) => format.format === "png"
  );

  if (!pngFormats.length) return null;

  // Sort by width to get highest resolution
  const bestPng = pngFormats.sort((a, b) => (b.width || 0) - (a.width || 0))[0];

  return {
    url: bestPng.src,
    format: "png",
  };
};

// Function to fetch logo from Brandfetch
async function fetchLogo(companyName) {
  try {
    const domain = getDomainFromName(companyName);
    console.log(`Fetching logo for ${companyName} (${domain})`);

    const response = await fetch(
      `https://api.brandfetch.io/v2/brands/${domain}`,
      {
        headers: {
          Authorization: `Bearer ${BRANDFETCH_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const logoInfo = extractLogoUrl(data);

    if (!logoInfo) {
      throw new Error("No suitable PNG logo found in response");
    }

    // Download the logo file
    const logoResponse = await fetch(logoInfo.url);
    if (!logoResponse.ok) {
      throw new Error(`Failed to download logo: ${logoResponse.status}`);
    }

    const buffer = await logoResponse.arrayBuffer();
    const fileName = domain; // Keep the .com in filename
    const filePath = path.join(LOGOS_DIR, `${fileName}.png`);

    await fs.writeFile(filePath, Buffer.from(buffer));
    console.log(`✓ Successfully downloaded PNG logo for ${companyName}`);

    return {
      company: companyName,
      fileName: `${fileName}.png`,
      format: "png",
    };
  } catch (error) {
    console.error(`× Failed to fetch logo for ${companyName}:`, error.message);
    return null;
  }
}

// Main function to fetch all logos
async function fetchAllLogos() {
  try {
    // Create logos directory if it doesn't exist
    await fs.mkdir(LOGOS_DIR, { recursive: true });

    const results = {
      successful: [],
      failed: [],
    };

    // Process each company
    for (const companyName of COMPANIES_TO_FETCH) {
      const result = await fetchLogo(companyName);
      if (result) {
        results.successful.push(result);
      } else {
        results.failed.push(companyName);
      }
      // Add delay to respect API rate limits
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // Generate a mapping file
    const logoMapping = results.successful.reduce(
      (acc, { company, fileName }) => {
        acc[company] = fileName;
        return acc;
      },
      {}
    );

    await fs.writeFile(
      path.join(LOGOS_DIR, "logo-mapping.json"),
      JSON.stringify(logoMapping, null, 2)
    );

    // Print summary
    console.log("\nDownload Summary:");
    console.log(
      `Successfully downloaded: ${results.successful.length} PNG logos`
    );
    console.log(`Failed to download: ${results.failed.length} logos`);
    if (results.failed.length > 0) {
      console.log("\nFailed companies:");
      results.failed.forEach((company) => console.log(`- ${company}`));
    }
  } catch (error) {
    console.error("Error in fetchAllLogos:", error);
  }
}

// Execute the function
fetchAllLogos();
