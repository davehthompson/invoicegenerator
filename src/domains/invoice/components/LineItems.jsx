// src/components/LineItems.jsx
import React from 'react';
import { formatCurrency } from '../../shared/utils/format';
import { CURRENCIES } from '../utils/generateFakeData';

const LineItems = ({ 
  lineItems, 
  addLineItem, 
  removeLineItem, 
  updateLineItem,
  currency = CURRENCIES.USD // Add currency prop with default
}) => {
  const formatAmount = (amount) => {
    const currencySymbol = currency?.symbol || CURRENCIES.USD.symbol;
    return `${currencySymbol}${formatCurrency(amount)}`;
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Line Items</h3>
      
      <div className="space-y-4">
        {lineItems.map((item) => (
          <div key={item.id} className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-5">
              <input
                type="text"
                placeholder="Description"
                value={item.description}
                onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-0"
              />
            </div>
            <div className="col-span-2">
              <input
                type="number"
                placeholder="Qty"
                value={item.quantity}
                onChange={(e) => updateLineItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-0"
              />
            </div>
            <div className="col-span-2">
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">
                  {currency?.symbol || '$'}
                </span>
                <input
                  type="number"
                  placeholder="Rate"
                  value={item.rate}
                  onChange={(e) => updateLineItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 pl-7 border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-0"
                />
              </div>
            </div>
            <div className="col-span-2 text-right text-gray-600">
              {formatAmount(item.quantity * item.rate)}
            </div>
            <div className="col-span-1 text-right">
              <button
                onClick={() => removeLineItem(item.id)}
                className="text-sm text-gray-400 hover:text-red-500 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <button
        onClick={addLineItem}
        className="px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:border-blue-500 transition-colors"
      >
        Add Line Item
      </button>
    </div>
  );
};

export default LineItems;