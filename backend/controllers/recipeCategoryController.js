const RecipeCategory = require('../models/RecipeCategory');

const getAllRecipeCategories = async (req, res, next) => {
  try {
    const recipeCategories = await RecipeCategory.find();
    res.status(200).json(recipeCategories);
  } catch (err) {
    next(err);
  }
};

const createNewRecipeCategory = async (req, res, next) => {
  try {
    const recipeCategory = new RecipeCategory(req.body);
    await recipeCategory.save();

    res.status(201).json(recipeCategory);
  } catch (err) {
    next(err);
  }
};

const editRecipeCategory = async (req, res, next) => {
  try {
    const recipeCategory = await RecipeCategory.findByIdAndUpdate(
      req.params.recipeCategoryId,
      req.body,
      {
        new: true,
      }
    );
    res.status(200).json(recipeCategory);
  } catch (err) {
    next(err);
  }
};

const deleteRecipeCategory = async (req, res, next) => {
  try {
    const recipeCategory = await RecipeCategory.findById(
      req.params.recipeCategoryId
    );
    await recipeCategory.remove();
    res.status(200).json({ msg: 'Recipe category deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllRecipeCategories,
  createNewRecipeCategory,
  editRecipeCategory,
  deleteRecipeCategory,
};
