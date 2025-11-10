const connectDB = require('../backend/newDatabaseTest');
const Item = require('../backend/newSchema');

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://garussell1.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  await connectDB();

  // GET — list items
  if (req.method === 'GET') {
    try {
      const items = await Item.find();
      return res.status(200).json(items);
    } catch (err) {
      return res.status(500).json({ error: "Error fetching items" });
    }
  }

  // POST — add new item
  if (req.method === 'POST') {
    console.log("WHAT THE PUSH")
    try {
      const newItem = new Item(req.body);
      await newItem.save();
      return res.status(201).json(newItem);
    } catch (err) {
      console.error("Error adding item:", err);
      return res.status(500).json({ error: "Error adding item" });
    }
  }
  if(req.method === 'PUT'){
    console.log("WHAT THE PUT")
  }

  // DELETE — remove an item
  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      await Item.findByIdAndDelete(id);
      return res.status(200).json({ message: "Item deleted successfully" });
    } catch (err) {
      console.error("Error deleting item:", err);
      return res.status(500).json({ error: "Error deleting item" });
    }
  }

  // Anything else
  return res.status(405).json({ error: "Method not allowed" });
};
