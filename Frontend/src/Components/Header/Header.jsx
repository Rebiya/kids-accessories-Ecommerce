import React, { useState } from "react";
import { IoSearch, IoChevronDown } from "react-icons/io5";
import { BsCart, BsHeart, BsPerson } from "react-icons/bs";
import { SlLocationPin } from "react-icons/sl";
import { FaChild, FaBaby, FaShieldAlt, FaHome, FaUtensils, FaSuitcase } from "react-icons/fa";
import { MdHealthAndSafety, MdSupport } from "react-icons/md";
import { Link } from "react-router-dom";
import styles from "./Header.module.css";
import { Form } from "react-bootstrap";
import { useAuth } from "../DataProvider/DataProvider";
import { auth } from "../../Utility/firebase";
import logo from "../../assets/images/download_mask.png"; // Update path to your local logo

const Header = () => {
  const { state: { basket, user }, dispatch } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const totalItem = basket?.reduce((amount, item) => {
    return item.amount + amount;
  }, 0);

  const handleLogout = () => {
    auth.signOut().then(() => {
      dispatch({ type: 'LOGOUT' });
    });
  };

  const toggleDropdown = () => setShowDropdown(!showDropdown);
  const toggleCategories = () => setShowCategories(!showCategories);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const res = await axios.get(`/products/search?q=${searchQuery}`);
      if (res.data.success && res.data.data.length > 0) {
        setSearchResults(res.data.data); // Optional for later display
        console.log("Search Results:", res.data.data);
      } else {
        console.info("No matching products found.");
      }
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  }; 
  const categories = [
    { name: "Baby Essentials", icon: <FaBaby />, path: "/baby-essentials" },
    { name: "Health & Hygiene", icon: <MdHealthAndSafety />, path: "/health-hygiene" },
    { name: "Toys & Education", icon: <FaChild />, path: "/toys-education" },
    { name: "Clothing", icon: <BsPerson />, path: "/clothing" },
    { name: "Nursery & Home", icon: <FaHome />, path: "/nursery-home" },
    { name: "Feeding & Nursing", icon: <FaUtensils />, path: "/feeding-nursing" },
    { name: "Mom's Support", icon: <MdSupport />, path: "/mom-support" },
    { name: "Travel & Outdoor", icon: <FaSuitcase />, path: "/travel-outdoor" }
  ];

  return (
    <div className={styles.headerContainer}>
      {/* Logo Section */}
      <div className={styles.logoSection}>
        <Link to="/" className={styles.logoLink}>
          <img
            src={logo}
            alt="Kids Accessories World"
            className={styles.logoImage}
          />
        </Link>
      </div>

      {/* Categories Dropdown */}
      <div className={styles.categoriesDropdown} onClick={toggleCategories}>
        <span>Shop Categories</span>
        <IoChevronDown className={styles.dropdownIcon} />
        {showCategories && (
          <div className={styles.categoriesMenu}>
            {categories.map((category, index) => (
              <Link 
                key={index} 
                to={category.path}
                className={styles.categoryItem}
              >
                <span className={styles.categoryIcon}>{category.icon}</span>
                {category.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Search Section */}
         {/* Search Section */}
      <div className={styles.searchSection}>
        <Form.Control
          type="text"
          placeholder="Search for kids accessories..."
          className={styles.searchInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown} // Allows "Enter" key
        />
        <button className={styles.searchButton} onClick={handleSearch}>
          <IoSearch className={styles.searchIcon} />
        </button>
      </div>

      {/* Navigation Section */}
      <nav className={styles.navSection}>
        {/* <Link to="/deals" className={styles.navLink}>
          <FaChild className={styles.navIcon} />
          <span>Daily Deals</span>
        </Link>
        
        <Link to="/wishlist" className={styles.navLink}>
          <BsHeart className={styles.navIcon} />
          <span>Wishlist</span>
        </Link> */}

        <div className={styles.accountDropdown}>
          <div className={styles.accountTrigger} onClick={toggleDropdown}>
            {user ? (
              <>
                <span className={styles.userInitial}>
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
                <IoChevronDown className={styles.dropdownIcon} />
              </>
            ) : (
              <>
                <BsPerson className={styles.userIcon} />
                <span>Account</span>
                <IoChevronDown className={styles.dropdownIcon} />
              </>
            )}
          </div>
          
          {showDropdown && (
            <div className={styles.dropdownMenu}>
              {user ? (
                <>
                  <Link to="/account" className={styles.dropdownItem}>
                    My Account
                  </Link>
                  <Link to="/orders" className={styles.dropdownItem}>
                    My Orders
                  </Link>
                  <Link to="/support" className={styles.dropdownItem}>
                    Customer Support
                  </Link>
                  <div 
                    className={styles.dropdownItem}
                    onClick={handleLogout}
                  >
                    Sign Out
                  </div>
                </>
              ) : (
                <>
                  <Link to="/auth" className={styles.dropdownItem}>
                    Sign In
                  </Link>
                  <Link to="/register" className={styles.dropdownItem}>
                    Create Account
                  </Link>
                  <Link to="/support" className={styles.dropdownItem}>
                    Customer Support
                  </Link>
                </>
              )}
            </div>
          )}
        </div>

        <Link to="/cart" className={styles.cartLink}>
          <div className={styles.cartContainer}>
            <span className={styles.cartCount}>{totalItem}</span>
            <BsCart className={styles.cartIcon} />
            <span className={styles.cartText}>Cart</span>
          </div>
        </Link>
      </nav>
    </div>
  );
};

export default Header;