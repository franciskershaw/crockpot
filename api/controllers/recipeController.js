const Recipe = require("../models/Recipe");
const User = require("../models/User");
const RecipeCategory = require("../models/RecipeCategory");
const { NotFoundError } = require("../errors/errors");
const cloudinary = require("cloudinary").v2;

// Needs to only return recipes that are approved and also created by the user
const getAllRecipes = async (req, res, next) => {
  try {
    let filter = { approved: true };

    if (req.user) {
      filter = {
        $or: [{ approved: true }, { createdBy: req.user._id }],
      };
    }

    const recipes = await Recipe.find(filter).populate("categories");
    res.status(200).json(recipes);
  } catch (err) {
    next(err);
  }
};

const createNewRecipe = async (req, res, next) => {
  try {
    const { error, value } = recipeSchema.validate(req.body);

    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const recipe = new Recipe(value);
    recipe.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
    recipe.createdBy = req.user._id;
    if (req.user.isAdmin) {
      recipe.approved = true;
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
    console.log(recipe)
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
      throw new NotFoundError("Recipe not found");
    }

    if (
      recipe.createdBy.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      throw new UnauthorizedError(
        "You do not have permission to edit this recipe"
      );
    }

    const { error, value } = recipeSchema.validate(req.body);

    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.recipeId,
      value,
      { new: true }
    );
    if (req.file) {
      if (recipe.image && recipe.image.filename) {
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
      await cloudinary.uploader.destroy(recipe.image.filename);
    }
    res.status(200).json({ msg: "Recipe deleted" });
  } catch (err) {
    next(err);
  }
};

// Admin only
const getUnapprovedRecipes = async (req, res, next) => {
  try {
    const recipes = await Recipe.find({ approved: false });
    res.status(200).json(recipes);
  } catch (err) {
    next(err);
  }
};

const toggleApprovedStatus = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId);

    if (!recipe) {
      throw new NotFoundError("Recipe not found");
    }

    recipe.approved = !recipe.approved;
    await recipe.save();

    res.status(200).json(recipe);
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
  getUnapprovedRecipes,
  toggleApprovedStatus,
};
