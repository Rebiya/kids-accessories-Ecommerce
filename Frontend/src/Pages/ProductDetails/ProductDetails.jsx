import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../Components/Layout/Layout";
import styles from "./ProductDetails.module.css";
import ProductCard from "../../Components/Product/ProductCard";
import Loader from "../../Components/Loader/Loader";
import { ProductService } from "../../Services/Product.Service"; // Import the ProductService object

const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const productData = await ProductService.getProductById(id); // Use the service method
        setProduct(productData);
      } catch (error) {
        console.error("Error loading product:", error);
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return (
    <Layout>
      <div className={styles.Detail}>
        <h1 style={{ padding: "10px",fontSize:"1.5rem" ,textAlign:"center",fontWeight:"bold"}}>Product Details</h1>
        <hr />
        <hr />
        <div className={styles.Product_container}>
          {isLoading ? (
            <Loader />
          ) : product ? (
            <ProductCard
              product={product}
              flex={true}
              renderDesc={true}
              renderAdd={true}
            />
          ) : (
            <div className={styles.notFound}>
              <h3>Product not found</h3>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;