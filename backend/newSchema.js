const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  name: { type: String, required: true }, //Recipe name
  ingredients: [                          //Array of ingredients
    {
      name: String,                       //Ingredient name
      quantity: Number,                   //Amount (if 12oz, then amount is 12)
      unit: String                        //Unit (if 12oz then unit is oz)
    }
  ],
  filters: [String],
  instructions: String,
  time: Number,
  numberOfPeople: Number
}, { collection: "recipe" }); // force it to use "recipe"

module.exports = mongoose.model("Recipe", recipeSchema);
