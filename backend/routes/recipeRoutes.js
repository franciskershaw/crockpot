const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const multer = require('multer');
const { storage } = require('../config/cloudinary')
const upload = multer({ storage })

const Recipe = require('../models/Recipe')
const User = require('../models/User')
const Item = require('../models/Item')
const RecipeCategory = require('../models/RecipeCategory')

router.get('/', asyncHandler(async (req, res) => {
	try {
		const recipes = await Recipe.find();
		res.status(200).json(recipes);
	} catch (err) {
		res.status(400)
		throw new Error(err)
	}
}))

// Create a new recipe 
router.post('/', upload.single('image'), asyncHandler(async (req, res) => {
	try {
		const recipe = new Recipe(req.body);
		recipe.image = {
			url: req.file.path,
			filename: req.file.filename
		}
		await recipe.save()
		res.status(201).json(recipe)
	} catch (err) {
		res.status(400)
		throw new Error(err)
	}
}))

// Get single recipe (and tweak return data to include everything needed on frontend)
router.get('/:recipeId', asyncHandler(async (req, res) => {
	try {
		const recipe = await Recipe.findById(req.params.recipeId)
		const categories = await RecipeCategory.find({ _id: recipe.categories})
		const createdBy = await User.findById(recipe.createdBy)
		
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
				name: createdBy.username
			}
		})
	} catch (err) {
		res.status(400)
		throw new Error(err)
	}
}))

// Edit a recipe
router.put('/:recipeId', upload.single('image'), asyncHandler(async (req, res) => {
	try {
		const recipe = await Recipe.findById(req.params.recipeId)

		if (!recipe) {
			res.status(404)
			throw new Error('Recipe not found')
		}

		const updatedRecipe = await Recipe.findByIdAndUpdate(
			req.params.recipeId,
			req.body,
			{ new: true }
		)
		updatedRecipe.image = {
			url: req.file.path,
			filename: req.file.filename
		}
		await updatedRecipe.save()

		res.status(200).json(updatedRecipe)

	} catch (err) {
		res.status(400)
		throw new Error(err)
	}
}))

// Delete a recipe
router.delete('/:recipeId', asyncHandler(async (req, res) => {
	const { recipeId } = req.params
	try {
		await Recipe.findByIdAndDelete(recipeId)
		res.status(200).json({ recipeId })
	} catch (err) {
		res.status(400)
		throw new Error(err)
	}
}))

module.exports = router;