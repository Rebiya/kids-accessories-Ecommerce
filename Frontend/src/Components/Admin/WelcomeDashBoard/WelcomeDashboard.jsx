import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMenu, FiX, FiHome, FiShoppingBag, FiTag, 
  FiUsers, FiShoppingCart, FiPieChart, FiChevronRight, FiLogOut
} from 'react-icons/fi';
import { FaReact, FaChartLine, FaBoxOpen } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import ProductDashboard from '../ProductDashBoard/ProductDashboard';
import OrderDashboard from '../OrderDashBoard/OrderDashboard';
import CategoryDashboard from '../CategoryDashBoard/CategoryDashboard';
import UserDashboard from '../UserDashBoard/UserDashboard';
import AnalyticsDashboard from '../AnalyticsDashBoard/AnalyticsDashboard';
import ProtectedRoute from "../../ProtectedRoute/ProtectedRoute"

const WelcomeDashboard = () => {
  const [isWelcome, setIsWelcome] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: 'Products', icon: <FiShoppingBag />, path: '/admin/product' },
    { name: 'Categories', icon: <FiTag />, path: '/admin/category' },
    { name: 'Orders', icon: <FiShoppingCart />, path: '/admin/order' },
    { name: 'Users', icon: <FiUsers />, path: '/admin/user' },
    { name: 'Analytics', icon: <FiPieChart />, path: '/admin/analytics' },
  ];

  // Close sidebar when route changes on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const enterDashboard = () => {
    setIsWelcome(false);
    navigate('/admin/product'); // Default to products dashboard
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navigateTo = (path) => {
    navigate(path);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const logout = () => {
    // Add your logout logic here
    navigate('/');
  };

  if (isWelcome) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-6"
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl w-full border border-gray-100"
        >
          <div className="flex justify-center mb-6">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 rounded-full shadow-lg"
            >
              <FaReact className="text-4xl text-white" />
            </motion.div>
          </div>
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">Dashboard Pro</span>
          </h1>
          <p className="text-lg text-gray-600 text-center mb-8">
            The ultimate solution for managing your business with beautiful analytics and intuitive controls.
          </p>
          <div className="flex justify-center">
            <motion.button
              onClick={enterDashboard}
              className="flex items-center px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-lg transition-all shadow-md hover:shadow-lg"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <FaChartLine className="mr-2" />
              Launch Dashboard
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  const renderContent = () => {
    switch (location.pathname) {
      case '/admin/product':
        return (
          <ProtectedRoute allowedRoles={[2, 3]} msg={"You must log in to access products"} redirect={"/admin/product"}>
            <ProductDashboard />
          </ProtectedRoute>
        );
      case '/admin/order':
        return (
          <ProtectedRoute allowedRoles={[2, 3]} msg={"You must log in to access orders"} redirect={"/admin/order"}>
            <OrderDashboard />
          </ProtectedRoute>
        );
      case '/admin/category':
        return (
          <ProtectedRoute allowedRoles={[2, 3]} msg={"You must log in to access categories"} redirect={"/admin/category"}>
            <CategoryDashboard />
          </ProtectedRoute>
        );
      case '/admin/user':
        return (
          <ProtectedRoute allowedRoles={[2, 3]} msg={"You must log in to access users"} redirect={"/admin/user"}>
            <UserDashboard />
          </ProtectedRoute>
        );
      case '/admin/analytics':
        return (
          <ProtectedRoute allowedRoles={[2, 3]} msg={"You must log in to access analytics"} redirect={"/admin/analytics"}>
            <AnalyticsDashboard />
          </ProtectedRoute>
        );
      default:
        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
            <p className="text-gray-600">Select a section from the sidebar to manage your store.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={toggleSidebar}
        className="fixed z-30 md:hidden m-4 p-3 rounded-full bg-white shadow-md text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all"
      >
        <FiMenu className="text-xl" />
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        {(isSidebarOpen || window.innerWidth >= 768) && (
          <motion.div 
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed md:relative z-20 h-full bg-white shadow-xl w-64"
          >
            <div className="p-4 flex items-center justify-between border-b border-gray-100">
              <div className="flex items-center">
                <FaBoxOpen className="text-2xl text-indigo-600 mr-2" />
                <span className="text-xl font-bold text-gray-800">Dashboard Pro</span>
              </div>
              <button 
                onClick={toggleSidebar}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors md:hidden"
              >
                <FiX className="text-xl" />
              </button>
            </div>
            
            <nav className="p-4">
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => navigateTo('/admin')}
                    className="w-full flex items-center p-3 rounded-lg transition-all text-gray-600 hover:bg-gray-50"
                  >
                    <FiHome className="text-lg" />
                    <span className="ml-3">Overview</span>
                  </button>
                </li>
                {menuItems.map((item) => (
                  <li key={item.path}>
                    <button
                      onClick={() => navigateTo(item.path)}
                      className={`w-full flex items-center p-3 rounded-lg transition-all ${
                        location.pathname === item.path
                          ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span className="ml-3">{item.name}</span>
                      <FiChevronRight className="ml-auto" />
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
            
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
              <button 
                onClick={logout}
                className="w-full flex items-center p-3 text-gray-600 hover:text-gray-800 rounded-lg transition-colors"
              >
                <FiLogOut />
                <span className="ml-3">Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay for mobile */}
      {isSidebarOpen && window.innerWidth < 768 && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={toggleSidebar}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default WelcomeDashboard;