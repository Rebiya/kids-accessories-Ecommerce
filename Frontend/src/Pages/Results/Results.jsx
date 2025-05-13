import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Layout from "../../Components/Layout/Layout";
import ProductCard from "../../Components/Product/ProductCard";
import Loader from "../../Components/Loader/Loader";
import styles from "./Results.module.css";

import { ProductService } from "../../Services/Product.Service";

const Results = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProducts = async (categoryName) => {
    setIsLoading(true);
   const result = await ProductService.getProductsByCategory(categoryName);

    setProducts(result);
    setIsLoading(false);
  };

  useEffect(() => {
    if (category) fetchProducts(category);
  }, [category]);

  return (
    <Layout>
      <div>
        <p style={{fontSize:"1.5rem",marginBottom:"-5%",textAlign:"center"}}>Category: <strong>{category}</strong></p>
        <div className={styles.Product_container}>
          {isLoading ? (
            <Loader />
          ) : (
            products.map((product) => (
              <ProductCard key={product.id} product={product} renderAdd={true} />
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Results;
