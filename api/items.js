const connectDB = require('../backend/newDatabaseTest');
const Item = require('../backend/newSchema');
const corsMiddleware = require('../lib/corsMiddleware');

module.exports = async function handler(req, res) {
  // Handle CORS
  if (corsMiddleware(req, res)) return;

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
    console.log("POST request received:", req.body);
    try {
      const newItem = new Item(req.body);
      await newItem.save();
      return res.status(201).json(newItem);
    } catch (err) {
      console.error("Error adding item:", err);
      return res.status(500).json({ error: "Error adding item", details: err.message });
    }
  }

  // PUT — update an item
  if (req.method === 'PUT') {
    console.log("PUT request received");
    try {
      const { id } = req.query;
      const updatedItem = await Item.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedItem) {
        return res.status(404).json({ error: "Item not found" });
      }
      return res.status(200).json(updatedItem);
    } catch (err) {
      console.error("Error updating item:", err);
      return res.status(500).json({ error: "Error updating item", details: err.message });
    }
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