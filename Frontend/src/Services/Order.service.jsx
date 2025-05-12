import { axiosInstance } from "../API/Axios"; // ✅ FIXED

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

export const getOrdersByUserId = async (userId) => {
  const response = await axiosInstance.get(`/order/user/${userId}`);
  return response.data;
};

export const getAllOrders = async () => {
  const response = await axiosInstance.get("/order");
  return response.data;
};
