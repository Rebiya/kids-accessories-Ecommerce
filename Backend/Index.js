const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config();
const query = require("./Config/db.config");
const expressSanitizer = require("express-sanitizer");

const corsOptions = {
  origin: "*",
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(expressSanitizer());

// Serve static files from frontend build
app.use(express.static(path.join(__dirname, "Frontend/dist")));

// Your API routes
const router = require("./Routes/index.routes");
app.use("/api", router);

// For all other routes, return frontend's index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "Frontend/dist", "index.html"));
});

const port = process.env.PORT || 3000;

app.listen(port, "0.0.0.0", (err) => {
  if (err) console.log(err);
  console.log(`successfully listened on port ${port}`);
});

module.exports = app;
