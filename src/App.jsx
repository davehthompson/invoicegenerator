import React from 'react';
import { Toaster } from 'react-hot-toast'
import { useState, useEffect, useRef } from 'react';
import Layout from './domains/shared/components/Layout';
import InvoiceForm from './domains/invoice/components/InvoiceForm';
import InvoicePreview from './domains/invoice/components/InvoicePreview';
import { useInvoiceForm } from './domains/invoice/hooks/useInvoiceForm';
import DownloadButtons from './domains/invoice/components/DownloadButtons'
import DemoDataButton from './domains/invoice/components/DemoDataButton'
import PaperEffects, { EffectControls } from './domains/invoice/components/PaperEffects';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isResizing, setIsResizing] = useState(false);
  const [leftWidth, setLeftWidth] = useState(50);
  const [activeEffects, setActiveEffects] = useState([]);
  const resizerRef = useRef(null);
  
  useEffect(() => {
    console.log('Active effects in App:', activeEffects);
  }, [activeEffects]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const startResizing = (e) => {
    setIsResizing(true);
  };

  const stopResizing = () => {
    setIsResizing(false);
  };

  const resize = (e) => {
    if (isResizing) {
      const containerWidth = document.body.clientWidth;
      const newWidth = (e.clientX / containerWidth) * 100;
      if (newWidth > 30 && newWidth < 70) {
        setLeftWidth(newWidth);
      }
    }
  };

  React.useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResizing);
    }

    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [isResizing]);

  const { 
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
    setTaxSettings
  } = useInvoiceForm();

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        <div className="text-center">
          <div className="animate-pulse mb-4">
            <svg
              className="w-24 h-24 text-blue-500"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-700 animate-pulse">
            Loading Invoice Generator...
          </h2>
        </div>
      </div>
    );
  }

  const TopBarActions = () => (
    <>
      <DemoDataButton 
        setInvoiceData={setInvoiceData}
        setLineItems={setLineItems}
        setTaxSettings={setTaxSettings}
        setLogo={setLogo}
      />
      <DownloadButtons 
        invoiceData={invoiceData} 
        lineItems={lineItems} 
        setInvoiceData={setInvoiceData}
      />
    </>
  );

  const InvoiceContent = () => (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full h-full">
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
            maxWidth: '500px',
            textAlign: 'center',
          },
          success: { /* ... */ },
          error: { /* ... */ },
          loading: { /* ... */ },
        }}
      />

      {/* Context-specific controls header */}
      <header className="bg-white border-b border-gray-200 sticky top-16 z-20">
        <div className="px-8 py-4 w-full">
          <div className="flex justify-end">
            <EffectControls 
              activeEffects={activeEffects} 
              onChange={(newEffects) => {
                setActiveEffects(newEffects);
              }} 
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex relative w-full h-[calc(100vh-5rem)]">
        {/* Left Column - Form */}
        <div 
          className="overflow-auto custom-scrollbar" 
          style={{ width: `${leftWidth}%` }}
        >
          <div className="p-8">
            <div className="bg-white rounded-lg shadow-sm p-6 w-full">
              <InvoiceForm
                invoiceData={invoiceData}
                setInvoiceData={setInvoiceData}
                lineItems={lineItems}
                addLineItem={addLineItem}
                removeLineItem={removeLineItem}
                updateLineItem={updateLineItem}
                logo={logo}
                setLogo={setLogo}
                taxSettings={taxSettings}
                setTaxSettings={setTaxSettings}
              />
            </div>
          </div>
        </div>

        {/* Resizer */}
        <div
          ref={resizerRef}
          className="w-1 bg-gray-200 hover:bg-gray-300 relative group"
          onMouseDown={startResizing}
        >
          <button
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 
                     h-16 w-4 bg-gray-200 hover:bg-gray-300 rounded-full 
                     flex items-center justify-center cursor-col-resize
                     shadow-md transition-all duration-200 
                     group-hover:w-5 group-hover:h-20"
            onMouseDown={startResizing}
          >
            <div className="flex flex-col gap-1">
              <div className="w-0.5 h-0.5 bg-gray-500 rounded-full"></div>
              <div className="w-0.5 h-0.5 bg-gray-500 rounded-full"></div>
              <div className="w-0.5 h-0.5 bg-gray-500 rounded-full"></div>
            </div>
          </button>
        </div>

        {/* Right Column - Preview */}
        <div 
          className="overflow-auto custom-scrollbar"
          style={{ width: `${100 - leftWidth}%` }}
        >
          <div className="p-8">
            <div className="bg-white rounded-lg shadow-sm h-full w-full">
              <InvoicePreview
                invoiceData={invoiceData}
                lineItems={lineItems}
                logo={logo}
                taxSettings={taxSettings}
                activeEffects={activeEffects}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Layout
      topBarActions={<TopBarActions />}
    >
      <InvoiceContent />
    </Layout>
  );
}

export default App;