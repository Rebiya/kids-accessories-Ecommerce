const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const query = require("./Config/db.config")

const expressSanitizer = require("express-sanitizer"); 


const corsOptions = {
  origin: "*", // Allow all origins
  credentials: true, // Allows cookies and auth headers
  preflightContinue: false, 
  optionsSuccessStatus: 204, // Return 204 for preflight requests
};


// Initialize Stripe with the secret key from environment variables
const stripe = require("stripe")(process.env.STRIPE_KEY);

const app = express();

app.use(cors(corsOptions)); 
app.use(express.json());
app.use(expressSanitizer());

const router = require("./Routes/index.routes");
app.use("/api", router);

const port = process.env.PORT || 3000;



// Define a POST endpoint to create a payment intent using Stripe
app.post("/payment/create", async (req, res) => {
  const total = req.query.total; // Get the total amount from the query parameters
  if (total > 0) {
    // Create a payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: "usd"
    });
    // Respond with the payment intent
   res.status(201).json({
     clientSecret: paymentIntent.client_secret 
   });

    console.log(paymentIntent);
  } else {
    // Respond with an error if the total is not greater than 0
    res.status(400).json({ message: "total must be greater than 0" });
  }
});

app.listen(port, (err) => {
  if (err) console.log(err);
  console.log(`successfully listened on port ${port}`);
});

module.exports = app;