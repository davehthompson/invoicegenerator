import React from 'react';

const RemittanceSection = ({ remittanceInfo, onChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Remittance Information</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Bank Name
          </label>
          <input
            type="text"
            name="bankName"
            value={remittanceInfo.bankName}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Account Name
          </label>
          <input
            type="text"
            name="accountName"
            value={remittanceInfo.accountName}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-0"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Routing Number (ABA)
          </label>
          <input
            type="text"
            name="routingNumber"
            value={remittanceInfo.routingNumber}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-0"
            maxLength="9"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Account Number
          </label>
          <input
            type="text"
            name="accountNumber"
            value={remittanceInfo.accountNumber}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-0"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          SWIFT Code (For International Transfers)
        </label>
        <input
          type="text"
          name="swiftCode"
          value={remittanceInfo.swiftCode}
          onChange={onChange}
          className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-0"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Payment Terms
        </label>
        <input
          type="text"
          name="paymentTerms"
          value={remittanceInfo.paymentTerms}
          placeholder="e.g., Net 30, Due upon receipt"
          onChange={onChange}
          className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-0"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Additional Instructions
        </label>
        <textarea
          name="additionalInstructions"
          value={remittanceInfo.additionalInstructions}
          onChange={onChange}
          rows="2"
          placeholder="Any special instructions for payment processing"
          className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-0"
        />
      </div>
    </div>
  );
};

export default RemittanceSection;