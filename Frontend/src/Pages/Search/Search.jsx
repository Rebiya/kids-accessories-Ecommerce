// Search.js
import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FiSearch, FiX, FiArrowLeft } from 'react-icons/fi';
import styles from './Search.module.css';
import Fuse from 'fuse.js';
import { ProductService } from '../../Services/Product.Service';

const Search = () => {
  const { state } = useLocation();
  const [searchQuery, setSearchQuery] = useState(state?.query || '');
  const [results, setResults] = useState(state?.results || []);
  const [isLoading, setIsLoading] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [fuse, setFuse] = useState(null);

  // Load products and initialize search
  useEffect(() => {
    const initializeSearch = async () => {
      setIsLoading(true);
      const products = await ProductService.getAllProducts();
      setAllProducts(products);
      
      const options = {
        keys: [
          'title',
          'description',
          'category',
          'price'
        ],
        includeScore: true,
        threshold: 0.4,
        minMatchCharLength: 2
      };
      
      setFuse(new Fuse(products, options));
      setIsLoading(false);
    };

    if (!state?.results) {
      initializeSearch();
    }
  }, [state]);

  useEffect(() => {
    if (searchQuery && fuse) {
      setIsLoading(true);
      const searchResults = fuse.search(searchQuery);
      setResults(searchResults.map(result => result.item));
      setIsLoading(false);
    } else if (!searchQuery) {
      setResults([]);
    }
  }, [searchQuery, fuse]);

  const handleClearSearch = () => {
    setSearchQuery('');
    setResults([]);
  };

  return (
    <div className={styles["search-page"]}>
      <div className={styles["search-header"]}>
        <Link to="/" className={styles["back-button"]}>
          <FiArrowLeft className={styles["icon"]} />
        </Link>
        <div className={styles["search-input-container"]}>
          <FiSearch className={styles["search-icon"]} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for products..."
            className={styles["search-input"]}
          />
          {searchQuery && (
            <button onClick={handleClearSearch} className={styles["clear-button"]}>
              <FiX className={styles["icon"]} />
            </button>
          )}
        </div>
      </div>

      <div className={styles["search-content"]}>
        {isLoading ? (
          <div className={styles["loading-indicator"]}>
            <div className={styles["gold-spinner"]}></div>
          </div>
        ) : results.length > 0 ? (
          <>
            <h2 className={styles["results-title"]}>
              {results.length} results for "{searchQuery}"
            </h2>
            <div className={styles["results-grid"]}>
              {results.map((product) => (
                <Link
                  to={`/product/${product.id}`}
                  key={product.id}
                  className={styles["product-card"]}
                >
                  <div className={styles["product-image-container"]}>
                    <img
                      src={product.image}
                      alt={product.title}
                      className={styles["product-image"]}
                    />
                    <div className={styles["gold-overlay"]}></div>
                  </div>
                  <div className={styles["product-info"]}>
                    <h3 className={styles["product-title"]}>{product.title}</h3>
                    <p className={styles["product-category"]}>{product.category}</p>
                    <p className={styles["product-price"]}>
  ${Number(product.price).toFixed(2)}
</p>
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : searchQuery ? (
          <div className={styles["no-results"]}>
            <FiSearch className={styles["no-results-icon"]} />
            <h3>No results found for "{searchQuery}"</h3>
            <p>Try different keywords or check your spelling</p>
            <Link to="/categories" className={styles["browse-button"]}>
              Browse Categories
            </Link>
          </div>
        ) : (
         <div className={styles.searchTips}>
  <h3>Search Tips</h3>
  <ul>
    <li>Try different keywords</li>
    <li>Check your spelling</li>
    <li>Use more general terms</li>
    <li>Browse our categories below</li>
  </ul>
  <Link to="/categories" className={styles.browseButton}>
    Browse All Categories
  </Link>
</div>
        )}
      </div>
    </div>
  );
};

export default Search;