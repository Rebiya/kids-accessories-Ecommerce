const express = require("express");
const router = express.Router();
const orderController = require("../Controllers/Order.controller");

router.post("/order", orderController.createOrder);
router.get("/order", orderController.getOrders);
router.get("/order/:id", orderController.getOrderById);

module.exports = router;
