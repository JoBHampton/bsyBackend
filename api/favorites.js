const connectDB = require('../backend/newDatabaseTest');
const FavTable = require('../backend/FavTable');
const corsMiddleware = require('../lib/corsMiddleware');

module.exports = async function handler(req, res) {
  // Handle CORS
  if (corsMiddleware(req, res)) return;


  await connectDB();

  if (req.method === 'GET') {
    try {
      const favorites = await FavTable.find();
      return res.status(200).json(favorites);
    } catch (err) {
      console.error("Error fetching favorites:", err);
      return res.status(500).json({ error: "Server error" });
    }
  }

  if (req.method === 'POST') {
    try {
      const { user_id, recipe_id } = req.body;
      if (!user_id || !recipe_id)
        return res.status(400).json({ error: "Missing user_id or recipe_id" });

      const existing = await FavTable.findOne({ user_id, recipe_id });
      if (existing) return res.status(409).json({ message: "Already favorited" });

      const newFav = new FavTable({ user_id, recipe_id });
      await newFav.save();
      return res.status(201).json(newFav);
    } catch (err) {
      console.error("Error adding favorite:", err);
      return res.status(500).json({ error: "Server error" });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { user_id, recipe_id } = req.body;
      const deleted = await FavTable.findOneAndDelete({ user_id, recipe_id });
      if (!deleted) return res.status(404).json({ message: "Favorite not found" });
      return res.status(200).json({ message: "Favorite removed" });
    } catch (err) {
      console.error("Error deleting favorite:", err);
      return res.status(500).json({ error: "Server error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
};
