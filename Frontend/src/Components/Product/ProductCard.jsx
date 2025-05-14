import React from "react";
import styles from "./Product.module.css";
import Rating from "@mui/material/Rating";
import { Link } from "react-router-dom";
import Currency from "./Currency";
import { useAuth } from "../DataProvider/DataProvider";
import { type } from "../../Utility/action.type";

const ProductCard = ({ product, flex, renderDesc, renderAdd }) => {
  const { title, image, rating_count,rating_rate, price, category, ID, description } = product;
  const { dispatch } = useAuth();

  const addToCart = () => {
    dispatch({
      type: type.ADD_TO_BASKET,
      item: {
  id: ID, // important for reducer logic
  image,
  title,
  price, // ✅ include price
  rating_rate,
  rating_count,
  description
}

    });
  };

  return (
    <div
      className={`${styles.card_container} ${
        flex ? styles.product_flexed : ""
      }`}
    >
      <div>
        <Link to={`/products/${ID}`}>
          <img src={image} alt={category} />
        </Link>
      </div>
      <div>
        {renderDesc && <div style={{ maxWidth: "750px" }}>{description}</div>}
        <h3>{title}</h3>
        <div className={styles.rating}>
          <Rating value={rating_rate || 0} precision={0.1} />
          <small>{rating_count || 0} </small>
        </div>
        <div>
          <Currency amount={price} />
        </div>
        {renderAdd && (
          <button className={styles.button} onClick={addToCart}>
            Add To Cart
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;