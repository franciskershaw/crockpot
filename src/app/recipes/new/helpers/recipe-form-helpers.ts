import type { Unit, Recipe, Item } from "@/data/types";
import type { CreateRecipeInput } from "@/lib/validations";
import type { IngredientItem } from "../components/IngredientManager";
import type { Instruction } from "../components/Instructions";

// Extended type for editing that includes the recipe ID
export type EditRecipeInput = CreateRecipeInput & {
  id: string;
};

/**
 * Transform a recipe from database format to form format for editing
 */
export function transformRecipeForForm(recipe: Recipe): EditRecipeInput {
  return {
    id: recipe.id,
    name: recipe.name,
    timeInMinutes: recipe.timeInMinutes,
    serves: recipe.serves,
    categoryIds: recipe.categories.map((cat) => cat.id),
    ingredients: recipe.ingredients.map((ing) => ({
      itemId: ing.itemId,
      unitId: ing.unitId,
      quantity: ing.quantity,
    })),
    instructions: recipe.instructions,
    notes: recipe.notes || [],
    image:
      recipe.image && recipe.image.url && recipe.image.filename
        ? { url: recipe.image.url, filename: recipe.image.filename }
        : undefined,
  };
}

/**
 * Transform recipe ingredients to IngredientManager format
 */
export function transformIngredientsForForm(
  recipeIngredients: CreateRecipeInput["ingredients"],
  availableIngredients: Item[],
  units: Unit[]
): IngredientItem[] {
  return recipeIngredients.map((ingredient) => {
    const item = availableIngredients.find((i) => i.id === ingredient.itemId);
    const unit = ingredient.unitId
      ? units.find((u) => u.id === ingredient.unitId)
      : null;

    return {
      id: crypto.randomUUID(),
      itemId: ingredient.itemId,
      itemName: item?.name || "Unknown Item",
      unitId: ingredient.unitId || null,
      unitName: unit?.name || null,
      quantity: ingredient.quantity,
      allowedUnits: item?.allowedUnits || [],
    };
  });
}

/**
 * Transform recipe instructions to Instructions component format
 */
export function transformInstructionsForForm(
  instructions: string[]
): Instruction[] {
  if (!instructions || instructions.length === 0) {
    return [{ id: crypto.randomUUID(), text: "" }];
  }

  return instructions.map((instruction) => ({
    id: crypto.randomUUID(),
    text: instruction,
  }));
}

/**
 * Transform notes array to textarea string
 */
export function transformNotesForTextarea(notes: string[] | undefined): string {
  return Array.isArray(notes) ? notes.join("\n") : "";
}

/**
 * Transform textarea string to notes array
 */
export function transformTextareaToNotes(value: string): string[] {
  return value
    .split("\n")
    .map((note: string) => note.trim())
    .filter((note: string) => note.length > 0);
}
