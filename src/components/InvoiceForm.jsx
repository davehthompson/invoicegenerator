// src/components/InvoiceForm.jsx
import React from 'react';
import LineItems from './LineItems';
import LogoUpload from './LogoUpload';
import RemittanceSection from './RemittanceSection';
import { formatCurrency } from '../shared/utils/format';
import { CURRENCIES } from '../utils/generateFakeData';

const InvoiceForm = ({
  invoiceData,
  setInvoiceData,
  lineItems,
  addLineItem,
  removeLineItem,
  updateLineItem,
  logo,
  setLogo,
  taxSettings,
  setTaxSettings
}) => {
  const handleInputChange = (e, section) => {
    const { name, value } = e.target;
    if (section) {
      setInvoiceData({
        ...invoiceData,
        [section]: {
          ...invoiceData[section],
          [name]: value
        }
      });
    } else {
      setInvoiceData({
        ...invoiceData,
        [name]: value
      });
    }
  };

  const handleTaxTypeChange = (type) => {
    setTaxSettings(prev => ({
      ...prev,
      type,
      value: ''  // Reset to empty string when switching types
    }));
  };

  const handleTaxValueChange = (value) => {
    setTaxSettings(prev => ({
      ...prev,
      value: value === '' ? '' : parseFloat(value)
    }));
  };

  const handleCurrencyChange = (e) => {
    setInvoiceData({
      ...invoiceData,
      currency: CURRENCIES[e.target.value]
    });
  };

  const calculateSubtotal = () => {
    return lineItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    const value = parseFloat(taxSettings.value) || 0;
    
    if (taxSettings.type === 'percentage') {
      return (subtotal * value) / 100;
    }
    return value;
  };

  return (
    <div className="space-y-8">
      {/* Logo Upload */}
      <LogoUpload logo={logo} setLogo={setLogo} />

      {/* Basic Invoice Details */}
      <div className="space-y-4">
        <h2 className="text-xl font-medium text-gray-900 border-b pb-2">Create Invoice</h2>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Invoice Number
            </label>
            <input
              type="text"
              name="invoiceNumber"
              value={invoiceData.invoiceNumber}
              onChange={(e) => handleInputChange(e)}
              className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Currency
            </label>
            <select
              value={invoiceData.currency?.code || 'USD'}
              onChange={handleCurrencyChange}
              className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-0"
            >
              {Object.entries(CURRENCIES).map(([code, currency]) => (
                <option key={code} value={code}>
                  {currency.name} ({currency.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={invoiceData.date}
              onChange={(e) => handleInputChange(e)}
              className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Due Date
            </label>
            <input
              type="date"
              name="dueDate"
              value={invoiceData.dueDate}
              onChange={(e) => handleInputChange(e)}
              className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-0"
            />
          </div>
        </div>
      </div>

      {/* Company Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Company Details</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Company Name
            </label>
            <input
              type="text"
              name="name"
              value={invoiceData.companyDetails.name}
              onChange={(e) => handleInputChange(e, 'companyDetails')}
              className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Address
            </label>
            <textarea
              name="address"
              value={invoiceData.companyDetails.address}
              onChange={(e) => handleInputChange(e, 'companyDetails')}
              rows="2"
              className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-0"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={invoiceData.companyDetails.email}
                onChange={(e) => handleInputChange(e, 'companyDetails')}
                className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={invoiceData.companyDetails.phone}
                onChange={(e) => handleInputChange(e, 'companyDetails')}
                className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Client Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Client Details</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Client Name
            </label>
            <input
              type="text"
              name="name"
              value={invoiceData.clientDetails.name}
              onChange={(e) => handleInputChange(e, 'clientDetails')}
              className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Address
            </label>
            <textarea
              name="address"
              value={invoiceData.clientDetails.address}
              onChange={(e) => handleInputChange(e, 'clientDetails')}
              rows="2"
              className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={invoiceData.clientDetails.email}
              onChange={(e) => handleInputChange(e, 'clientDetails')}
              className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-0"
            />
          </div>
        </div>
      </div>

      {/* Line Items */}
      <LineItems
        lineItems={lineItems}
        addLineItem={addLineItem}
        removeLineItem={removeLineItem}
        updateLineItem={updateLineItem}
      />

      {/* Tax Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Tax</h3>
        
        <div className="space-y-4">
          <div className="flex w-72">
            <button
              onClick={() => handleTaxTypeChange(taxSettings.type === 'percentage' ? 'fixed' : 'percentage')}
              className="flex items-center justify-center px-3 py-2 border border-r-0 bg-white text-gray-600 hover:bg-gray-50 transition-colors"
              title={taxSettings.type === 'percentage' ? 'Switch to fixed amount' : 'Switch to percentage'}
            >
              <span className="font-medium text-sm">
                {taxSettings.type === 'percentage' ? '%' : invoiceData.currency?.symbol || '$'}
              </span>
            </button>
            <input
              type="text"
              value={taxSettings.value || ''}
              onChange={(e) => {
                const value = e.target.value;
                // Only allow numbers and decimal points
                if (value === '' || /^\d*\.?\d*$/.test(value)) {
                  handleTaxValueChange(value === '' ? '' : parseFloat(value));
                }
              }}
              onBlur={(e) => {
                // Format on blur to ensure valid number
                const value = e.target.value;
                if (value && !isNaN(parseFloat(value))) {
                  handleTaxValueChange(parseFloat(value));
                }
              }}
              className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-0"
              placeholder={taxSettings.type === 'percentage' ? 'Enter tax rate' : 'Enter tax amount'}
            />
          </div>

          <div className="text-right text-gray-600">
            <p>Subtotal: {invoiceData.currency?.symbol || '$'}{formatCurrency(calculateSubtotal())}</p>
            <p>Tax: {invoiceData.currency?.symbol || '$'}{formatCurrency(calculateTax())}</p>
            <p className="text-lg font-medium text-gray-900">
              Total: {invoiceData.currency?.symbol || '$'}{formatCurrency(calculateSubtotal() + calculateTax())}
            </p>
          </div>
        </div>
      </div>

      {/* Remittance Section */}
      <RemittanceSection
        remittanceInfo={invoiceData.remittanceInfo}
        onChange={(e) => handleInputChange(e, 'remittanceInfo')}
      />
    </div>
  );
};

export default InvoiceForm;