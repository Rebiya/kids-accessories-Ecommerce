import React from "react";
import styles from "./Category.module.css";
import { Link } from "react-router-dom";

const CategoryCard = ({ Data, isThird }) => {
  return (
    <div className={styles.CategoryCard}>
      <Link to={`/Category/${Data.category}`} className={styles.cardLink}>
        <h2 className={styles.cardTitle}>{Data.title}</h2>
        <div className={styles.imageContainer}>
          <img src={Data.image} alt={Data.title} className={styles.cardImage} />
        </div>
        <p className={styles.shopNowText}>shop now</p>
      </Link>
    </div>
  );
};

export default CategoryCard;