const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const itemSchema = require('../models/newSchema');
const User = require('../models/User');
const FavTable = require('../models/FavTable');
const Itenerary = require('../models/Itenerary');
require('dotenv').config({ path: './config.env' });

const connectDB = require('../newDatabaseTest');
connectDB();

const app = express();
app.disable('x-powered-by');
app.use(cors());
app.use(express.json());

// GET routes
app.get("/items", async (req, res) => {
  try {
    const items = await itemSchema.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/favorites", async (req, res) => {
  try {
    const favorites = await FavTable.find();
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/itenerary", async (req, res) => {
  try {
    const itenerary = await Itenerary.find();
    res.json(itenerary);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// POST and DELETE routes (unchanged)
app.post("/favorites", async (req, res) => { /* ... same as before ... */ });
app.post("/itenerary", async (req, res) => { /* ... same as before ... */ });
app.post("/users", async (req, res) => { /* ... same as before ... */ });
app.delete("/favorites", async (req, res) => { /* ... same as before ... */ });

// Mount CRUD routes
const CRUD = require('../CRUD');
app.use('/items', CRUD);

module.exports = app;
