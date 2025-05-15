import React from 'react';
import { Link } from 'react-router-dom'; // ✅ Import Link
import './Unauthorized.css';

const Unauthorized = () => {
  return (
    <div className="unauthorized-container">
      <div className="golden-header">
        <h1>Access Restricted</h1>
        <div className="golden-divider"></div>
      </div>

      <div className="content-wrapper">
        <Link to="/">
          <div className="golden-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 15l-3-3m0 0l3-3m-3 3h6m-6 4v1a3 3 0 003 3h6a3 3 0 003-3v-1m-9-9V5a3 3 0 013-3h6a3 3 0 013 3v1" />
            </svg>
          </div>
        </Link>

        <h2>Kids' Accessories Section</h2>
        <p>This area is restricted to authorized personnel only.</p>

        <Link to="/">
          <button className="golden-button">Return to Safety</button>
        </Link>
      </div>

      <div className="golden-footer">
        <p>© {new Date().getFullYear()} Kids' Accessories Collection</p>
      </div>
    </div>
  );
};

export default Unauthorized;
