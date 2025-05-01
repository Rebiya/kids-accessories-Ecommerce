import React from 'react';
import './Footer.css'; // Import your CSS file
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__backToTop" onClick={() => window.scrollTo(0, 0)}>
        Back to top
      </div>
      
      <div className="footer__main">
        <div className="footer__section">
          <h3>Get to Know Us</h3>
          <ul>
            <li>Careers</li>
            <li>Blog</li>
            <li>About kids accessories </li>
            <li>Investor Relations</li>
            <li>kids accessories  Devices</li>
          </ul>
        </div>
        
        <div className="footer__section">
          <h3>Make Money with Us</h3>
          <ul>
            <li>Sell products on kids accessories </li>
            <li>Sell on kids accessories  Business</li>
            <li>Sell apps on kids accessories </li>
            <li>Become an Affiliate</li>
            <li>Advertise Your Products</li>
          </ul>
        </div>
        
        <div className="footer__section">
          <h3>kids accessories  Payment Products</h3>
          <ul>
            <li>kids accessories  Business Card</li>
            <li>Shop with Points</li>
            <li>Reload Your Balance</li>
            <li>kids accessories  Currency Converter</li>
          </ul>
        </div>
        
        <div className="footer__section">
          <h3>Let Us Help You</h3>
          <ul>
            <li>kids accessories  and COVID-19</li>
            <li>Your Account</li>
            <li>Your Orders</li>
            <li>Shipping Rates & Policies</li>
            <li>Returns & Replacements</li>
            <li>Help</li>
          </ul>
        </div>
      </div>
      
      <div className="footer__bottom">
        <div className="footer__logo">
          <span>kids accessories</span>
        </div>
        <div className="footer__copyright">
          &copy; {new Date().getFullYear()} kids accessories. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;