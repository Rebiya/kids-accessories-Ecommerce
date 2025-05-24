import axios from 'axios';

export async function askAI(message) {
  try {
    const response = await axios.post('https://kids-accessories-ecommerce-3.onrender.com/api/ask', { message });
    // assuming response.data = { reply: "AI answer" }
    return response.data.reply;
  } catch (error) {
    console.error('Error calling AI API:', error);
    return "Sorry, something went wrong. Please try again later.";
  }
}
