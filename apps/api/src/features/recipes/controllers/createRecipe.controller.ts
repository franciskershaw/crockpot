import { Context } from "hono";

import mongoose from "mongoose";

import { BadRequestError, ForbiddenError } from "../../../core/utils/errors";
import { UserRole } from "../../../shared/types";
import Item from "../../items/model/item.model";
import Recipe from "../model/recipe.model";
import RecipeCategory from "../model/recipeCategory.model";
import type { CreateRecipeInput } from "../validation/getRecipes.recipe.validation";

const createRecipe = async (c: Context) => {
  const body = (c.req as { valid: (key: "json") => CreateRecipeInput }).valid(
    "json"
  );
  const user = c.get("user");
  const userId = user?._id;
  const userRole = user?.role;

  if (!userId) {
    throw new ForbiddenError("Authentication required");
  }

  // Check recipe count limits for non-admin users
  if (userRole !== UserRole.ADMIN) {
    const userRecipeCount = await Recipe.countDocuments({
      createdById: userId,
    });

    if (
      (userRole === UserRole.FREE && userRecipeCount >= 5) ||
      (userRole === UserRole.PREMIUM && userRecipeCount >= 10)
    ) {
      throw new ForbiddenError(
        "You have reached the maximum number of recipes for your plan"
      );
    }
  }

  // Validate categories exist
  const categoryIds = body.categoryIds.map(
    (id) => new mongoose.Types.ObjectId(id)
  );
  const categoryCount = await RecipeCategory.countDocuments({
    _id: { $in: categoryIds },
  });
  if (categoryCount !== categoryIds.length) {
    throw new BadRequestError("One or more categories not found");
  }

  // Validate items exist
  const itemIds = body.ingredients.map(
    (ing) => new mongoose.Types.ObjectId(ing.itemId)
  );
  const itemCount = await Item.countDocuments({
    _id: { $in: itemIds },
  });
  if (itemCount !== itemIds.length) {
    throw new BadRequestError("One or more ingredients not found");
  }

  // Validate units if provided
  const Unit = mongoose.model("Unit");
  const unitIds = body.ingredients
    .map((ing) => ing.unitId)
    .filter((id): id is string => id != null)
    .map((id) => new mongoose.Types.ObjectId(id));

  if (unitIds.length > 0) {
    const unitCount = await Unit.countDocuments({
      _id: { $in: unitIds },
    });
    if (unitCount !== unitIds.length) {
      throw new BadRequestError("One or more units not found");
    }
  }

  // Auto-approve if user is admin
  const approved = userRole === UserRole.ADMIN;

  // Create the recipe
  const recipe = await Recipe.create({
    name: body.name,
    timeInMinutes: body.timeInMinutes,
    serves: body.serves,
    instructions: body.instructions,
    notes: body.notes || [],
    categoryIds,
    ingredients: body.ingredients.map((ing) => ({
      itemId: new mongoose.Types.ObjectId(ing.itemId),
      unitId: ing.unitId ? new mongoose.Types.ObjectId(ing.unitId) : null,
      quantity: ing.quantity,
    })),
    image: body.image || null,
    createdById: new mongoose.Types.ObjectId(userId),
    approved,
  });

  // Populate and return
  const populatedRecipe = await Recipe.aggregate([
    { $match: { _id: recipe._id } },
    {
      $lookup: {
        from: "RecipeCategory",
        localField: "categoryIds",
        foreignField: "_id",
        as: "categoryIds",
      },
    },
    {
      $lookup: {
        from: "User",
        localField: "createdById",
        foreignField: "_id",
        as: "createdBy",
      },
    },
    {
      $unwind: { path: "$createdBy", preserveNullAndEmptyArrays: true },
    },
    {
      $project: {
        "createdBy.password": 0,
        "createdBy.emailVerified": 0,
      },
    },
    {
      $lookup: {
        from: "Item",
        localField: "ingredients.itemId",
        foreignField: "_id",
        as: "ingredientItems",
      },
    },
    {
      $lookup: {
        from: "Unit",
        localField: "ingredients.unitId",
        foreignField: "_id",
        as: "ingredientUnits",
      },
    },
    {
      $addFields: {
        ingredients: {
          $map: {
            input: "$ingredients",
            as: "ing",
            in: {
              itemId: {
                $arrayElemAt: [
                  {
                    $filter: {
                      input: "$ingredientItems",
                      as: "item",
                      cond: { $eq: ["$$item._id", "$$ing.itemId"] },
                    },
                  },
                  0,
                ],
              },
              unitId: {
                $cond: {
                  if: { $ne: ["$$ing.unitId", null] },
                  then: {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: "$ingredientUnits",
                          as: "unit",
                          cond: { $eq: ["$$unit._id", "$$ing.unitId"] },
                        },
                      },
                      0,
                    ],
                  },
                  else: null,
                },
              },
              quantity: "$$ing.quantity",
            },
          },
        },
      },
    },
    {
      $project: {
        ingredientItems: 0,
        ingredientUnits: 0,
      },
    },
  ]);

  return c.json(populatedRecipe[0], 201);
};

export default createRecipe;
