const mongoose = require('mongoose');

const ingredientSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    quantity: Number,
    unit: String,
  },
  { _id: false }
);

const RecipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  timeInMinutes: {
    type: Number,
    required: true,
  },
  image: {
    url: String,
    filename: String,
  },
  ingredients: [ingredientSchema],
  instructions: [
    {
      type: String,
      required: true,
    },
  ],
  notes: [
    {
      type: String,
    },
  ],
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  approved: {
    type: Boolean,
    required: true,
    default: false,
  },
});

module.exports = mongoose.model('Recipe', RecipeSchema);
