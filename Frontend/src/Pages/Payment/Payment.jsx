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
  const [cardError, setCardError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [expandedItem, setExpandedItem] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);

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

  const toggleDescription = (item) => {
    setExpandedItem(expandedItem?.id === item.id ? null : item);
  };

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      setProcessing(true);

      const response = await axiosInstance.post(`/payment/create?total=${total * 100}`);
      const clientSecret = response?.data?.clientSecret;
      if (!clientSecret) throw new Error("No client secret returned");

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

      const formattedBasket = basket.map(item => ({
        product_id: item.id,
        quantity: item.amount
      }));

      const orderResponse = await axiosInstance.post("/order", {
        user_id: user?.ID,
        basket: JSON.stringify(formattedBasket),
        amount: paymentIntent.amount / 100,
        created: paymentIntent.created,
        stripe_payment_id: paymentIntent.id
      });
    
      if (orderResponse?.data?.success) {
        dispatch({ type: type.EMPTY_BASKET });
        navigate("/orders", { state: { msg: "You have placed a new order" } });
      } else {
        throw new Error(orderResponse?.data?.message || "Failed to create order");
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
          <h2>Checkout ({totalItem}) items</h2>
        </div>

        <div className={classes.payment_content}>
          <section className={classes.delivery_section}>
            <div className={classes.section_header}>
              <h3>Delivery Address</h3>
            </div>
            <div className={classes.delivery_details}>
              <p>{user?.email}</p>
              <p>Ethiopia</p>
              <p>Addis Ababa, Legihar</p>
              <p>{user?.phone_number}</p>
            </div>
          </section>

          <section className={classes.items_section}>
            <div className={classes.section_header}>
              <h3>Review Items</h3>
            </div>
            <div className={classes.items_list}>
              {basket?.map((item, i) => (
                <div key={i} className={classes.item_card}>
                  <div 
                    className={classes.item_image}
                    onClick={() => {
                      setExpandedItem(item);
                      setShowImageModal(true);
                    }}
                  >
                    <img src={item.image} alt={item.title} />
                  </div>
                  <div className={classes.item_details}>
                    <h4>{item.title}</h4>
                    <p className={classes.price}><CurrencyFormat amount={item.price} /></p>
                    <p className={classes.quantity}>Quantity: {item.amount}</p>
                    {item.description && (
                      <div className={classes.description_container}>
                        <p className={classes.description}>
                          {expandedItem?.id === item.id 
                            ? item.description 
                            : truncateText(item.description, window.innerWidth < 768 ? 200 : 300)
                          }
                        </p>
                        {item.description.length > (window.innerWidth < 768 ? 200 : 300) && (
                          <button 
                            onClick={() => toggleDescription(item)}
                            className={classes.see_more}
                          >
                            {expandedItem?.id === item.id ? 'Show less' : 'Show more'}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className={classes.payment_section}>
            <div className={classes.section_header}>
              <h3>Payment Method</h3>
            </div>
            <div className={classes.payment_card}>
              <form onSubmit={handlePayment}>
                {cardError && (
                  <div className={classes.error_message}>{cardError}</div>
                )}
                <div className={classes.card_element_container}>
                  <CardElement className={classes.card_element} onChange={handleChange} />
                </div>
                <div className={classes.payment_summary}>
                  <div className={classes.order_total}>
                    <span>Order Total:</span>
                    <span className={classes.total_amount}><CurrencyFormat amount={total} /></span>
                  </div>
                  <button 
                    type="submit" 
                    disabled={processing}
                    className={classes.pay_button}
                  >
                    {processing ? (
                      <div className={classes.loading}>
                        <ClipLoader color="#fff" size={16} />
                        <span>Processing Payment</span>
                      </div>
                    ) : (
                      "Pay Now"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </section>
        </div>

        {/* Image Modal */}
        {showImageModal && expandedItem && (
          <div className={classes.image_modal} onClick={() => setShowImageModal(false)}>
            <div className={classes.modal_content} onClick={(e) => e.stopPropagation()}>
              <button 
                className={classes.close_modal}
                onClick={() => setShowImageModal(false)}
              >
                &times;
              </button>
              <img 
                src={expandedItem.image} 
                alt={expandedItem.title} 
                className={classes.modal_image}
              />
              <div className={classes.modal_description}>
                <h3>{expandedItem.title}</h3>
                <p>{expandedItem.description}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Payment;