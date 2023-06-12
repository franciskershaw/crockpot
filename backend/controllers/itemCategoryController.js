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
    const itemCategory = new ItemCategory(req.body);
    await itemCategory.save();

    res.status(201).json(ItemCategory);
  } catch (err) {
    next(err);
  }
};

const editItemCategory = async (req, res, next) => {
  try {
    const itemCategory = await ItemCategory.findByIdAndUpdate(
      req.params.itemCategoryId,
      req.body,
      {
        new: true,
      }
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
