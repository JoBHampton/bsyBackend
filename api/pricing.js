import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const corsMiddleware = require('../lib/corsMiddleware');

export default async function handler(req, res) {
  
  if (corsMiddleware(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { items } = req.body; // Changed from searchQueries to items

  if (!items || !Array.isArray(items)) {
    return res.status(400).json({ error: "items must be an array of objects with name, quantity, and unit." });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    // Format items with quantities for the AI
    const itemDescriptions = items.map(item => 
      `${item.quantity} ${item.unit || ''} ${item.name}`.trim()
    );
    
    const prompt = `Provide a price estimate for each of the following grocery items, returning only a JSON array of strings with the prices. For example: ["$2.99", "$5.49", "$1.25"]. Items: ${itemDescriptions.join(", ")}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const prices = JSON.parse(text);
    console.log("Fetched prices from AI:", prices);

    return res.status(200).json({ prices });

  } catch (error) {
    if (error.status === 503) {
      return res.status(503).json({ 
        error: "AI service is temporarily unavailable. Please try again in a moment.",
        retryable: true
      });
    }

    console.error("Error calling Google AI:", error);
    return res.status(500).json({ error: "Failed to fetch prices from AI." });
  }
}