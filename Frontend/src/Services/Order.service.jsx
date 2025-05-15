import { axiosInstance } from "../API/Axios";

export const createOrder = async ({ userId, basket, paymentIntentId }) => {
  try {
    // Validate and format data before sending
    const orderData = {
      user_id: userId,
      basket: Array.isArray(basket) ? basket : JSON.parse(basket), // Handle both cases
      created: Math.floor(Date.now() / 1000),
      stripe_payment_id: paymentIntentId
    };

    console.log('Sending order data:', orderData);
    
    const response = await axiosInstance.post("/order", orderData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Order creation failed:', {
      error: error.response?.data || error.message,
      requestData: { userId, basket, paymentIntentId }
    });
    throw error;
  }
};

export const getOrdersByUserId = async (userId) => {
  const response = await axiosInstance.get(`/order/user/${userId}`);
  return response.data;
};

export const getAllOrders = async () => {
  const response = await axiosInstance.get("/order");
  return response.data;
};