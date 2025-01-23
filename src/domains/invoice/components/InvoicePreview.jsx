import React, { useEffect, useState, useRef } from 'react';
import { formatCurrency } from '../../shared/utils/format';
import { getCompanyLogoPath } from '../utils/logoUtils';
import PaperEffects from './PaperEffects';
import { CURRENCIES } from '../utils/generateFakeData';

const InvoicePreview = ({ 
  invoiceData, 
  lineItems, 
  logo, 
  taxSettings = { type: 'percentage', value: 0 },
  activeEffects = []
}) => {
  const [storedLogo, setStoredLogo] = useState(null);
  const logoRef = useRef(null);

  useEffect(() => {
    const loadStoredLogo = async () => {
      if (!logo && invoiceData.companyDetails.name) {
        const logoPath = await getCompanyLogoPath(invoiceData.companyDetails.name);
        setStoredLogo(logoPath);
      }
    };
    loadStoredLogo();
  }, [logo, invoiceData.companyDetails.name]);

  useEffect(() => {
    if (logoRef.current) {
      const img = logoRef.current;
      const rect = img.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(img);
      
      console.log('Logo Preview Dimensions:', {
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        clientWidth: img.clientWidth,
        clientHeight: img.clientHeight,
        boundingRect: {
          width: rect.width,
          height: rect.height
        },
        computedStyle: {
          width: computedStyle.width,
          height: computedStyle.height
        }
      });
    }
  }, [logo, storedLogo]);

  const formatAmount = (amount) => {
    const currencySymbol = invoiceData.currency?.symbol || CURRENCIES.USD.symbol;
    return `${currencySymbol}${formatCurrency(amount)}`;
  };

  const calculateSubtotal = () => {
    return lineItems.reduce((total, item) => total + (item.quantity * item.rate), 0);
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    const value = parseFloat(taxSettings.value) || 0;
    return taxSettings.type === 'percentage' ? (subtotal * value) / 100 : value;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  return (
    <div className="invoice-preview-content p-8 max-w-4xl mx-auto bg-white relative overflow-hidden">
      <PaperEffects effects={activeEffects} />

      {/* Header Section */}
      <div className="flex justify-between items-start mb-16 relative">
        <div className="w-1/2">
          {logo ? (
            <div className="logo-container" style={{ 
              maxWidth: '300px', 
              marginBottom: '1rem',
              display: 'block'
            }}>
              <img 
                ref={logoRef}
                src={logo} 
                alt="Company logo" 
                className="logo-image"
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  display: 'block'
                }}
              />
            </div>
          ) : storedLogo ? (
            <div className="logo-container" style={{ 
              maxWidth: '300px', 
              marginBottom: '1rem',
              display: 'block'
            }}>
              <img 
                ref={logoRef}
                src={storedLogo} 
                alt={`${invoiceData.companyDetails.name} logo`}
                className="logo-image"
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  display: 'block'
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  setStoredLogo(null);
                }}
              />
            </div>
          ) : (
            <div className="text-3xl font-bold text-gray-800 mb-4">
              {invoiceData.companyDetails.name}
            </div>
          )}
        </div>
        <div className="w-1/2 text-right">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">INVOICE</h1>
          <div className="text-sm text-gray-600 space-y-1">
            <p>Invoice Number: <span className="font-semibold text-gray-800">{invoiceData.invoiceNumber}</span></p>
            <p>Date: <span className="font-semibold text-gray-800">{invoiceData.date}</span></p>
            <p>Due Date: <span className="font-semibold text-gray-800">{invoiceData.dueDate}</span></p>
          </div>
        </div>
      </div>

      {/* Addresses Section */}
      <div className="flex justify-between mb-16 relative">
        {/* From Address */}
        <div className="w-1/2 pr-8">
          <h2 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">From</h2>
          <div className="text-gray-800 space-y-1">
            <p className="font-semibold text-lg">{invoiceData.companyDetails.name}</p>
            <div className="text-sm">
              {invoiceData.companyDetails.address.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
            <p className="text-sm">{invoiceData.companyDetails.email}</p>
            <p className="text-sm">{invoiceData.companyDetails.phone}</p>
          </div>
        </div>

        {/* To Address */}
        <div className="w-1/2 pl-8">
          <h2 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">Bill To</h2>
          <div className="text-gray-800 space-y-1">
            <p className="font-semibold text-lg">{invoiceData.clientDetails.name}</p>
            <div className="text-sm">
              {invoiceData.clientDetails.address.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
            <p className="text-sm">{invoiceData.clientDetails.email}</p>
          </div>
        </div>
      </div>

      {/* Line Items Table */}
      <div className="mb-16 relative">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Description</th>
              <th className="py-3 text-right text-sm font-semibold text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="py-3 text-right text-sm font-semibold text-gray-500 uppercase tracking-wider">Rate</th>
              <th className="py-3 text-right text-sm font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {lineItems.map((item) => (
              <tr key={item.id}>
                <td className="py-4 text-gray-800">{item.description}</td>
                <td className="py-4 text-right text-gray-800">{item.quantity}</td>
                <td className="py-4 text-right text-gray-800">{formatAmount(item.rate)}</td>
                <td className="py-4 text-right text-gray-800">
                  {formatAmount(item.quantity * item.rate)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals Section */}
      <div className="flex justify-end relative">
        <div className="w-80 space-y-3">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal</span>
            <span className="font-medium">{formatAmount(calculateSubtotal())}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>
              Tax {taxSettings.type === 'percentage' && taxSettings.value ? 
                `(${taxSettings.value}%)` : ''}
            </span>
            <span className="font-medium">{formatAmount(calculateTax())}</span>
          </div>
          <div className="flex justify-between pt-3 border-t-2 border-gray-200">
            <span className="text-lg font-semibold text-gray-800">Total</span>
            <span className="text-lg font-semibold text-gray-800">
              {formatAmount(calculateTotal())}
            </span>
          </div>
        </div>
      </div>

      {/* Remittance Information Section */}
      {invoiceData.remittanceInfo.bankName && (
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Payment Instructions</h2>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
              {invoiceData.remittanceInfo.bankName && (
                <div>
                  <span className="font-medium text-gray-500">Bank Name:</span>
                  <span className="ml-2 text-gray-800">{invoiceData.remittanceInfo.bankName}</span>
                </div>
              )}
              {invoiceData.remittanceInfo.accountName && (
                <div>
                  <span className="font-medium text-gray-500">Account Name:</span>
                  <span className="ml-2 text-gray-800">{invoiceData.remittanceInfo.accountName}</span>
                </div>
              )}
              {invoiceData.remittanceInfo.routingNumber && (
                <div>
                  <span className="font-medium text-gray-500">Routing Number:</span>
                  <span className="ml-2 text-gray-800">{invoiceData.remittanceInfo.routingNumber}</span>
                </div>
              )}
              {invoiceData.remittanceInfo.accountNumber && (
                <div>
                  <span className="font-medium text-gray-500">Account Number:</span>
                  <span className="ml-2 text-gray-800">{invoiceData.remittanceInfo.accountNumber}</span>
                </div>
              )}
              {invoiceData.remittanceInfo.swiftCode && (
                <div>
                  <span className="font-medium text-gray-500">SWIFT Code:</span>
                  <span className="ml-2 text-gray-800">{invoiceData.remittanceInfo.swiftCode}</span>
                </div>
              )}
              {invoiceData.remittanceInfo.paymentTerms && (
                <div>
                  <span className="font-medium text-gray-500">Payment Terms:</span>
                  <span className="ml-2 text-gray-800">{invoiceData.remittanceInfo.paymentTerms}</span>
                </div>
              )}
            </div>
            {invoiceData.remittanceInfo.additionalInstructions && (
              <div className="col-span-2 text-sm">
                <span className="font-medium text-gray-500">Additional Instructions:</span>
                <p className="mt-1 text-gray-800">{invoiceData.remittanceInfo.additionalInstructions}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoicePreview;