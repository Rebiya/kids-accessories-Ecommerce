import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import styles from "./Product.module.css";
import { ProductService } from "../../Services/Product.Service"; // Adjust the path as needed

const Product = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await ProductService.getAllProducts();
      setProducts(data);
    };

    fetchProducts();
  }, []);

  return (
    <div className={styles.Product_container}>
      {products.map((singleProduct) => (
        <ProductCard
          key={singleProduct.ID} // Use ID from the new Product interface
          product={singleProduct}
          renderAdd={true}
        />
      ))}
    </div>
  );
};

export default Product;
