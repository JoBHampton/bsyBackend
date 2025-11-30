const connectDB = require('../backend/newDatabaseTest');
const Itenerary = require('../backend/Itenerary');
const corsMiddleware = require('../lib/corsMiddleware');

module.exports = async function handler(req, res) {
  // Handle CORS
  if (corsMiddleware(req, res)) return;

  await connectDB();

  if (req.method === 'GET') {
    try {
      const { id } = req.query;
      
      // If ID is provided, fetch single itinerary
      if (id) {
        const itinerary = await Itenerary.findById(id);
        if (!itinerary) {
          return res.status(404).json({ error: "Itinerary not found" });
        }
        return res.status(200).json(itinerary);
      }
      
      // Otherwise fetch all
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

  if (req.method === 'PUT') {
    try {
      const { id } = req.query;
      const { name, shortDesc, recipeList } = req.body;

      if (!id) {
        return res.status(400).json({ error: "Itinerary ID required" });
      }

      // Find and update the itinerary
      const updatedItinerary = await Itenerary.findByIdAndUpdate(
        id,
        { name, shortDesc, recipeList },
        { new: true, runValidators: true } // Return updated doc and run validation
      );

      if (!updatedItinerary) {
        return res.status(404).json({ error: "Itinerary not found" });
      }

      return res.status(200).json(updatedItinerary);
    } catch (err) {
      console.error("Error updating itenerary:", err);
      return res.status(500).json({ error: "Server error" });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: "Itinerary ID required" });
      }

      const deletedItinerary = await Itenerary.findByIdAndDelete(id);

      if (!deletedItinerary) {
        return res.status(404).json({ error: "Itinerary not found" });
      }

      return res.status(200).json({ message: "Itinerary deleted successfully" });
    } catch (err) {
      console.error("Error deleting itenerary:", err);
      return res.status(500).json({ error: "Server error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
};