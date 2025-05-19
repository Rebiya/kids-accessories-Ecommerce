// Routes/ai.routes.js
const express = require("express");
const { askAI } = require("../Controllers/ai.controller");

const router = express.Router();

router.post("/ask", askAI); // POST /api/ai/ask

module.exports = router;
