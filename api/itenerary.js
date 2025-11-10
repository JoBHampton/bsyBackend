const connectDB = require('../backend/newDatabaseTest');
const Itenerary = require('../backend/Itenerary');

module.exports = async function handler(req, res) {

  // if (corsMiddleware(req, res)) return;

  await connectDB();

  if (req.method === 'GET') {
    try {
      const data = await Itenerary.find();
      return res.status(200).json(data);
    } catch (err) {
      console.error("Error fetching itenerary:", err);
      return res.status(500).json({ error: "Server error" });
    }
  }

  if (req.method === 'POST') {
    try {
      const { user_id, name, shortDesc, recipeList } = req.body;
      if (!user_id || !name || !shortDesc || !recipeList)
        return res.status(400).json({ error: "All fields required" });

      const existing = await Itenerary.findOne({ user_id, name });
      if (existing) return res.status(409).json({ message: "Already exists" });

      const newItenerary = new Itenerary({ user_id, name, shortDesc, recipeList });
      await newItenerary.save();
      return res.status(201).json(newItenerary);
    } catch (err) {
      console.error("Error adding itenerary:", err);
      return res.status(500).json({ error: "Server error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
};
