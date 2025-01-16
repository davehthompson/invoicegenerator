// src/hooks/useInvoiceForm.js
import { useState, useEffect } from "react";
import { getStoredInvoice, storeInvoice } from "../shared/utils/storage";

export const useInvoiceForm = () => {
  // Get current date and default due date (30 days from now)
  const today = new Date().toISOString().split("T")[0];
  const defaultDueDate = new Date(new Date().setDate(new Date().getDate() + 30))
    .toISOString()
    .split("T")[0];

  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: "",
    date: today,
    dueDate: defaultDueDate,
    companyDetails: {
      name: "",
      address: "",
      email: "",
      phone: "",
    },
    clientDetails: {
      name: "",
      address: "",
      email: "",
    },
    remittanceInfo: {
      bankName: "",
      accountName: "",
      routingNumber: "",
      accountNumber: "",
      swiftCode: "",
      paymentTerms: "",
      additionalInstructions: "",
    },
  });

  const [logo, setLogo] = useState(null);

  const [taxSettings, setTaxSettings] = useState({
    type: "percentage",
    value: "",
  });

  const [lineItems, setLineItems] = useState([
    {
      id: 1,
      description: "",
      quantity: 1,
      rate: 0,
      amount: 0,
    },
  ]);

  // Load stored invoice data
  useEffect(() => {
    const storedData = getStoredInvoice();
    if (storedData) {
      setInvoiceData(storedData.invoiceData);
      setLineItems(storedData.lineItems);
      setLogo(storedData.logo);
      if (storedData.taxSettings) {
        setTaxSettings(storedData.taxSettings);
      }
    }
  }, []);

  // Function to load company logo when company name changes
  useEffect(() => {
    const loadCompanyLogo = async () => {
      if (!invoiceData.companyDetails.name) return;

      try {
        // Import logo mapping using Vite's dynamic import
        const logoMappingModule = await import(
          "../assets/company-logos/logo-mapping.json"
        );
        const logoMapping = logoMappingModule.default;

        // Check if we have a logo for this company
        if (logoMapping[invoiceData.companyDetails.name]) {
          const filename = logoMapping[invoiceData.companyDetails.name];

          try {
            // Use Vite's URL handling for the logo file
            const logoUrl = new URL(
              `../assets/company-logos/${filename}`,
              import.meta.url
            ).href;
            const logoResponse = await fetch(logoUrl);

            if (logoResponse.ok) {
              const blob = await logoResponse.blob();
              const reader = new FileReader();

              reader.onload = () => {
                setLogo(reader.result);
              };

              reader.readAsDataURL(blob);
            }
          } catch (error) {
            console.error("Error loading logo file:", error);
          }
        }
      } catch (error) {
        console.error("Error loading logo mapping:", error);
      }
    };

    loadCompanyLogo();
  }, [invoiceData.companyDetails.name]);

  // Store invoice data when it changes
  useEffect(() => {
    storeInvoice({
      invoiceData,
      lineItems,
      logo,
      taxSettings: {
        ...taxSettings,
        value: taxSettings.value === "" ? 0 : taxSettings.value,
      },
    });
  }, [invoiceData, lineItems, logo, taxSettings]);

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      {
        id: Date.now(),
        description: "",
        quantity: 1,
        rate: 0,
        amount: 0,
      },
    ]);
  };

  const removeLineItem = (id) => {
    setLineItems(lineItems.filter((item) => item.id !== id));
  };

  const updateLineItem = (id, field, value) => {
    setLineItems(
      lineItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (field === "quantity" || field === "rate") {
            updatedItem.amount = updatedItem.quantity * updatedItem.rate;
          }
          return updatedItem;
        }
        return item;
      })
    );
  };

  return {
    invoiceData,
    setInvoiceData,
    lineItems,
    setLineItems,
    addLineItem,
    removeLineItem,
    updateLineItem,
    logo,
    setLogo,
    taxSettings,
    setTaxSettings,
  };
};

export default useInvoiceForm;
