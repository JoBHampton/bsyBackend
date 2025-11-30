const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const itemSchema = require('./newSchema');
const User = require('./User');
const FavTable = require('./FavTable');
const Itenerary = require('./Itenerary')
require('dotenv').config({ path: './config.env' });

const connectDB = require('./newDatabaseTest'); // mongoose connection
connectDB();

// SHould be connected to bigSpoonYum
// mongoose.connection.once("open", () => {
//   console.log("Connected to DB:", mongoose.connection.name);
// });


const app = express();
// Will's fix
app.disable('x-powered-by');
app.use(cors());
app.use(express.json());

// Display items at http://localhost:5000/items
app.get("/items", async (req, res) => {
  try {
    const items = await itemSchema.find();
    res.json(items);
  } catch (err) {
    console.error("Error fetching newSchema:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Display users at http://localhost:5000/users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error("Error fetching newSchema:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Display favorites at http://localhost:5000/favorites
app.get("/favorites", async (req, res) => {
  try {
    const favorites = await FavTable.find();
    res.json(favorites);
  } catch (err) {
    console.error("Error fetching newSchema:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Display Itenerary at http://localhost:5000/itenerary
app.get("/itenerary", async (req, res) => {
  try {
    const itenerary = await Itenerary.find();
    res.json(itenerary);
  } catch (err) {
    console.error("Error fetching newSchema:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Add a favorite
app.post("/favorites", async (req, res) => {
  try {
    const { user_id, recipe_id } = req.body;

    if (!user_id || !recipe_id) {
      return res.status(400).json({ error: "user_id and recipe_id are required" });
    }

    const existing = await FavTable.findOne({ user_id, recipe_id });
    if (existing) {
      return res.status(409).json({ message: "Already favorited" });
    }

    const newFav = new FavTable({ user_id, recipe_id });
    await newFav.save();
    res.status(201).json(newFav);
  } catch (err) {
    console.error("Error adding favorite:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Add a itenerary
app.post("/itenerary", async (req, res) => {
  try {
    const { user_id, name, shortDesc, recipeList  } = req.body;

    if (!user_id || !shortDesc || !name || !recipeList ) {
      return res.status(400).json({ error: "bro everything is required" });
    }

    const existing = await Itenerary.findOne({ user_id, shortDesc, name, recipeList });
    if (existing) {
      return res.status(409).json({ message: "Already an itenerary" });
    }

    const newItenerary = new Itenerary({ user_id, name, shortDesc, recipeList });
    await newItenerary.save();
    res.status(201).json(newItenerary);
  } catch (err) {
    console.error("Error adding itenerary:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Add a User
app.post("/users", async(req, res) => {
  try{
    const { user_id, oauth_sub, name, email, onboarded } = req.body;

    if (!user_id || !oauth_sub || !name || !email || !onboarded){
      return res.status(400).json({error: "user_id, oauth_sub, name, and email are all required"});
    }
    const existing = await User.findOne({user_id, oauth_sub, name, email, onboarded});
    if(existing) {
      return res.status(409).json({message: "Already a user"});
    }

    const newUser = new User({user_id, oauth_sub, name, email, onboarded});
    await newUser.save();
    res.status(201).json(newUser);
  } catch(err){
    console.error("Error adding user:", err);
    res.status(500).json({error: "Server error"});
  }
});

// Add an Itinerary
// app.post("/itenerary", async(req,res) => {
//   if (!)
// })

// Remove a favorite
app.delete("/favorites", async (req, res) => {
  try {
    const { user_id, recipe_id } = req.body;

    if (!user_id || !recipe_id) {
      return res.status(400).json({ error: "user_id and recipe_id are required" });
    }

    const deleted = await FavTable.findOneAndDelete({ user_id, recipe_id });

    if (!deleted) {
      return res.status(404).json({ message: "Favorite not found" });
    }

    res.json({ message: "Favorite removed" });
  } catch (err) {
    console.error("Error deleting favorite:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// const Recipe = require("./newSchema");
//
// Insert a clean recipe
// app.get("/seed", async (req, res) => {
//   try {
//     const sample = new Recipe({
//       name: "Bacon Pepperoni",
//       ingredients: [
//         { name: "Bacon", quantity: 1, unit: "lb" },
//         { name: "Pepperoni", quantity: 1000, unit: "slices" },
//         { name: "Butter", quantity: 6, unit: "lb"}
//       ],
//       filters: ['Vegan', 'Lactose-Free'],      
//       instructions: "Mix cous cous with fibars and cook for 10 minutes.",
//       time: 60,
//       numberOfPeople: 5,
//     });

//     await sample.save();
//     res.send("Successful insert");
//   } catch (err) {
//     console.error("Error seeding recipe:", err);
//     res.status(500).send(err.message);
//   }
// });


// CRUD
const CRUD = require('./CRUD');
app.use('/items', CRUD);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
module.exports = app;

