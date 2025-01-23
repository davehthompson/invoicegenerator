import React, { useState } from 'react';
import { 
  Menu, 
  X,
  FileText, 
  ClipboardList, 
  GitCompare,
  Settings
} from 'lucide-react';

const Layout = ({ children, topBarActions }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeRoute, setActiveRoute] = useState('invoice-generator');

  const navigationItems = [
    { id: 'invoice-generator', label: 'Invoice Generator', icon: FileText },
    { id: 'purchase-orders', label: 'Purchase Orders', icon: ClipboardList },
    { id: 'reconciliation', label: 'Document Matching', icon: GitCompare },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-30 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="flex h-full">
          <div className="flex flex-col w-64 bg-white border-r">
            <div className="flex items-center justify-between h-16 px-4 border-b">
              <h2 className="text-xl font-semibold text-gray-800">DocFlow</h2>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-1 text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex-1 px-4 pt-4 space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveRoute(item.id)}
                    className={`flex items-center w-full px-4 py-2 text-sm rounded-lg ${
                      activeRoute === item.id
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 ${isSidebarOpen ? 'ml-64' : 'ml-0'} transition-margin duration-300`}>
        {/* Top Bar */}
        <div className="sticky top-0 z-40 flex items-center justify-between h-16 bg-white border-b px-4">
          <div className="flex items-center">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-1 mr-4 text-gray-500 hover:text-gray-700"
              >
                <Menu className="w-6 h-6" />
              </button>
            )}
          </div>
          {/* Actions slot */}
          <div className="flex items-center gap-4">
            {topBarActions}
          </div>
        </div>

        {/* Content Area */}
        <div className="w-full h-[calc(100vh-4rem)] bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;