// src/utils/logoUtils.js

// Get normalized filename for a company
export const getLogoFilename = (companyName) => {
  return companyName
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, ".")
    .replace(/\.+$/g, "");
};

// Get full path to company logo if it exists
export const getCompanyLogoPath = async (companyName) => {
  try {
    const mappingPath = "/src/assets/company-logos/logo-mapping.json";
    const response = await fetch(mappingPath);
    const logoMapping = await response.json();

    if (logoMapping[companyName]) {
      return `/src/assets/company-logos/${logoMapping[companyName]}`;
    }
    return null;
  } catch (error) {
    console.log("Error loading logo mapping:", error);
    return null;
  }
};
