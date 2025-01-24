// src/domains/purchaseOrder/components/POInvoiceGeneration.jsx
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { formatCurrency } from '../../shared/utils/format';
import { 
  generateInvoiceFromPO,
  generateMultipleInvoices,
  validateInvoiceGeneration
} from '../utils/invoiceGeneratorUtils';
import InvoicePreviewDialog from './InvoicePreviewDialog';

const POInvoiceGeneration = ({ poData, lineItems }) => {  // Make sure lineItems is received as prop
  const [invoiceStrategy, setInvoiceStrategy] = useState('single');
  const [selectedItems, setSelectedItems] = useState({});
  const [quantities, setQuantities] = useState({});
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [generatedInvoices, setGeneratedInvoices] = useState([]);

  // Initialize quantities from line items
  React.useEffect(() => {
    const initialQuantities = {};
    lineItems.forEach(item => {
      initialQuantities[item.id] = item.quantity;
    });
    setQuantities(initialQuantities);
  }, [lineItems]);

  const handleItemSelect = (itemId) => {
    setSelectedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleQuantityChange = (itemId, value) => {
    const newValue = Math.min(
      Math.max(0, parseInt(value) || 0),
      lineItems.find(item => item.id === itemId)?.quantity || 0
    );
    
    setQuantities(prev => ({
      ...prev,
      [itemId]: newValue
    }));
  };

  const calculateTotal = (items) => {
    return items.reduce((sum, item) => sum + (quantities[item.id] * item.unitPrice), 0);
  };

  const handleGenerateInvoices = () => {
    console.log('Generate Invoices clicked');
    console.log('Current state:', {
      poData,
      lineItems,
      selectedItems,
      quantities,
      invoiceStrategy
    });

    // Validate
    const errors = validateInvoiceGeneration(selectedItems, quantities);
    if (errors.length > 0) {
      toast.error(errors[0]);
      return;
    }

    try {
      let invoices;
      if (invoiceStrategy === 'single') {
        console.log('Generating single invoice with:', {
          poData,
          lineItems,
          selectedItems,
          quantities
        });
        invoices = [generateInvoiceFromPO(poData, lineItems, selectedItems, quantities)];
      } else {
        invoices = generateMultipleInvoices(poData, lineItems, selectedItems, quantities);
      }

      console.log('Generated invoices:', invoices);
      setGeneratedInvoices(invoices);
      setIsPreviewOpen(true);
    } catch (error) {
      console.error('Error generating invoices:', error);
      toast.error('Failed to generate invoices');
    }
  };

  const handleDownload = () => {
    // TODO: Implement download functionality
    toast.success('Download functionality coming soon');
    setIsPreviewOpen(false);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                When generating invoices ensure you have at least one line item.
              </p>
            </div>
          </div>
        </div>

        {/* Invoice Strategy Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Invoice Generation Strategy</h3>
          <div className="flex gap-4">
            <label className="relative flex items-start">
              <input
                type="radio"
                className="form-radio h-4 w-4 text-blue-600"
                checked={invoiceStrategy === 'single'}
                onChange={() => setInvoiceStrategy('single')}
              />
              <span className="ml-2 text-sm">
                <span className="font-medium text-gray-900">Single Invoice</span>
                <span className="text-gray-500 block">Generate one invoice for all selected items</span>
              </span>
            </label>
            <label className="relative flex items-start">
              <input
                type="radio"
                className="form-radio h-4 w-4 text-blue-600"
                checked={invoiceStrategy === 'multiple'}
                onChange={() => setInvoiceStrategy('multiple')}
              />
              <span className="ml-2 text-sm">
                <span className="font-medium text-gray-900">Multiple Invoices</span>
                <span className="text-gray-500 block">Generate separate invoices for deliveries</span>
              </span>
            </label>
          </div>
        </div>

        {/* Line Items Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Line Items</h3>
          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-blue-600"
                      checked={Object.keys(selectedItems).length === lineItems.length}
                      onChange={() => {
                        const allSelected = Object.keys(selectedItems).length === lineItems.length;
                        const newSelection = {};
                        lineItems.forEach(item => {
                          newSelection[item.id] = !allSelected;
                        });
                        setSelectedItems(newSelection);
                      }}
                    />
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ordered Qty
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice Qty
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {lineItems.map(item => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-blue-600"
                        checked={selectedItems[item.id] || false}
                        onChange={() => handleItemSelect(item.id)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        min="0"
                        max={item.quantity}
                        value={quantities[item.id] || 0}
                        onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                        className="form-input w-20 text-sm border-gray-300 rounded-md"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${formatCurrency(item.unitPrice)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${formatCurrency(quantities[item.id] * item.unitPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary and Actions */}
        <div className="flex justify-between items-start pt-6 border-t">
          <div>
            <button
              onClick={handleGenerateInvoices}
              className="px-4 py-2 bg-[#E4F222] border border-[#E4F222] text-gray-800 
                      hover:bg-[#cdd71f] hover:border-[#cdd71f] 
                      focus:outline-none focus:ring-2 focus:ring-[#E4F222] focus:ring-opacity-50 
                      transition-colors rounded-lg"
            >
              Generate {invoiceStrategy === 'single' ? 'Invoice' : 'Invoices'}
            </button>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">
              Selected Items Total: ${formatCurrency(calculateTotal(lineItems.filter(item => selectedItems[item.id])))}
            </p>
          </div>
        </div>
      </div>

      <InvoicePreviewDialog 
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        invoices={generatedInvoices}
        onDownload={handleDownload}
      />
    </>
  );
};

export default POInvoiceGeneration;