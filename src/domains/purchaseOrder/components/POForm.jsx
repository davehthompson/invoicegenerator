// src/domains/purchaseOrder/components/POForm.jsx
import React from 'react';

const POForm = ({ 
  poData, 
  setPoData, 
  lineItems, 
  addLineItem, 
  removeLineItem, 
  updateLineItem 
}) => {
  const handleInputChange = (e, section) => {
    const { name, value } = e.target;
    if (section) {
      setPoData({
        ...poData,
        [section]: {
          ...poData[section],
          [name]: value
        }
      });
    } else {
      setPoData({
        ...poData,
        [name]: value
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Basic PO Details */}
      <div className="space-y-4">
        <h2 className="text-xl font-medium text-gray-900 border-b pb-2">Create Purchase Order</h2>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              PO Number
            </label>
            <input
              type="text"
              name="poNumber"
              value={poData.poNumber}
              onChange={(e) => handleInputChange(e)}
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-blue-500 focus:ring-0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={poData.date}
              onChange={(e) => handleInputChange(e)}
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-blue-500 focus:ring-0"
            />
          </div>
        </div>

        {/* Match Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Match Type
          </label>
          <div className="flex gap-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="matchType"
                value="2-way"
                checked={poData.matchType === '2-way'}
                onChange={(e) => handleInputChange(e)}
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="ml-2 text-gray-700">2-Way Match</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="matchType"
                value="3-way"
                checked={poData.matchType === '3-way'}
                onChange={(e) => handleInputChange(e)}
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="ml-2 text-gray-700">3-Way Match</span>
            </label>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {poData.matchType === '2-way' 
              ? '2-Way matching compares PO and Invoice only' 
              : '3-Way matching includes Goods Receipt verification'}
          </p>
        </div>
      </div>

      {/* Vendor Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Vendor Details</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Vendor Name
            </label>
            <input
              type="text"
              name="name"
              value={poData.vendor.name}
              onChange={(e) => handleInputChange(e, 'vendor')}
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-blue-500 focus:ring-0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Address
            </label>
            <textarea
              name="address"
              value={poData.vendor.address}
              onChange={(e) => handleInputChange(e, 'vendor')}
              rows="2"
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-blue-500 focus:ring-0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={poData.vendor.email}
              onChange={(e) => handleInputChange(e, 'vendor')}
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-blue-500 focus:ring-0"
            />
          </div>
        </div>
      </div>

      {/* Line Items */}
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
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-blue-500 focus:ring-0"
                />
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => updateLineItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-blue-500 focus:ring-0"
                />
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  placeholder="Unit Price"
                  value={item.unitPrice}
                  onChange={(e) => updateLineItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-blue-500 focus:ring-0"
                />
              </div>
              <div className="col-span-2 text-right text-gray-600">
                ${(item.quantity * item.unitPrice).toFixed(2)}
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
          className="px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:border-blue-500 transition-colors rounded-md"
        >
          Add Line Item
        </button>

        {/* Total Section */}
        <div className="flex justify-end pt-4 border-t">
          <div className="w-64 space-y-3">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span className="font-medium">
                ${lineItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POForm;