const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const multer = require('multer');
const { storage } = require('../config/cloudinary')
const upload = multer({ storage })

const Recipe = require('../models/Recipe')

// Create a new recipe 
router.post('/', upload.single('image'), asyncHandler(async (req, res) => {
	try {
		console.log(req.body)
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