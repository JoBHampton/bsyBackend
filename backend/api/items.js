const connectDB = require('../backend/newDatabaseTest');
const Item = require('../backend/newSchema');

module.exports = async function handler(req, res) {
  await connectDB();

  if (req.method === 'GET') {
    try {
      const items = await Item.find();
      return res.status(200).json(items);
    } catch (err) {
      console.error("Error fetching items:", err);
      return res.status(500).json({ error: "Server error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
};
