import React, { useState } from 'react';
import JSZip from 'jszip';
import toast from 'react-hot-toast';
import html2pdf from 'html2pdf.js';

const DownloadButtons = ({ invoiceData, lineItems, setInvoiceData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const validateInvoiceData = (data) => {
    if (!data.date) {
      toast.error('Please set an invoice date', { position: 'top-center' });
      return false;
    }
    if (!data.dueDate) {
      toast.error('Please set a due date', { position: 'top-center' });
      return false;
    }
    return true;
  };

  const generateMonthlyInvoiceData = (baseInvoiceData, monthOffset) => {
    try {
      const baseDate = new Date(baseInvoiceData.date);
      const newInvoiceDate = new Date(
        baseDate.getFullYear(),
        baseDate.getMonth() + monthOffset,
        baseDate.getDate()
      );
      
      const newDueDate = new Date(newInvoiceDate);
      newDueDate.setDate(newDueDate.getDate() + 30);

      const formatDate = (date) => {
        return date.toISOString().split('T')[0];
      };

      return {
        ...baseInvoiceData,
        invoiceNumber: `${baseInvoiceData.invoiceNumber}-${String(monthOffset + 1).padStart(2, '0')}`,
        date: formatDate(newInvoiceDate),
        dueDate: formatDate(newDueDate)
      };
    } catch (error) {
      console.error('Error generating monthly data:', error);
      return null;
    }
  };

  const generatePDF = async (data) => {
    const element = document.querySelector('.invoice-preview-content');
    if (!element) return null;

    const opt = {
      margin: [0.5, 0.5],
      filename: `${data.invoiceNumber}.pdf`,
      html2canvas: { 
        scale: 2,
        useCORS: true,
        allowTaint: true,
        imageTimeout: 30000,
        onclone: function(clonedDoc) {
          const previewImg = document.querySelector('.logo-image');
          const clonedImg = clonedDoc.querySelector('.logo-image');
          
          if (previewImg && clonedImg) {
            // Get all possible dimension measurements
            const previewRect = previewImg.getBoundingClientRect();
            const previewComputed = window.getComputedStyle(previewImg);
            const previewContainer = previewImg.parentElement;
            const previewContainerRect = previewContainer.getBoundingClientRect();
            
            console.log('Detailed Logo Measurements:', {
              preview: {
                naturalDimensions: {
                  width: previewImg.naturalWidth,
                  height: previewImg.naturalHeight
                },
                clientDimensions: {
                  width: previewImg.clientWidth,
                  height: previewImg.clientHeight
                },
                boundingRect: previewRect,
                computedStyle: {
                  width: previewComputed.width,
                  height: previewComputed.height,
                  maxWidth: previewComputed.maxWidth,
                  maxHeight: previewComputed.maxHeight
                },
                containerDimensions: previewContainerRect
              }
            });
          }
        }
      },
      jsPDF: { 
        unit: 'in',
        format: 'letter',
        orientation: 'portrait'
      }
    };

    try {
      const pdfBlob = await html2pdf().set(opt).from(element).output('blob');
      return pdfBlob;
    } catch (error) {
      console.error('Error generating PDF:', error);
      return null;
    }
  };

  const handleDownload = async (type) => {
    if (!validateInvoiceData(invoiceData)) return;

    setIsGenerating(true);
    setIsOpen(false);

    try {
      if (type === 'pdf') {
        const pdfBlob = await generatePDF(invoiceData);
        if (!pdfBlob) throw new Error('Failed to generate PDF');

        // Track single PDF download
        gtag('event', 'download_invoice', {
          'download_type': 'single_pdf'
        });

        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${invoiceData.invoiceNumber}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        toast.success('PDF generated successfully!', { position: 'top-center' });
      }
    } catch (error) {
      console.error(`Error generating ${type}:`, error);
      toast.error(`Failed to generate ${type}`, { position: 'top-center' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnnualInvoices = async () => {
    if (!validateInvoiceData(invoiceData)) return;

    setIsGenerating(true);
    setIsOpen(false);
    
    try {
      const loadingToast = toast.loading(
        'Generating annual invoices...',
        { 
          position: 'top-center',
          duration: Infinity
        }
      );

      gtag('event', 'download_invoice', {
        'download_type': 'annual_batch',
        'invoice_count': 12
      });
      
      const zip = new JSZip();
      let successCount = 0;
      
      const originalInvoiceData = { ...invoiceData };
      
      for (let i = 0; i < 12; i++) {
        const monthlyData = generateMonthlyInvoiceData(originalInvoiceData, i);
        if (!monthlyData) continue;

        setInvoiceData(monthlyData);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const pdfBlob = await generatePDF(monthlyData);
        if (pdfBlob) {
          zip.file(`${monthlyData.invoiceNumber}.pdf`, pdfBlob);
          successCount++;
        }
      }
      
      setInvoiceData(originalInvoiceData);
      
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipBlob);
      link.download = `invoices-${originalInvoiceData.invoiceNumber}.zip`;
      link.click();
      URL.revokeObjectURL(link.href);
      
      toast.dismiss(loadingToast);
      toast.success(
        `Successfully generated ${successCount} invoices!`,
        { position: 'top-center' }
      );
    } catch (error) {
      console.error('Error generating annual invoices:', error);
      toast.error(
        'Failed to generate invoices',
        { position: 'top-center' }
      );
    } finally {
      setIsGenerating(false);
    }
  };

  React.useEffect(() => {
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
          !isGenerating && setIsOpen(!isOpen);
        }}
        disabled={isGenerating}
        className={`flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 transition-colors ${
          isGenerating ? 'opacity-75 cursor-not-allowed' : ''
        }`}
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
        <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-300 shadow-lg z-50">
          <button
            onClick={() => handleDownload('pdf')}
            className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
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
            Download as PDF
          </button>
          <button
            onClick={handleAnnualInvoices}
            className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2 border-t border-gray-200 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-blue-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clipRule="evenodd"
              />
            </svg>
            Generate Annual Invoices
          </button>
        </div>
      )}
    </div>
  );
};

export default DownloadButtons;