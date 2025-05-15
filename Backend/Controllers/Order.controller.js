const orderService = require("../Services/Order.service");

exports.createOrder = async (req, res) => {
  try {
    const newOrder = await orderService.createOrder(req.body);
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
    const { id } = req.params;
    const { status } = req.body;
    
    // Validate the status
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const updatedOrder = await orderService.updateOrderStatus(id, status);
    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



