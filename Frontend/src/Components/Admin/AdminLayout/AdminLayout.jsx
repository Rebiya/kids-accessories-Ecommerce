import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  FiUsers, FiTag, FiShoppingBag, FiPieChart, FiShoppingCart,
  FiX, FiLogOut, FiMenu, FiChevronLeft, FiChevronRight
} from 'react-icons/fi';
import './AdminLayout.css';

const AdminLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSidebarToggle = () => {
    if (window.innerWidth < 768) {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  const closeMobileMenu = () => {
    if (window.innerWidth < 768) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <div className="admin-layout">
      {/* Mobile Menu Toggle Button */}
      {window.innerWidth < 768 && (
        <button 
          className="mobile-menu-toggle"
          onClick={handleSidebarToggle}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      )}

      {/* Sidebar */}
      <div 
        className={`admin-sidebar ${isSidebarCollapsed ? 'collapsed' : 'expanded'} ${isMobileMenuOpen ? 'visible' : ''}`}
      >
        <div className="sidebar-header">
          <h2 className="sidebar-title">Admin Panel</h2>
          <button 
            onClick={handleSidebarToggle}
            className="collapse-button"
            aria-label="Collapse sidebar"
          >
            {isSidebarCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
          </button>
        </div>
        
        <nav className="admin-nav">
          <ul className="nav-list">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <li key={tab.id} className="nav-item">
                  <button
                    onClick={() => {
                      navigate(tab.path);
                      closeMobileMenu();
                    }}
                    className={`nav-button ${isActiveTab(tab.path) ? 'active' : ''}`}
                  >
                    <Icon className="nav-icon" />
                    <span className="nav-label">{tab.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        
        <div className="sidebar-footer">
          <button 
            onClick={() => navigate('/')}
            className="logout-button"
          >
            <FiLogOut className="nav-icon" />
            <span className="nav-label">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`main-content ${isSidebarCollapsed ? 'collapsed' : 'expanded'} ${isMobileMenuOpen ? 'shifted' : ''}`}>
        <div className="content-container">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;