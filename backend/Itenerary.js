const mongoose = require('mongoose');

const ItenerarySchema = new mongoose.Schema({
    user_id: String,
    name: String,
    shortDesc: String,
    recipeList: [
        {recipe_id : String,}
    ]
}, { collection: "Itenerary" });

module.exports = mongoose.model('Itenerary', ItenerarySchema);