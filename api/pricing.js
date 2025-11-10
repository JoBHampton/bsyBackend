import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://garussell1.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { searchQueries } = req.body;

  if (!searchQueries || !Array.isArray(searchQueries)) {
    return res.status(400).json({ error: "searchQueries must be an array." });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    // We send all queries in one go for efficiency
    const prompt = "Provide a price estimate for each of the following items, returning only a JSON array of strings with the prices. For example: [\"$2.99\", \"$5.49\", \"$1.25\"]. Items: " + searchQueries.join(", ");

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // The AI should return a JSON string like '["$2.99", "$5.49"]'
    // We parse it into a real array before sending it to the frontend
    const prices = JSON.parse(text);
    console.log("Fetched prices from AI:", prices); // DEBUG

    return res.status(200).json({ prices });

  } catch (error) {
    console.error("Error calling Google AI:", error);
    return res.status(500).json({ error: "Failed to fetch prices from AI." });
  }
}