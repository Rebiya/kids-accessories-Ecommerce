import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { ProductService } from '../../Services/Product.Service';
import styles from './Category.module.css';  // Import styles as module

const CategorySlider = () => {
  const [categories, setCategories] = useState([
    "Baby Essentials",
    "Health & Hygiene",
    "Toys & Education",
    "Clothing",
    "Nursery & Home",
    "Feeding & Nursing",
    "Mom's Support",
    "Travel & Outdoor"
  ]);
  const [categoryProducts, setCategoryProducts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      const productsByCategory = {};
      
      for (const category of categories) {
        try {
          const products = await ProductService.getProductsByCategory(category);
          productsByCategory[category] = products;
        } catch (error) {
          console.error(`Error fetching products for ${category}:`, error);
          productsByCategory[category] = [];
        }
      }
      
      setCategoryProducts(productsByCategory);
      setLoading(false);
    };

    fetchCategoryProducts();
  }, [categories]);

  const scrollSlider = (direction, category) => {
    const slider = document.getElementById(`slider-${category.replace(/\s+/g, '-')}`);
    if (slider) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className={styles['loading-container']}>
        <div className={styles['gold-spinner']}></div>
      </div>
    );
  }

  return (
    <div className={styles['categories-page']}>
      <div className={styles['page-header']}>
        <h1>Our Categories</h1>
        <p>Explore our premium collection for mothers and children</p>
      </div>

      <div className={styles['categories-container']}>
        {categories.map((category) => (
          <div key={category} className={styles['category-section']}>
            <div className={styles['category-header']}>
              <h2 className={styles['category-title']}>{category}</h2>
              <Link 
                to={`/category/${category}`} 
                className={styles['view-all-link']}
              >
                View All
              </Link>
            </div>

            {categoryProducts[category]?.length > 0 ? (
              <div className={styles['products-slider-container']}>
                <button 
                  className={`${styles['slider-nav']} ${styles.left}`}
                  onClick={() => scrollSlider('left', category)}
                >
                  <FiChevronLeft />
                </button>
                
                <div 
                  id={`slider-${category.replace(/\s+/g, '-')}`}
                  className={styles['products-slider']}
                >
                  {categoryProducts[category].map((product) => (
                    <Link 
                      to={`/product/${product.id}`} 
                      key={product.id} 
                      className={styles['product-card']}
                    >
                      <div className={styles['product-image-container']}>
                        <img 
                          src={product.image} 
                          alt={product.title} 
                          className={styles['product-image']}
                        />
                        <div className={styles['gold-overlay']}></div>
                      </div>
                      <div className={styles['product-info']}>
                        <h3 className={styles['product-title']}>{product.title}</h3>
                        <p className={styles['product-price']}>${product.price.toFixed(2)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
                
                <button 
                  className={`${styles['slider-nav']} ${styles.right}`}
                  onClick={() => scrollSlider('right', category)}
                >
                  <FiChevronRight />
                </button>
              </div>
            ) : (
              <div className={styles['no-products']}>
                <p>No products available in this category</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySlider;
