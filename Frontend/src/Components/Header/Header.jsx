import React, { useContext } from "react";
import { IoSearch } from "react-icons/io5";
import { BsCart } from "react-icons/bs";
import { SlLocationPin } from "react-icons/sl";
import { Link } from "react-router-dom";
import styles from "./Header.module.css";
import { Form } from "react-bootstrap";
import img from "../../assets/images/10001.jpg";
import { DataContext } from "../DataProvider/DataProvider";
import { auth } from "../../Utility/firebase";

const Header = () => {
  const [{ basket, user }, dispatch] = useContext(DataContext);

  // Calculating the total number of items in the basket by reducing through the basket array.
  const totalItem = basket?.reduce((amount, item) => {
    return item.amount + amount; // Accumulating the total amount of items in the basket.
  }, 0);

  return (
    <div className={styles.Header_Wrapper}>
      {" "}
      {/* // Main wrapper for the header component, using styles from CSS module. */}
      {/* Logo Section */}
      <div className={styles.right_wrapper}>
        {" "}
        {/* // Wrapper for the right side content of the header. */}
        <Link to="/">
          {" "}
          {/* // Link to redirect to the home page when the logo is clicked. */}
          <div className={styles.logo}>
            {" "}
            <img
              src="https://pngimg.com/uploads/amazon/amazon_PNG25.png" // Amazon logo image URL.
              alt="amazon" // Alt text for the logo.
            />
          </div>
        </Link>
        {/* Location Section */}
        <Link to="/payment">
          {" "}
          {/* // Link to the payment page. */}
          <div className={styles.location}>
            {" "}
            {/* // Location section wrapper. */}
            <SlLocationPin />
            <div>
              <p className={styles.deliveredTo}>Delivered to</p>
              <span className={styles.country}>Ethiopia</span>
            </div>
          </div>
        </Link>
      </div>
      {/* Search and Menu Section */}
      <div className={styles.middleWrapper}>
        {" "}
        {/* // Middle section wrapper for the search functionality. */}
        <select name="item" id="" className={styles.AllItem}>
          {" "}
          <option value="">All</option>
        </select>
        <Form>
          {" "}
          {/* // React Bootstrap form component. */}
          <Form.Control
            size="lg"
            type="text"
            placeholder="Search product"
            className={styles.searchInput}
          />
        </Form>
        <div className={styles.IoSearch}>
          {" "}
          <IoSearch className={styles.icon} />
        </div>
      </div>
      {/* Cart Section */}
      <div className={styles.leftWrapper}>
        {" "}
        {/* // Wrapper for the left section of the header. */}
        <Link to="#" className={styles.language}>
          {" "}
          <img className={styles.flag} src={img} alt="flag" />
          <select name="" id="" className={styles.EN}>
            {" "}
            // Dropdown for language (default is "EN").
            <option value="EN">EN</option> // "EN" option in the language
            dropdown.
          </select>
        </Link>
        {/* SignIn/SignOut Section */}
        <Link to={!user ? "/auth" : ""} className="signin">
          {" "}
          {/* // If the user is not logged in, link to /auth page, else it does */}
          nothing.
          {user ? ( // Conditional rendering based on whether the user is logged in.
            <>
              <p style={{ fontSize: "0.75rem" }}>
                {"Hello " + user?.email?.split("@")[0]}
              </p>
              <span onClick={() => auth.signOut()}>sign out</span>
            </>
          ) : (
            <>
              <p>signin</p> // Text for the "signin" option.
              <span>Account & Links</span> // Text for the "Account & Links"
              option.
            </>
          )}
        </Link>
        {/* Orders Link */}
        <Link to="/orders">
          {" "}
          // Link to the orders page.
          <p>sales</p> // Sales text.
          <span>&Orders</span> // Orders text.
        </Link>
        {/* Cart Link */}
        <Link to="/cart">
          {" "}
          // Link to the cart page.
          <div>
            <p className={styles.count}>{basket.length}</p> // Displaying the
            number of items in the basket.
            <BsCart className={styles.cart} /> // Cart icon.
            <span>cart</span> // Text for the cart.
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Header; // Exporting the Header component for use in other parts of the application.
