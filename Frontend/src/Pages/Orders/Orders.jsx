import React, { useEffect, useState } from "react";
import classes from "./Order.module.css";
import Layout from "../../Components/Layout/Layout";
import { useAuth } from "../../Components/DataProvider/DataProvider";
import ProductCard from "../../Components/Product/ProductCard";
import { getOrdersByUserId } from "../../Services/Order.service";

function Orders() {
  const { state: { user } } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (user?.ID) {
          const userOrders = await getOrdersByUserId(user.ID);
          setOrders(userOrders);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrders();
  }, [user]);useEffect(() => {
  const fetchOrders = async () => {
    if (!user || !user.ID) return;

    try {
      console.log("Fetching orders for user ID:", user?.ID);
      const userOrders = await getOrdersByUserId(user.ID);
      console.log("Fetched orders:", userOrders);
      setOrders(userOrders);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  fetchOrders();
}, [user?.ID]);


  return (
    <Layout>
      <section className={classes.container}>
        <div className={classes.orders_container}>
          <h1>Your Orders</h1>
          {orders.length === 0 && (
            <div style={{ padding: "30px" }}>You don't have orders yet.</div>
          )}
          <div>
            {orders.map((eachOrder, i) => {
              const parsedBasket = JSON.parse(eachOrder.basket || "[]");
              return (
                <div key={i}>
                  <hr />
                  <p>Order ID: {eachOrder.id}</p>
                  <p>Amount: ${eachOrder.amount}</p>
                  <p>Created: {new Date(eachOrder.created * 1000).toLocaleString()}</p>
                  {parsedBasket.map((order, index) => (
                    <ProductCard flex={true} product={order} key={index} />
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default Orders;
