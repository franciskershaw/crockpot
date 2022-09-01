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

module.exports = router;