import { Context } from "hono";

import mongoose from "mongoose";

import { ForbiddenError, NotFoundError } from "../../../core/utils/errors";
import { UserRole } from "../../../shared/types";
import Recipe from "../model/recipe.model";

const deleteRecipe = async (c: Context) => {
  const recipeId = c.req.param("id");
  const user = c.get("user");
  const userId = user?._id;
  const userRole = user?.role;

  if (!userId) {
    throw new ForbiddenError("Authentication required");
  }

  // Check if recipe exists
  const recipe = await Recipe.findById(recipeId);
  if (!recipe) {
    throw new NotFoundError("Recipe not found");
  }

  // Check permissions: owner or admin
  const isOwner = recipe.createdById?.toString() === userId;
  const isAdmin = userRole === UserRole.ADMIN;

  if (!isOwner && !isAdmin) {
    throw new ForbiddenError("You don't have permission to delete this recipe");
  }

  // Populate the recipe before deletion to return the full object
  const populatedRecipe = await Recipe.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(recipeId) } },
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

  // Delete the recipe
  await Recipe.findByIdAndDelete(recipeId);

  return c.json(populatedRecipe[0], 200);
};

export default deleteRecipe;
