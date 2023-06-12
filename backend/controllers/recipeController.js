const Recipe = require('../models/Recipe');
const User = require('../models/User');
const RecipeCategory = require('../models/RecipeCategory');
const { NotFoundError } = require('../errors/errors');
const cloudinary = require('cloudinary').v2;

const getAllRecipes = async (req, res, next) => {
  try {
    const recipes = await Recipe.find();
    res.status(200).json(recipes);
  } catch (err) {
    next(err);
  }
};

const createNewRecipe = async (req, res, next) => {
  try {
    const recipe = new Recipe(req.body);
    recipe.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
    if (req.user.isAdmin) {
      recipe.approved = true;
    } else {
      // TODO - send an email when new recipe has been added
    }
    await recipe.save();
    res.status(201).json(recipe);
  } catch (err) {
    next(err);
  }
};

const getSingleRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId);
    const categories = await RecipeCategory.find({ _id: recipe.categories });
    const createdBy = await User.findById(recipe.createdBy);

    res.status(200).json({
      _id: recipe._id,
      name: recipe.name,
      image: recipe.image,
      timeInMinutes: recipe.timeInMinutes,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      notes: recipe.notes,
      categories,
      createdBy: {
        _id: createdBy._id,
        name: createdBy.username,
      },
      approved: recipe.approved,
    });
  } catch (err) {
    next(err);
  }
};

const editRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId);

    if (!recipe) {
      throw new NotFoundError('Recipe not found');
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.recipeId,
      req.body,
      { new: true }
    );
    if (req.file) {
      if (recipe.image && recipe.image.filename) {
        // Delete the previous image from cloudinary
        await cloudinary.uploader.destroy(recipe.image.filename);
      }

      updatedRecipe.image = {
        url: req.file.path,
        filename: req.file.filename,
      };

      await updatedRecipe.save();
    }

    res.status(200).json(updatedRecipe);
  } catch (err) {
    next(err);
  }
};

const deleteRecipe = async (req, res, next) => {
  const { recipeId } = req.params;
  try {
    const recipe = await Recipe.findById(recipeId);
    await recipe.remove();
    if (recipe.image && recipe.image.filename) {
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(recipe.image.filename);
    }
    res.status(200).json({ msg: 'Recipe deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllRecipes,
  createNewRecipe,
  getSingleRecipe,
  editRecipe,
  deleteRecipe,
};
