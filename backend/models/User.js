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
      _id: mongoose.Schema.Types.ObjectId,
      serves: Number,
    },
  ],
  shoppingList: [
    {
      _id: mongoose.Schema.Types.ObjectId,
      quantity: Number,
      unit: String,
      obtained: Boolean,
    },
  ],
  regularItems: [
    {
      _id: mongoose.Schema.Types.ObjectId,
      quantity: Number,
      unit: String,
    },
  ],
  extraItems: [
    {
      _id: mongoose.Schema.Types.ObjectId,
      quantity: Number,
      unit: String,
      obtained: Boolean,
    },
  ],
});

module.exports = mongoose.model('User', UserSchema);
