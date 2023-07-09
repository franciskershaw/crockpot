const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Recipe = require('../models/Recipe');
const Item = require('../models/Item');

const {
  BadRequestError,
  ConflictError,
  UnauthorizedError,
  InternalServerError,
} = require('../errors/errors');

const {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  generateUserObject,
} = require('../helper/helper');

const {
  createUserSchema,
  loginUserSchema,
  userFavouritesSchema,
  userRecipeMenuSchema,
  editShoppingListSchema,
} = require('../joiSchemas/schemas');

const registerUser = async (req, res, next) => {
  try {
    const { error, value } = createUserSchema.validate(req.body);

    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const { username, password } = value;

    const userExists = await User.findOne({ username });
    if (userExists) {
      throw new ConflictError('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ username, password: hashedPassword });

    if (user) {
      const refreshToken = generateRefreshToken(user._id);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      res.status(201).json(generateUserObject(user));
    } else {
      throw new InternalServerError('Error creating user');
    }
  } catch (err) {
    next(err);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { error, value } = loginUserSchema.validate(req.body);

    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const { username, password } = value;

    const user = await User.findOne({ username });

    if (!user) {
      throw new BadRequestError('Username or password is incorrect');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new BadRequestError('Username or password is incorrect');
    }

    const refreshToken = generateRefreshToken(user._id);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(200).json(generateUserObject(user));
  } catch (err) {
    next(err);
  }
};

const logoutUser = (req, res) => {
  res.clearCookie('refreshToken');
  res.status(200).json({ message: 'User logged out' });
};

const checkRefreshToken = (req, res, next) => {
  const cookies = req.cookies;

  if (!cookies?.refreshToken)
    throw new UnauthorizedError('No refresh token', 'NO_TOKEN');

  const refreshToken = cookies.refreshToken;

  try {
    const { _id } = verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const accessToken = generateAccessToken(_id);

    res.json({ accessToken, _id });
  } catch (error) {
    res.clearCookie('refreshToken');

    throw new UnauthorizedError('Issues validating the token');
  }
};

const getUserInfo = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json(generateUserObject(user));
  } catch (err) {
    next(err);
  }
};

const getUserRecipeMenu = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const recipes = await Recipe.find({ _id: { $in: user.recipeMenu } })
      .populate('createdBy', 'username')
      .populate('categories');
    const menu = [];

    for (const recipe of recipes) {
      const { serves } = user.recipeMenu.find((item) =>
        item._id.equals(recipe._id)
      );
      menu.push({ recipe, serves });
    }

    res.status(200).json(menu);
  } catch (err) {
    next(err);
  }
};

const editUserRecipeMenu = async (req, res, next) => {
  try {
    const { value, error } = userRecipeMenuSchema.validate(req.body);

    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const user = await User.findById(req.user._id);

    user.recipeMenu = value.recipeMenu;

    await user.save();

    res.status(200).json(user.recipeMenu);
  } catch (err) {
    next(err);
  }
};

const getUserShoppingList = async (req, res, next) => {
  try {
    const list = await formatItemList(req.user._id, 'shoppingList');

    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};

const getUserExtraItems = async (req, res, next) => {
  try {
    const list = await formatItemList(req.user._id, 'extraItems');

    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};

const toggleObtainedUserShoppingList = async (req, res, next) => {
  try {
    const { value, error } = editShoppingListSchema.validate(req.body);

    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    let update = {
      'shoppingList.$[item].obtained': value.obtained,
    };

    let arrayFilters = {
      arrayFilters: [{ 'item._id': value._id }],
    };

    await User.updateOne({ _id: req.user._id }, { $set: update }, arrayFilters);

    const newShoppingList = await formatItemList(req.user._id, 'shoppingList');
    res.status(200).json(newShoppingList);
  } catch (err) {
    next(err);
  }
};

const editUserExtraItems = async (req, res, next) => {
  try {
    const { value, error } = editShoppingListSchema.validate(req.body);

    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    if (value.hasOwnProperty('obtained')) {
      let update = {
        'extraItems.$[item].obtained': value.obtained,
      };

      let arrayFilters = {
        arrayFilters: [{ 'item._id': value._id }],
      };

      await User.updateOne(
        { _id: req.user._id },
        { $set: update },
        arrayFilters
      );
    } else {
      await User.updateOne(
        { _id: req.user._id },
        { $pull: { extraItems: { _id: value._id } } }
      );
    }
    const newShoppingList = await formatItemList(req.user._id, 'extraItems');
    res.status(200).json(newShoppingList);
  } catch (err) {
    next(err);
  }
};

const getUserFavourites = async (req, res, next) => {
  try {
    const { favouriteRecipes } = await User.findById(req.user._id);
    const favourites = await Recipe.find({ _id: { $in: favouriteRecipes } })
      .populate('createdBy', 'username')
      .populate('categories');

    res.status(200).json(favourites);
  } catch (err) {
    next(err);
  }
};

const editUserFavourites = async (req, res, next) => {
  try {
    const { value, error } = userFavouritesSchema.validate(req.body);

    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const user = await User.findById(req.user._id);

    user.favouriteRecipes = value.favouriteRecipes;

    await user.save();

    res.status(200).json(user.favouriteRecipes);
  } catch (err) {
    next(err);
  }
};

// Used for either extraItems or shoppingList, to return required item information
async function formatItemList(userId, type) {
  const user = await User.findById(userId);
  const itemsArray = user[type];
  const itemsDetails = await Item.find({ _id: { $in: itemsArray } });

  let list = [];

  for (const item of itemsDetails) {
    const { quantity, unit, obtained } = itemsArray.find((extraItem) =>
      item._id.equals(extraItem._id)
    );
    list.push({ item, quantity, unit, obtained });
  }

  return list;
}

module.exports = {
  registerUser,
  loginUser,
  checkRefreshToken,
  logoutUser,
  getUserInfo,
  getUserRecipeMenu,
  editUserRecipeMenu,
  getUserShoppingList,
  getUserExtraItems,
  toggleObtainedUserShoppingList,
  editUserExtraItems,
  getUserFavourites,
  editUserFavourites,
};
