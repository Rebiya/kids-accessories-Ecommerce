const express = require("express");
const router = express.Router();

// ✅ Add this line to initialize Stripe
const stripe = require("stripe")(process.env.STRIPE_KEY);

router.post("/payment/create", async (req, res) => {
  const total = req.query.total;

  if (total > 0) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: total,
        currency: "usd"
      });

      res.status(201).json({
        clientSecret: paymentIntent.client_secret 
      });

      console.log(paymentIntent);
    } catch (error) {
      console.error("Stripe error:", error.message);
      res.status(500).json({ message: "Payment intent creation failed" });
    }
  } else {
    res.status(400).json({ message: "Total must be greater than 0" });
  }
});

module.exports = router;
