const express = require("express");
const router = express.Router();
const loginRouter = require("./Auth/login.route.js");
const signupRouter = require("./Auth/signup.route.js");
const logoutRouter = require("./Auth/logout.route.js");
const ForgotPassRouter = require("./Auth/ForgotPass.route.js");
const userRouter = require("./user.route.js");
const productRouter = require("./Product.route.js");
const categoryRouter = require("./Category.route.js");
const orderRouter = require("./Order.route.js"); 
const stripeRouter = require("./Stripe.route.js");
const aiRouter = require("./ai.routes.js");

// Use the imported routers with correct paths
router.use(ForgotPassRouter);
router.use(logoutRouter);
router.use(signupRouter);
router.use(loginRouter);
router.use(userRouter);
router.use(productRouter);
router.use(categoryRouter);
router.use(orderRouter);
router.use(stripeRouter);
router.use(aiRouter);

module.exports = router;
