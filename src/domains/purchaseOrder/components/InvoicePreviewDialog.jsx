// src/domains/purchaseOrder/components/InvoicePreviewDialog.jsx
import React from 'react';
import { formatCurrency } from '../../shared/utils/format';

const InvoicePreviewDialog = ({ 
  isOpen, 
  onClose, 
  invoices,
  onDownload 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              Preview Generated {invoices.length > 1 ? 'Invoices' : 'Invoice'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="overflow-y-auto p-6 max-h-[calc(90vh-12rem)]">
          {invoices.map((invoice, index) => (
            <div 
              key={invoice.invoiceNumber}
              className={`mb-8 p-6 border rounded-lg ${index !== invoices.length - 1 ? 'mb-8' : ''}`}
            >
              <div className="flex justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Invoice #{invoice.invoiceNumber}
                  </h3>
                  <p className="text-sm text-gray-500">Reference PO: {invoice.poNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Date: {invoice.date}</p>
                  <p className="text-sm text-gray-500">Due Date: {invoice.dueDate}</p>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Line Items</h4>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Quantity</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Rate</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {invoice.lineItems.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-2 text-sm text-gray-900">{item.description}</td>
                        <td className="px-4 py-2 text-sm text-gray-900 text-right">{item.quantity}</td>
                        <td className="px-4 py-2 text-sm text-gray-900 text-right">${formatCurrency(item.unitPrice)}</td>
                        <td className="px-4 py-2 text-sm text-gray-900 text-right">${formatCurrency(item.amount)}</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan="3" className="px-4 py-2 text-right font-medium">Total</td>
                      <td className="px-4 py-2 text-right font-medium">${formatCurrency(invoice.total)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onDownload}
            className="px-4 py-2 bg-[#E4F222] border border-[#E4F222] text-gray-800 
                     hover:bg-[#cdd71f] hover:border-[#cdd71f] 
                     focus:outline-none focus:ring-2 focus:ring-[#E4F222] focus:ring-opacity-50 
                     transition-colors rounded-lg"
          >
            Download {invoices.length > 1 ? 'Invoices' : 'Invoice'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreviewDialog;