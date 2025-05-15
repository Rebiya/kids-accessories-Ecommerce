// Header.js
import React, { useState, useEffect } from "react";
import { IoSearch, IoChevronDown } from "react-icons/io5";
import { BsCart, BsHeart, BsPerson } from "react-icons/bs";
import { SlLocationPin } from "react-icons/sl";
import { FaChild, FaBaby, FaShieldAlt, FaHome, FaUtensils, FaSuitcase } from "react-icons/fa";
import { MdHealthAndSafety, MdSupport } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import { Form } from "react-bootstrap";
import { useAuth } from "../DataProvider/DataProvider";
import { auth } from "../../Utility/firebase";
import logo from "../../assets/images/download_mask.png";
import { ProductService } from "../../Services/Product.Service";
import Fuse from 'fuse.js';

const Header = () => {
  const { state: { basket, user }, dispatch } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  // Initialize Fuse.js for fuzzy search
  const [fuse, setFuse] = useState(null);

  // Load products and categories on mount
  useEffect(() => {
    const loadData = async () => {
      const products = await ProductService.getAllProducts();
      setAllProducts(products);
      
      // Configure Fuse.js options
      const options = {
        keys: [
          'title',
          'description',
          { name: 'category', weight: 2 }, // Give category more weight
          'price'
        ],
        includeScore: true,
        threshold: 0.4, // Adjust for more/less fuzzy matching
        minMatchCharLength: 2
      };
      
      setFuse(new Fuse(products, options));
      
      // Define your categories (could also fetch from API)
      setCategories([
        { id: 1, name: "Baby Essentials", icon: <FaBaby />, path: "/category/Baby Essentials" },
        { id: 2, name: "Health & Hygiene", icon: <MdHealthAndSafety />, path: "/category/Health & Hygiene" },
        { id: 3, name: "Toys & Education", icon: <FaChild />, path: "/category/Toys & Education" },
        { id: 4, name: "Clothing", icon: <BsPerson />, path: "/category/clothing" },
        { id: 5, name: "Nursery & Home", icon: <FaHome />, path: "/category/Nursery & Home" },
        { id: 6, name: "Feeding & Nursing", icon: <FaUtensils />, path: "/category/Feeding & Nursing" },
        { id: 7, name: "Mom's Support", icon: <MdSupport />, path: "/category/Mom's Support" },
        { id: 8, name: "Travel & Outdoor", icon: <FaSuitcase />, path: "/category/Travel & Outdoor" }
      ]);
    };
    
    loadData();
  }, []);

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

  const searchProducts = () => {
    if (!searchQuery.trim()) return;
    
    let results = [];
    
    if (fuse) {
      // Use Fuse.js for fuzzy search
      const searchResults = fuse.search(searchQuery);
      results = searchResults.map(result => result.item);
    } else {
      // Fallback to simple search if Fuse isn't initialized
      results = allProducts.filter(product => {
        const searchLower = searchQuery.toLowerCase();
        const titleMatch = product.title.toLowerCase().includes(searchLower);
        const descMatch = product.description.toLowerCase().includes(searchLower);
        const priceMatch = product.price.toString().includes(searchQuery);
        
        return titleMatch || descMatch || priceMatch;
      });
    }
    
    // Navigate to search results page with the filtered products
    navigate('/search', { state: { results, query: searchQuery } });
    setSearchQuery(""); // Clear search input
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') searchProducts();
  };

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
            {categories.map((category) => (
              <Link 
                key={category.id} 
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
      <div className={styles.searchSection}>
        <Form.Control
          type="text"
          placeholder="Search for kids accessories..."
          className={styles.searchInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className={styles.searchButton} onClick={searchProducts}>
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