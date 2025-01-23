// src/domains/invoice/components/InvoiceContent.jsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Toaster } from 'react-hot-toast';
import InvoiceForm from './InvoiceForm';
import InvoicePreview from './InvoicePreview';
import { useInvoiceForm } from '../hooks/useInvoiceForm';
import DemoDataButton from './DemoDataButton';
import DownloadButtons from './DownloadButtons';
import { EffectControls } from './PaperEffects';
import { useTopBar } from '../../shared/context/TopBarContext';

// Move TopBarActions outside the component
const TopBarActions = React.memo(({
  setInvoiceData,
  setLineItems,
  setTaxSettings,
  setLogo,
  invoiceData,
  lineItems
}) => (
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
));

const InvoiceContent = () => {
  const [isResizing, setIsResizing] = useState(false);
  const [leftWidth, setLeftWidth] = useState(50);
  const [activeEffects, setActiveEffects] = useState([]);
  const resizerRef = useRef(null);
  const { setActions } = useTopBar()

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

  // Memoize the props for TopBarActions
  const topBarProps = useMemo(() => ({
    setInvoiceData,
    setLineItems,
    setTaxSettings,
    setLogo,
    invoiceData,
    lineItems
  }), [setInvoiceData, setLineItems, setTaxSettings, setLogo, invoiceData, lineItems]);

  // Set up top bar actions
  useEffect(() => {
    setActions(<TopBarActions {...topBarProps} />);
    return () => setActions(null);
  }, [setActions, topBarProps]);

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

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResizing);
    }

    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [isResizing]);

  return (
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
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
          loading: {
            duration: Infinity,
            iconTheme: {
              primary: '#3b82f6',
              secondary: '#fff',
            },
          },
        }}
      />

      {/* Context-specific controls header */}
      <header className="bg-white border-b border-gray-200 sticky top-16 z-20">
        <div className="px-8 py-4 w-full">
          <div className="flex justify-end">
            <EffectControls 
              activeEffects={activeEffects} 
              onChange={setActiveEffects}
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
};

export default InvoiceContent;