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

const app = express();

app.use(cors(corsOptions)); 
app.use(express.json());
app.use(expressSanitizer());

const router = require("./Routes/index.routes");
app.use("/api", router);

const port = process.env.PORT || 3000;

app.listen(port, '0.0.0.0',(err) => {
  if (err) console.log(err);
  console.log(`successfully listened on port ${port}`);
});

module.exports = app;
