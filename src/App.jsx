// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './domains/shared/components/Layout';
import InvoiceContent from './domains/invoice/components/InvoiceContent';
import POGeneration from './domains/purchaseOrder/components/POGeneration';
import { TopBarProvider } from './domains/shared/context/TopBarContext';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        <div className="text-center">
          <div className="animate-pulse mb-4">
            <svg
              className="w-24 h-24 text-blue-500"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-700 animate-pulse">
            Loading Invoice Generator...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <TopBarProvider>
        <Layout>
          <Routes>
            <Route path="/invoice-generator" element={<InvoiceContent />} />
            <Route path="/po-generation" element={<POGeneration />} />
            <Route path="/" element={<Navigate to="/invoice-generator" replace />} />
          </Routes>
        </Layout>
        <Toaster />
      </TopBarProvider>
    </Router>
  );
}

export default App;