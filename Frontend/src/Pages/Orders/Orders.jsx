import React, { useEffect, useState } from "react";
import classes from "./Order.module.css";
import Layout from "../../Components/Layout/Layout";
import { useAuth } from "../../Components/DataProvider/DataProvider";
import ProductCard from "../../Components/Product/ProductCard";
import { getOrdersByUserId } from "../../Services/Order.service";
import Currency from "../../Components/Product/Currency";

function Orders() {
  const { state: { user } } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.ID) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userOrders = await getOrdersByUserId(user.ID);
        console.log("Fetched orders:", userOrders);
        
        // Transform the data if needed to match frontend expectations
        const formattedOrders = userOrders.map(order => ({
          ...order,
          // Convert created timestamp if needed
          created: order.created || Math.floor(Date.now() / 1000),
          // Ensure basket is properly formatted
          basket: Array.isArray(order.basket) ? order.basket : []
        }));

        setOrders(formattedOrders);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?.ID]);

  if (loading) return <div className={classes.loading}>Loading your orders...</div>;
  if (error) return <div className={classes.error}>Error: {error}</div>;

  return (
    <Layout>
      <section className={classes.container}>
        <div className={classes.orders_container}>
          <h1>Your Orders</h1>
          
          {orders.length === 0 ? (
            <div className={classes.empty_orders}>You don't have any orders yet.</div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className={classes.order_card}>
                <div className={classes.order_header}>
                  <div className={classes.order_meta}>
                    <span>Order #: {order.id}</span>
                    <span>Date: {new Date(order.created * 1000).toLocaleString()}</span>
                  </div>
                  <div className={classes.order_total}>
                    Total: <Currency amount={order.total_amount || order.amount} />
                  </div>
                </div>
                
                <div className={classes.products_container}>
                  {order.basket.map((product) => (
                    <ProductCard 
                      key={`${order.id}-${product.id}`}
                      product={{
                        ...product,
                        // Ensure all required product props are available
                        ID: product.id || product.ID,
                        amount: product.quantity || 1
                      }}
                      flex={true}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </Layout>
  );
}

export default Orders;