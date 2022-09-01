const mongoose = require('mongoose');

const RecipeCategorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model('RecipeCategory', RecipeCategorySchema);
