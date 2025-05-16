import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  FiUsers, FiTag, FiShoppingBag, FiPieChart, FiShoppingCart,
  FiPlus, FiX, FiLogOut
} from 'react-icons/fi';
import './AdminLayout.css';

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
    <div className="admin-layout">
      {/* Sidebar */}
      <div 
        className={`admin-sidebar slide-in ${isSidebarCollapsed ? 'collapsed' : 'expanded'}`}
      >
        <div className="sidebar-header">
          {!isSidebarCollapsed && (
            <h2 className="sidebar-title">Admin Panel</h2>
          )}
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="collapse-button"
          >
            {isSidebarCollapsed ? (
              <FiPlus className="transform rotate-45" />
            ) : (
              <FiX />
            )}
          </button>
        </div>
        
        <nav className="admin-nav">
          <ul className="nav-list">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <li key={tab.id} className="nav-item">
                  <button
                    onClick={() => navigate(tab.path)}
                    className={`nav-button ${isActiveTab(tab.path) ? 'active' : ''}`}
                  >
                    <Icon className="nav-icon" />
                    {!isSidebarCollapsed && <span className="nav-label">{tab.label}</span>}
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
            {!isSidebarCollapsed && <span className="nav-label">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`main-content ${isSidebarCollapsed ? 'collapsed' : 'expanded'}`}>
        <div className="content-container">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;