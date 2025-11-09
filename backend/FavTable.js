const mongoose = require('mongoose');

const FavTableSchema = new mongoose.Schema({
    user_id: String,
    recipe_id: String,
}, { collection: "FavTable" });

module.exports = mongoose.model('FavTable', FavTableSchema);