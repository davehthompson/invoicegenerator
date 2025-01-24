// src/domains/purchaseOrder/components/DownloadButton.jsx
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { generatePOPDF, generatePOBundle } from '../utils/downloadUtils';

const DownloadButton = ({ poData, lineItems }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.download-menu-container')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  const handleDownload = async (type) => {
    if (!poData.poNumber) {
      toast.error('Please enter a PO number');
      return;
    }

    setIsGenerating(true);
    setIsOpen(false);

    try {
      if (type === 'po') {
        const pdfBlob = await generatePOPDF(poData, lineItems);
        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `PO-${poData.poNumber}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        toast.success('PO downloaded successfully');
      } 
      else if (type === 'bundle') {
        const zipBlob = await generatePOBundle(poData, lineItems);
        const url = URL.createObjectURL(zipBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `PO-${poData.poNumber}-bundle.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        toast.success('PO bundle downloaded successfully');
      }
    } catch (error) {
      console.error('Error downloading:', error);
      toast.error('Failed to generate download');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="relative download-menu-container">
      <button
        onClick={() => !isGenerating && setIsOpen(!isOpen)}
        disabled={isGenerating}
        className="px-4 py-2 bg-[#E4F222] border border-[#E4F222] text-gray-800 
                hover:bg-[#cdd71f] hover:border-[#cdd71f] 
                focus:outline-none focus:ring-2 focus:ring-[#E4F222] focus:ring-opacity-50 
                transition-colors rounded-lg flex items-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
        {isGenerating ? 'Generating...' : 'Download'}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-300 shadow-lg rounded-lg overflow-hidden z-50">
          <button
            onClick={() => handleDownload('po')}
            className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-red-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                clipRule="evenodd"
              />
            </svg>
            Download PO Only
          </button>
          <button
            onClick={() => handleDownload('bundle')}
            className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2 border-t border-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-blue-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                clipRule="evenodd"
              />
            </svg>
            Download with Invoices
          </button>
        </div>
      )}
    </div>
  );
};

export default DownloadButton;