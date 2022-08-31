const mongoose = require('mongoose');

const IngredientCategorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
		unique: true
  },
  faIcon: {
    type: String,
    required: true,
		unique: true
  },
});

module.exports = mongoose.model('IngredientCategory', IngredientCategorySchema);
