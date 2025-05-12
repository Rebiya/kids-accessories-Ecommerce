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

function Payment() {
  const { state: { user, basket }, dispatch } = useAuth();
  // console.log(user)
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

    // 1. Create payment intent
    const response = await axiosInstance.post(`/payment/create?total=${total * 100}`);
    const clientSecret = response?.data?.clientSecret;
    if (!clientSecret) throw new Error("No client secret returned");

    // 2. Confirm card payment
    const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)
      }
    });

    if (error) {
      setCardError(error.message);
      setProcessing(false);
      return;
    }

    if (paymentIntent.status !== 'succeeded') {
      throw new Error(`Payment not completed. Status: ${paymentIntent.status}`);
    }

    // ✅ 3. Format basket correctly for the backend
    const formattedBasket = basket.map(item => ({
      product_id: item.id,      // or item.product_id depending on your structure
      quantity: item.amount     // 'amount' in frontend means 'quantity'
    }));

    // 4. Create order
    const orderResponse = await axiosInstance.post("/order", {
      user_id: user?.ID,
      basket: JSON.stringify(formattedBasket),  // backend expects a string
      amount: paymentIntent.amount / 100,       // Convert back from cents
      created: paymentIntent.created,
      stripe_payment_id: paymentIntent.id
    });
  
    console.log("Order Response:", orderResponse.data);
    if (orderResponse?.data?.id) {
    dispatch({ type: type.EMPTY_BASKET });
    navigate("/orders", { state: { msg: "You have placed a new order" } });
} else {
  throw new Error("Failed to create order");
}

  } catch (error) {
    console.error("Payment Error:", error);
    setCardError(error.response?.data?.message || error.message);
  } finally {
    setProcessing(false);
  }
};


  return (
    <Layout>
      <div className={classes.payment_container}>
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
              <div>{user?.phone_number}</div>
            </div>
          </div>
          <hr className={classes.divider} />

          <div className={classes.flex}>
            <h3>Review items and delivery</h3>
            <div className={classes.items_container}>
              {basket?.map((item, i) => (
                <ProductCard key={i} product={item} flex={true} />
              ))}
            </div>
          </div>
          <hr className={classes.divider} />

          <div className={classes.flex}>
            <h3>Payment Method</h3>
            <div className={classes.payment_card_container}>
              <div className={classes.payment_details}>
                <form onSubmit={handlePayment}>
                  {cardError && (
                    <small className={classes.error}>{cardError}</small>
                  )}
                  <CardElement className={classes.card_element} onChange={handleChange} />
                  <div className={classes.payment_price}>
                    <div className={classes.total_container}>
                      <span>
                        <p>Total Order |</p> 
                        <CurrencyFormat amount={total} />
                      </span>
                    </div>
                    <button type="submit" disabled={processing}>
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