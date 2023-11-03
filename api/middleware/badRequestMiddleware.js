const { BadRequestError } = require('../errors/errors');
const User = require('../models/User');

const itemIdInShoppingList = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { shoppingList } = await User.findById(userId);

    const itemId = req.params.itemId;

    const itemIdIsInShoppingList = shoppingList.some((item) =>
      item._id.equals(itemId)
    );

    if (itemIdIsInShoppingList) {
      next();
    } else {
      throw new BadRequestError('Item is not in shopping list');
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  itemIdInShoppingList,
};
