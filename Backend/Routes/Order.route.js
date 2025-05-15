const express = require("express");
const router = express.Router();
const orderController = require("../Controllers/Order.controller");

router.post("/order", orderController.createOrder);
router.get("/order", orderController.getOrders);
router.get("/order/:id", orderController.getOrderById);
router.get("/order/user/:id", orderController.getOrdersByUserId);
router.put("/order/:id/status", orderController.updateOrderStatus);
module.exports = router;
