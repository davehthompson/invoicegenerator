// src/domains/purchaseOrder/components/POPreview.jsx
import React from 'react';
import { formatCurrency } from '../../shared/utils/format';

const POPreview = ({ poData, lineItems }) => {
  const calculateTotal = () => {
    return lineItems.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
  };

  return (
    <div className="po-preview-content p-8 max-w-4xl mx-auto bg-white">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">PURCHASE ORDER</h1>
          <div className="text-sm text-gray-600">
            <p>PO Number: <span className="font-semibold text-gray-800">{poData.poNumber}</span></p>
            <p>Date: <span className="font-semibold text-gray-800">{poData.date}</span></p>
            <p>Match Type: <span className="font-semibold text-gray-800">{poData.matchType}</span></p>
          </div>
        </div>
        <div className="text-sm text-right text-gray-600">
          <p>Status: <span className="font-semibold text-gray-800">{poData.status.toUpperCase()}</span></p>
        </div>
      </div>

      {/* Vendor Section */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">Vendor</h2>
        <div className="text-gray-800">
          <p className="font-semibold text-lg">{poData.vendor.name}</p>
          <div className="text-sm">
            {poData.vendor.address.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
          <p className="text-sm mt-1">{poData.vendor.email}</p>
        </div>
      </div>

      {/* Line Items */}
      <div className="mb-8">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Description</th>
              <th className="py-3 text-right text-sm font-semibold text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="py-3 text-right text-sm font-semibold text-gray-500 uppercase tracking-wider">Unit Price</th>
              <th className="py-3 text-right text-sm font-semibold text-gray-500 uppercase tracking-wider">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {lineItems.map((item) => (
              <tr key={item.id}>
                <td className="py-4 text-gray-800">{item.description}</td>
                <td className="py-4 text-right text-gray-800">{item.quantity}</td>
                <td className="py-4 text-right text-gray-800">${formatCurrency(item.unitPrice)}</td>
                <td className="py-4 text-right text-gray-800">
                  ${formatCurrency(item.quantity * item.unitPrice)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-64">
          <div className="flex justify-between pt-4 border-t-2 border-gray-200">
            <span className="text-lg font-semibold text-gray-800">Total</span>
            <span className="text-lg font-semibold text-gray-800">
              ${formatCurrency(calculateTotal())}
            </span>
          </div>
        </div>
      </div>

      {/* Terms and Conditions Section */}
      <div className="mt-8 pt-8 border-t border-gray-200 text-sm text-gray-600">
        <h3 className="font-semibold text-gray-800 mb-2">Terms and Conditions</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>All prices are in USD unless otherwise specified</li>
          <li>Please reference PO number on all correspondence</li>
          {poData.matchType === '3-way' && (
            <li>This PO requires 3-way matching (PO, Invoice, and Goods Receipt) for payment processing</li>
          )}
          {poData.matchType === '2-way' && (
            <li>This PO requires 2-way matching (PO and Invoice) for payment processing</li>
          )}
          <li>Please confirm receipt of this purchase order</li>
        </ul>
      </div>
    </div>
  );
};

export default POPreview;