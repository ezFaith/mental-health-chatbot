require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Google Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    // Use the correct model name "gemini-pro"
    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-pro" }); 
// Or use "models/gemini-1.5-flash" if you need a faster response time


    const result = await model.generateContent([message]);
    const response = result.response.text(); // Get the response text

    res.json({ reply: response });
  } catch (error) {
    console.error("Error with Gemini API:", error);
    res.status(500).json({ reply: "Sorry, something went wrong! 😞" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
