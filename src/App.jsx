// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './domains/shared/components/Layout';
import InvoiceContent from './domains/invoice/components/InvoiceContent';
import POGeneration from './domains/purchaseOrder/components/POGeneration';
import TravelExpenseContent from './domains/travelExpense/components/TravelExpenseContent';
import { TopBarProvider } from './domains/shared/context/TopBarContext';
import loadingLogo from './assets/company-logos/ramp-logo.png';

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
        <div className="animate-pulse">
          <img 
            src={loadingLogo} 
            alt="Ramp"
            className="w-[68px] h-[68px] mx-auto"
          />
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
            <Route path="/travel-expense" element={<TravelExpenseContent />} />
            <Route path="/" element={<Navigate to="/invoice-generator" replace />} />
          </Routes>
        </Layout>
        <Toaster />
      </TopBarProvider>
    </Router>
  );
}

export default App;