const connectDB = require('../backend/newDatabaseTest');
const User = require('../backend/User');

module.exports = async function handler(req, res) {

  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*'); // or specify your frontend URL
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');


  await connectDB();

  if (req.method === 'GET') {
    try {
      const users = await User.find();
      return res.status(200).json(users);
    } catch (err) {
      console.error("Error fetching users:", err);
      return res.status(500).json({ error: "Server error" });
    }
  }

  if (req.method === 'POST') {
    try {
      const { user_id, oauth_sub, name, email, onboarded } = req.body;

      if (!user_id || !oauth_sub || !name || !email || onboarded === undefined) {
        return res.status(400).json({ error: "Missing fields" });
      }

      const existing = await User.findOne({ user_id });
      if (existing) return res.status(409).json({ message: "Already exists" });

      const newUser = new User({ user_id, oauth_sub, name, email, onboarded });
      await newUser.save();

      return res.status(201).json(newUser);
    } catch (err) {
      console.error("Error adding user:", err);
      return res.status(500).json({ error: "Server error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
};
