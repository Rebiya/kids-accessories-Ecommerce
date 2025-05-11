import React, { useState } from "react";
import classes from "./Payment.module.css";
import Layout from "../../Components/Layout/Layout";
import { useAuth } from "../../Components/DataProvider/DataProvider";
import ProductCard from "../../Components/Product/ProductCard";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import CurrencyFormat from "../../Components/Product/Currency";
import { axiosInstance } from "../../API/Axios";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { type } from "../../Utility/action.type";
import { db } from "../../Utility/firebase";

function Payment() {
  const { state: { user, basket }, dispatch } = useAuth();
  const [cardError, setCardError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const totalItem = basket?.reduce((amount, item) => {
    return item.amount + amount;
  }, 0);
  
  const total = basket.reduce((amount, item) => {
    return item.price * item.amount + amount;
  }, 0);

  const handleChange = (e) => {
    e?.error?.message ? setCardError(e?.error?.message) : setCardError("");
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      setProcessing(true);
      const response = await axiosInstance({
        method: "POST",
        url: `/payment/create?total=${total * 100}`
      });
      
      const clientSecret = response.data?.clientSecret;
      const { paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)
        }
      });

      await db
        .collection("users")
        .doc(user.uid)
        .collection("orders")
        .doc(paymentIntent.id)
        .set({
          basket: basket,
          amount: paymentIntent.amount,
          created: paymentIntent.created
        });

      dispatch({ type: type.EMPTY_BASKET });
      setProcessing(false);
      navigate("/orders", { state: { msg: "you have placed new order" } });
    } catch (error) {
      console.log(error);
      setProcessing(false);
    }
  };

  return (
    <Layout>
      <div>
        <div className={classes.payment_header}>
          Checkout ({totalItem}) items
        </div>

        <section className={classes.payment}>
          <div className={classes.flex}>
            <h3>Delivery Address</h3>
            <div className={classes.deliver}>
              <div>{user?.email}</div>
              <div>Ethiopia</div>
              <div>Addis Ababa, Legihar</div>
            </div>
          </div>
          <hr />

          <div className={classes.flex}>
            <h3>Review items and delivery</h3>
            <div>
              {basket?.map((item, i) => (
                <ProductCard key={i} product={item} flex={true} />
              ))}
            </div>
          </div>
          <hr />

          <div className={classes.flex}>
            <h3>Payment Method</h3>
            <div className={classes.payment_card_container}>
              <div className={classes.payment_details}>
                <form onSubmit={handlePayment}>
                  {cardError && (
                    <small style={{ color: "red" }}>{cardError}</small>
                  )}
                  <CardElement onChange={handleChange} />
                  <div className={classes.payment_price}>
                    <div>
                      <span style={{ display: "flex", gap: "12px" }}>
                        <p>Total Order |</p> <CurrencyFormat amount={total} />
                      </span>
                    </div>
                    <button type="submit">
                      {processing ? (
                        <div className={classes.loading}>
                          <ClipLoader color="gray" size={12} />
                          <p>Please wait ...</p>
                        </div>
                      ) : (
                        "Pay Now"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}

export default Payment;