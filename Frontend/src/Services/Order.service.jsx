// services/order.service.js
import axiosInstance from "../API/Axios"; // make sure axiosInstance is properly configured

export const createOrder = async ({ userId, basket, amount, created, paymentIntentId }) => {
  const response = await axiosInstance.post("/order", {
    user_id: userId,
    basket: JSON.stringify(basket),
    amount,
    created,
    stripe_payment_id: paymentIntentId,
  });
  return response.data;
};

export const getOrderById = async (orderId) => {
  const response = await axiosInstance.get(`/order/${orderId}`);
  return response.data;
};

export const getAllOrders = async () => {
  const response = await axiosInstance.get("/order");
  return response.data;
};
