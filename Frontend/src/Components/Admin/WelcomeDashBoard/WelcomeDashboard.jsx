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
import ProtectedRoute from "../../ProtectedRoute/ProtectedRoute";
import styles from './WelcomeDashboard.module.css';

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
    navigate('/admin/product');
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
    navigate('/');
  };

  if (isWelcome) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={styles.welcomeContainer}
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={styles.welcomeCard}
        >
          <div className={styles.logoContainer}>
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
              className={styles.reactLogo}
            >
              <FaReact className={styles.reactIcon} />
            </motion.div>
          </div>
          <h1 className={styles.welcomeTitle}>
            Welcome to <span className={styles.gradientText}>Dashboard Pro</span>
          </h1>
          <p className={styles.welcomeSubtitle}>
            The ultimate solution for managing your business with beautiful analytics and intuitive controls.
          </p>
          <div className={styles.buttonContainer}>
            <motion.button
              onClick={enterDashboard}
              className={styles.launchButton}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <FaChartLine className={styles.buttonIcon} />
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
          <div className={styles.defaultContent}>
            <h2 className={styles.defaultTitle}>Admin Dashboard</h2>
            <p className={styles.defaultText}>Select a section from the sidebar to manage your store.</p>
          </div>
        );
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={toggleSidebar}
        className={styles.mobileMenuButton}
      >
        <FiMenu className={styles.menuIcon} />
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        {(isSidebarOpen || window.innerWidth >= 768) && (
          <motion.div 
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={styles.sidebar}
          >
            <div className={styles.sidebarHeader}>
              <div className={styles.brandContainer}>
                <FaBoxOpen className={styles.brandIcon} />
                <span className={styles.brandText}>Dashboard Pro</span>
              </div>
              <button 
                onClick={toggleSidebar}
                className={styles.closeSidebarButton}
              >
                <FiX className={styles.closeIcon} />
              </button>
            </div>
            
            <nav className={styles.navContainer}>
              <ul className={styles.navList}>
                <li>
                  <button
                    onClick={() => navigateTo('/admin')}
                    className={styles.navButton}
                  >
                    <FiHome className={styles.navIcon} />
                    <span className={styles.navText}>Overview</span>
                  </button>
                </li>
                {menuItems.map((item) => (
                  <li key={item.path}>
                    <button
                      onClick={() => navigateTo(item.path)}
                      className={`${styles.navButton} ${
                        location.pathname === item.path ? styles.activeNavButton : ''
                      }`}
                    >
                      <span className={styles.navIcon}>{item.icon}</span>
                      <span className={styles.navText}>{item.name}</span>
                      <FiChevronRight className={styles.chevronIcon} />
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
            
            <div className={styles.logoutContainer}>
              <button 
                onClick={logout}
                className={styles.logoutButton}
              >
                <FiLogOut className={styles.logoutIcon} />
                <span className={styles.logoutText}>Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay for mobile */}
      {isSidebarOpen && window.innerWidth < 768 && (
        <div 
          className={styles.overlay}
          onClick={toggleSidebar}
        />
      )}

      {/* Main Content */}
      <main className={styles.mainContent}>
        {renderContent()}
      </main>
    </div>
  );
};

export default WelcomeDashboard;