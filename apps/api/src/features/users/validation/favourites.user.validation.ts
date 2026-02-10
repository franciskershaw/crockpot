import { z } from "zod";

// Schema for adding a recipe to favourites
export const favouritesSchema = z.object({
  recipeId: z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid recipe ID format"),
});

export type FavouritesInput = z.infer<typeof favouritesSchema>;
