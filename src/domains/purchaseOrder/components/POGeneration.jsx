// src/domains/purchaseOrder/components/POGeneration.jsx
import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import POForm from './POForm';
import { useTopBar } from '../../shared/context/TopBarContext';

const POGeneration = () => {
  console.log("POGeneration component mounted");
  const { setActions } = useTopBar();

  const [poData, setPOData] = useState({
    poNumber: '',
    date: new Date().toISOString().split('T')[0],
    vendor: {
      name: '',
      address: '',
      email: '',
    },
    matchType: '2-way',
    lineItems: [{
      id: 1,
      description: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0
    }],
    status: 'draft'
  });

  const [generatedInvoices, setGeneratedInvoices] = useState([]);
  const [activeTab, setActiveTab] = useState('po-details');

  // Set up top bar actions for this component
  useEffect(() => {
    setActions(
      <>
        <button
          onClick={() => handleGenerateDemo()}
          className="px-4 py-2 bg-[#E4F222] border border-[#E4F222] text-gray-800 
                    hover:bg-[#cdd71f] hover:border-[#cdd71f] 
                    focus:outline-none focus:ring-2 focus:ring-[#E4F222] focus:ring-opacity-50 
                    transition-colors rounded-lg"
        >
          Generate Demo PO
        </button>
        <button
          onClick={() => handleDownload()}
          className="px-4 py-2 bg-[#E4F222] border border-[#E4F222] text-gray-800 
                    hover:bg-[#cdd71f] hover:border-[#cdd71f] 
                    focus:outline-none focus:ring-2 focus:ring-[#E4F222] focus:ring-opacity-50 
                    transition-colors rounded-lg"
        >
          Download All
        </button>
      </>
    );

    return () => setActions(null);
  }, [setActions]);

  const handleGenerateDemo = () => {
    // TODO: Implement demo PO generation
    console.log('Generating demo PO...');
  };

  const handleDownload = () => {
    // TODO: Implement download functionality
    console.log('Downloading PO and related invoices...');
  };

  const addLineItem = () => {
    const newItem = {
      id: Date.now(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0
    };
    setPOData({
      ...poData,
      lineItems: [...poData.lineItems, newItem]
    });
  };

  const removeLineItem = (id) => {
    setPOData({
      ...poData,
      lineItems: poData.lineItems.filter(item => item.id !== id)
    });
  };

  const updateLineItem = (id, field, value) => {
    setPOData({
      ...poData,
      lineItems: poData.lineItems.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'quantity' || field === 'unitPrice') {
            updatedItem.totalPrice = updatedItem.quantity * updatedItem.unitPrice;
          }
          return updatedItem;
        }
        return item;
      })
    });
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
            {/* Tabs */}
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
      <div className="flex-1 p-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {activeTab === 'po-details' ? (
            <POForm 
              poData={poData}
              setPOData={setPOData}
              lineItems={poData.lineItems}
              addLineItem={addLineItem}
              removeLineItem={removeLineItem}
              updateLineItem={updateLineItem}
            />
          ) : (
            <div>
              {/* TODO: Add Invoice Generation Component */}
              <p className="text-gray-500">Invoice Generation interface coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default POGeneration;