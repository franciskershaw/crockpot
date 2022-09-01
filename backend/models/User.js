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
      ingredientId: mongoose.Schema.Types.ObjectId,
      quantity: Number,
      unit: String,
      obtained: Boolean,
    },
  ],
  regularItems: [
    {
      ingredientId: mongoose.Schema.Types.ObjectId
    }
  ],
  extraItems: [
    {
      
    }
  ]
});

module.exports = mongoose.model('User', UserSchema);
