// src/components/DemoDataButton.jsx
import React, { useState, useEffect } from 'react';
import { generateFakeInvoice, getAvailableIndustries, CURRENCIES } from '../utils/generateFakeData';
import toast from 'react-hot-toast';

const DemoDataButton = ({ 
  setInvoiceData, 
  setLineItems, 
  setTaxSettings, 
  setLogo 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [industries, setIndustries] = useState([]);

  useEffect(() => {
    const availableIndustries = getAvailableIndustries();
    setIndustries(availableIndustries);
  }, []);

  const validateGeneratedData = (data) => {
    console.log('Validating generated data:', data);

    if (!data) {
      console.error('No data returned');
      return false;
    }

    if (!data.invoiceData) {
      console.error('Missing invoiceData');
      return false;
    }

    if (!data.lineItems || !Array.isArray(data.lineItems)) {
      console.error('Missing or invalid lineItems');
      return false;
    }

    if (!data.taxSettings) {
      console.error('Missing taxSettings');
      return false;
    }

    return true;
  };

  const handleGenerateDemo = async (industryKey = null) => {
    try {
      const loadingToast = toast.loading('Generating demo data...', { id: 'demo-data' });

      // Track demo data generation
    gtag('event', 'generate_demo_data', {
      'event_category': 'Demo Features',
      'event_label': industryKey || 'Random Industry',
      'industry_type': industryKey || 'random'
    });
      
      console.log('Generating demo data for industry:', industryKey);
      const result = await generateFakeInvoice(industryKey);
      
      console.log('Generated data:', result);

      if (!validateGeneratedData(result)) {
        throw new Error('Generated data is incomplete');
      }

      setInvoiceData(result.invoiceData);
      setLineItems(result.lineItems);
      setTaxSettings(result.taxSettings);
      setLogo(result.logo);
      setIsOpen(false);

      toast.success('Demo data generated successfully', { id: 'demo-data' });
    } catch (error) {
      console.error('Error generating demo data:', error);
      toast.error('Failed to generate demo data', { id: 'demo-data' });
    }
  };

  useEffect(() => {
    const closeDropdown = () => setIsOpen(false);
    if (isOpen) {
      document.addEventListener('click', closeDropdown);
      return () => document.removeEventListener('click', closeDropdown);
    }
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:outline-none focus:border-blue-500 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
          <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
          <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
        </svg>
        Generate Demo Data
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-64 bg-white border border-gray-300 shadow-lg z-50">
          <div className="py-1">
            <button
              onClick={() => handleGenerateDemo()}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Random Industry
            </button>
            <div className="border-t border-gray-200"></div>
            {industries.map(({ key, name }) => (
              <button
                key={key}
                onClick={() => handleGenerateDemo(key)}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DemoDataButton;