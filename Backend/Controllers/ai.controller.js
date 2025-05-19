// Controllers/ai.controller.js
const { callTogetherAI } = require("../Services/ai.service");

const askAI = async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: "Message is required." });
  }

  try {
    const aiResponse = await callTogetherAI(userMessage);
    res.status(200).json({ reply: aiResponse });
  } catch (err) {
    console.error("AI Error:", err.message);
    res.status(500).json({ error: "Failed to fetch response from AI." });
  }
};

module.exports = {
  askAI,
};
