const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
  },
  favouriteRecipes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipe',
    },
  ],
  recipeMenu: [
    {
      recipeId: mongoose.Schema.Types.ObjectId,
      serves: Number,
    },
  ],
  shoppingList: [
    {
      itemId: mongoose.Schema.Types.ObjectId,
      quantity: Number,
      unit: String,
      obtained: Boolean,
    },
  ],
  regularItems: [
    {
      itemId: mongoose.Schema.Types.ObjectId,
      quantity: Number,
      unit: String,
    },
  ],
  extraItems: [
    {
      itemId: mongoose.Schema.Types.ObjectId,
      quantity: Number,
      unit: String,
    },
  ],
});

module.exports = mongoose.model('User', UserSchema);
