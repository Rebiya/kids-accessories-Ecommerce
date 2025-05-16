const orderService = require("../Services/Order.service");

// In your Order.controller.js
exports.createOrder = async (req, res) => {
  try {
    console.log('Incoming order data:', req.body); // Log incoming data
    const result = await orderService.createOrder(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.error('Controller Error:', {
      message: error.message,
      stack: error.stack,
      input: req.body
    });
    res.status(500).json({ 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOrdersByUserId = async (req, res) => {
  try {
    const orders = await orderService.getOrdersByUserId(req.params.id);
    if (!orders) return res.status(404).json({ error: "Orders not found" });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId, newStatus } = req.body;
    const updatedOrder = await orderService.updateOrderStatus(orderId, newStatus);
    if (!updatedOrder) return res.status(404).json({ error: "Order not found" });
    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



