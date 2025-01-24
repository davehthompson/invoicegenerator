// src/domains/purchaseOrder/components/POGeneration.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import POForm from './POForm';
import POPreview from './POPreview';
import POInvoiceGeneration from './POInvoiceGeneration';
import { useTopBar } from '../../shared/context/TopBarContext';
import { generateDemoPOData, getAvailableIndustries } from '../utils/generateFakeData';
import DownloadButton from './DownloadButton';

const POGeneration = () => {
  const { setActions } = useTopBar();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isIndustryMenuOpen, setIsIndustryMenuOpen] = useState(false);
  const resizerRef = useRef(null);

  const [poData, setPOData] = useState({
    poNumber: '',
    date: new Date().toISOString().split('T')[0],
    vendor: {
      name: '',
      address: '',
      email: '',
    },
    matchType: '2-way',
    status: 'draft'
  });

  const [lineItems, setLineItems] = useState([{
    id: 1,
    description: '',
    quantity: 1,
    unitPrice: 0,
    totalPrice: 0
  }]);

  const [leftWidth, setLeftWidth] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const [activeTab, setActiveTab] = useState('po-details');

  const handleGenerateDemo = async (industryKey = null) => {
    try {
      setIsGenerating(true);
      setIsIndustryMenuOpen(false);
      
      const demoData = generateDemoPOData(industryKey);
      
      setPOData(demoData.poData);
      setLineItems(demoData.lineItems);
      
      toast.success('Demo PO generated successfully');
    } catch (error) {
      console.error('Error generating demo PO:', error);
      toast.error('Failed to generate demo PO');
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    const industries = getAvailableIndustries();
    
    setActions(
      <>
        <div className="relative industry-menu-container">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsIndustryMenuOpen(!isIndustryMenuOpen);
            }}
            disabled={isGenerating}
            className="px-4 py-2 bg-[#E4F222] border border-[#E4F222] text-gray-800 
                    hover:bg-[#cdd71f] hover:border-[#cdd71f] 
                    focus:outline-none focus:ring-2 focus:ring-[#E4F222] focus:ring-opacity-50 
                    transition-colors rounded-lg mr-4"
          >
            Generate Demo PO
          </button>
          
          {isIndustryMenuOpen && (
            <div className="absolute right-0 mt-1 w-64 bg-white border border-gray-300 shadow-lg rounded-lg overflow-hidden z-50">
              <div className="py-1">
                <button
                  onClick={() => handleGenerateDemo()}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  Random Industry
                </button>
                <div className="border-t border-gray-200"></div>
                {industries.map(({ key, name }) => (
                  <button
                    key={key}
                    onClick={() => handleGenerateDemo(key)}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <DownloadButton 
          poData={poData}
          lineItems={lineItems}
        />
      </>
    );

    return () => setActions(null);
  }, [setActions, isGenerating, isIndustryMenuOpen, poData, lineItems]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isIndustryMenuOpen && !event.target.closest('.industry-menu-container')) {
        setIsIndustryMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isIndustryMenuOpen]);

  useEffect(() => {
    const handleResize = (e) => {
      if (isResizing) {
        const containerWidth = document.body.clientWidth;
        const newWidth = (e.clientX / containerWidth) * 100;
        if (newWidth > 30 && newWidth < 70) {
          setLeftWidth(newWidth);
        }
      }
    };

    const handleStopResize = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleResize);
      window.addEventListener('mouseup', handleStopResize);
    }

    return () => {
      window.removeEventListener('mousemove', handleResize);
      window.removeEventListener('mouseup', handleStopResize);
    };
  }, [isResizing]);

  const startResizing = () => {
    setIsResizing(true);
  };

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      {
        id: Date.now(),
        description: '',
        quantity: 1,
        unitPrice: 0,
        totalPrice: 0
      }
    ]);
  };

  const removeLineItem = (id) => {
    setLineItems(lineItems.filter(item => item.id !== id));
  };

  const updateLineItem = (id, field, value) => {
    setLineItems(
      lineItems.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'quantity' || field === 'unitPrice') {
            updatedItem.totalPrice = updatedItem.quantity * updatedItem.unitPrice;
          }
          return updatedItem;
        }
        return item;
      })
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full">
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
        }}
      />

      {/* Header with tabs */}
      <header className="bg-white border-b border-gray-200 sticky top-16 z-20">
        <div className="px-8 py-4 w-full">
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('po-details')}
                className={`px-4 py-2 font-medium rounded-lg transition-colors
                  ${activeTab === 'po-details' 
                    ? 'bg-[#E4F222] text-gray-800' 
                    : 'text-gray-600 hover:text-gray-800'}`}
              >
                PO Details
              </button>
              <button
                onClick={() => setActiveTab('invoice-generation')}
                className={`px-4 py-2 font-medium rounded-lg transition-colors
                  ${activeTab === 'invoice-generation' 
                    ? 'bg-[#E4F222] text-gray-800' 
                    : 'text-gray-600 hover:text-gray-800'}`}
              >
                Generate Invoices
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      {activeTab === 'po-details' ? (
        <div className="flex relative w-full h-[calc(100vh-8rem)]">
          {/* Left Column - Form */}
          <div 
            className="overflow-auto custom-scrollbar"
            style={{ width: `${leftWidth}%` }}
          >
            <div className="p-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <POForm 
                  poData={poData}
                  setPOData={setPOData}
                  lineItems={lineItems}
                  addLineItem={addLineItem}
                  removeLineItem={removeLineItem}
                  updateLineItem={updateLineItem}
                />
              </div>
            </div>
          </div>

          {/* Resizer */}
          <div
            ref={resizerRef}
            className="w-1 bg-gray-200 hover:bg-gray-300 relative group cursor-col-resize"
            onMouseDown={startResizing}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 
                         h-16 w-4 bg-gray-200 hover:bg-gray-300 rounded-full 
                         flex items-center justify-center cursor-col-resize
                         shadow-md transition-all duration-200 
                         group-hover:w-5 group-hover:h-20">
              <div className="flex flex-col gap-1">
                <div className="w-0.5 h-0.5 bg-gray-500 rounded-full"></div>
                <div className="w-0.5 h-0.5 bg-gray-500 rounded-full"></div>
                <div className="w-0.5 h-0.5 bg-gray-500 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Right Column - Preview */}
          <div 
            className="overflow-auto custom-scrollbar"
            style={{ width: `${100 - leftWidth}%` }}
          >
            <div className="p-8">
              <div className="bg-white rounded-lg shadow-sm">
                <POPreview 
                  poData={poData}
                  lineItems={lineItems}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <POInvoiceGeneration 
              poData={poData}
              lineItems={lineItems}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default POGeneration;