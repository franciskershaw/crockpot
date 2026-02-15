import { Context } from "hono";

import mongoose from "mongoose";

import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../../../core/utils/errors";
import { UserRole } from "../../../shared/types";
import Item from "../../items/model/item.model";
import Recipe from "../model/recipe.model";
import RecipeCategory from "../model/recipeCategory.model";
import type { UpdateRecipeInput } from "../validation/getRecipes.recipe.validation";

const updateRecipe = async (c: Context) => {
  const recipeId = c.req.param("id");
  const body = (c.req as { valid: (key: "json") => UpdateRecipeInput }).valid(
    "json"
  );
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
    throw new ForbiddenError("You don't have permission to edit this recipe");
  }

  // Validate categories if being updated
  if (body.categoryIds) {
    const categoryIds = body.categoryIds.map(
      (id) => new mongoose.Types.ObjectId(id)
    );
    const categoryCount = await RecipeCategory.countDocuments({
      _id: { $in: categoryIds },
    });
    if (categoryCount !== categoryIds.length) {
      throw new BadRequestError("One or more categories not found");
    }
  }

  // Validate items if being updated
  if (body.ingredients) {
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
  }

  // Build update object
  const updateData: Record<string, unknown> = {};
  if (body.name !== undefined) updateData.name = body.name;
  if (body.timeInMinutes !== undefined)
    updateData.timeInMinutes = body.timeInMinutes;
  if (body.serves !== undefined) updateData.serves = body.serves;
  if (body.instructions !== undefined)
    updateData.instructions = body.instructions;
  if (body.notes !== undefined) updateData.notes = body.notes;
  if (body.image !== undefined) updateData.image = body.image;

  if (body.categoryIds !== undefined) {
    updateData.categoryIds = body.categoryIds.map(
      (id) => new mongoose.Types.ObjectId(id)
    );
  }

  if (body.ingredients !== undefined) {
    updateData.ingredients = body.ingredients.map((ing) => ({
      itemId: new mongoose.Types.ObjectId(ing.itemId),
      unitId: ing.unitId ? new mongoose.Types.ObjectId(ing.unitId) : null,
      quantity: ing.quantity,
    }));
  }

  // Update the recipe
  await Recipe.findByIdAndUpdate(recipeId, updateData);

  // Populate and return
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

  if (!populatedRecipe[0]) {
    throw new NotFoundError("Recipe not found after update");
  }

  return c.json(populatedRecipe[0], 200);
};

export default updateRecipe;
