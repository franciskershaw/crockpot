const {
	itemCategorySchema,
	editItemCategorySchema,
} = require('../joiSchemas/schemas');
const ItemCategory = require('../models/ItemCategory');

const getAllItemCategories = async (req, res, next) => {
	try {
		const itemCategories = await ItemCategory.find();
		res.status(200).json(itemCategories);
	} catch (err) {
		next(err);
	}
};

const createNewItemCategory = async (req, res, next) => {
	try {
		const { error, value } = itemCategorySchema.validate(req.body);

		if (error) {
			throw new BadRequestError(error.details[0].message);
		}

		const itemCategory = new ItemCategory(value);
		await itemCategory.save();

		res.status(201).json(itemCategory);
	} catch (err) {
		next(err);
	}
};

const editItemCategory = async (req, res, next) => {
	try {
		const value = validateRequest(req.body, editItemCategorySchema);

		const itemCategory = await ItemCategory.findByIdAndUpdate(
			req.params.itemCategoryId,
			value,
			{
				new: true,
			},
		);

		res.status(200).json(itemCategory);
	} catch (err) {
		next(err);
	}
};

module.exports = {
	getAllItemCategories,
	createNewItemCategory,
	editItemCategory,
};
