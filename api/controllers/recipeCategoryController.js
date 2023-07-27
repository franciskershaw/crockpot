const RecipeCategory = require('../models/RecipeCategory');
const { recipeCategorySchema } = require('../joiSchemas/schemas');

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
    const { error, value } = recipeCategorySchema.validate(req.body);

    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const recipeCategory = new RecipeCategory(value);
    await recipeCategory.save();

    res.status(201).json(recipeCategory);
  } catch (err) {
    next(err);
  }
};

const editRecipeCategory = async (req, res, next) => {
  try {
    const { error, value } = recipeCategorySchema.validate(req.body);

    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const recipeCategory = await RecipeCategory.findByIdAndUpdate(
      req.params.recipeCategoryId,
      value,
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