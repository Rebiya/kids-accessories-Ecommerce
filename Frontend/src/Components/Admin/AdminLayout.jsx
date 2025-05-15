// src/Components/Admin/AdminLayout.jsx
import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  FiUsers, FiTag, FiShoppingBag, FiPieChart, FiShoppingCart,
  FiPlus, FiX, FiLogOut
} from 'react-icons/fi';
import { motion } from 'framer-motion';

const AdminLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: 'product', path: '/admin/product', icon: FiShoppingBag, label: 'Products' },
    { id: 'category', path: '/admin/category', icon: FiTag, label: 'Categories' },
    { id: 'order', path: '/admin/order', icon: FiShoppingCart, label: 'Orders' },
    { id: 'user', path: '/admin/user', icon: FiUsers, label: 'Users' },
    { id: 'analytics', path: '/admin/analytics', icon: FiPieChart, label: 'Analytics' }
  ];

  const isActiveTab = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      {/* Sidebar */}
      <motion.div 
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`bg-#F9B02E border-r border-gray-200 h-full fixed ${isSidebarCollapsed ? 'w-20' : 'w-64'} shadow-sm z-10`}
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-200">
          {!isSidebarCollapsed && (
            <h2 className="text-xl font-bold text-blue-600">Admin Panel</h2>
          )}
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="text-gray-500 hover:text-gray-700"
          >
            {isSidebarCollapsed ? (
              <FiPlus className="transform rotate-45 text-xl" />
            ) : (
              <FiX className="text-xl" />
            )}
          </button>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <li key={tab.id}>
                  <button
                    onClick={() => navigate(tab.path)}
                    className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                      isActiveTab(tab.path)
                        ? 'bg-blue-100 text-blue-600 font-bold'
                        : 'bg-white hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <Icon className="text-lg" />
                    {!isSidebarCollapsed && <span className="ml-3">{tab.label}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <button 
            onClick={() => navigate('/')}
            className="w-full flex items-center p-3 text-gray-700 hover:text-gray-900 rounded-lg transition-colors"
          >
            <FiLogOut />
            {!isSidebarCollapsed && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className={`flex-1 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'} transition-all duration-300`}>
        <div className="p-6 w-full max-w-[calc(100vw-20rem)]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;