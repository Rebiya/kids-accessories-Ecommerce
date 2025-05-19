// Services/ai.service.js
const axios = require("axios");

const callTogetherAI = async (userMessage) => {
  const response = await axios.post(
    "https://api.together.xyz/v1/chat/completions",
    {
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1", // Free model
      messages: [{ role: "user", content: userMessage }],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.choices[0].message.content;
};

module.exports = {
  callTogetherAI,
};
