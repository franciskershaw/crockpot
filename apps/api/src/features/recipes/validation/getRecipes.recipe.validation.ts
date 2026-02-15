import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const objectIdArray = z.array(z.string().regex(objectIdRegex)).optional();

/** Parsed filters object (same shape as frontend RecipeFilters). */
const filtersSchema = z.object({
  query: z.string().min(1).optional(),
  minTime: z.coerce.number().min(0).optional(),
  maxTime: z.coerce.number().min(0).optional(),
  categoryIds: objectIdArray,
  categoryMode: z.enum(["include", "exclude"]).optional().default("include"),
  ingredientIds: objectIdArray,
});

type ParsedFilters = z.infer<typeof filtersSchema>;

const emptyFilters: ParsedFilters = { categoryMode: "include" };

/** Single query param "filters" as JSON string; parsed and merged into flat shape for buildMatchFilter. */
export const getRecipesQuerySchema = z
  .object({
    page: z.coerce.number().min(1).optional().default(1),
    pageSize: z.coerce.number().min(1).max(100).optional().default(10),
    seed: z.coerce.number().optional(),
    filters: z
      .string()
      .optional()
      .transform((s): ParsedFilters => {
        if (!s?.trim()) return emptyFilters;
        try {
          const parsed = JSON.parse(s) as unknown;
          return filtersSchema.parse(parsed);
        } catch {
          return emptyFilters;
        }
      }),
  })
  .transform((data) => {
    const f = data.filters;
    return {
      page: data.page,
      pageSize: data.pageSize,
      seed: data.seed,
      query: f.query,
      minTime: f.minTime,
      maxTime: f.maxTime,
      categoryIds: f.categoryIds?.length ? f.categoryIds : undefined,
      categoryMode: f.categoryMode ?? "include",
      ingredientIds: f.ingredientIds?.length ? f.ingredientIds : undefined,
    };
  });

export type GetRecipesQuery = z.infer<typeof getRecipesQuerySchema>;

// Recipe ingredient schema
const ingredientSchema = z.object({
  itemId: z.string().regex(objectIdRegex, "Invalid item ID"),
  unitId: z
    .string()
    .regex(objectIdRegex, "Invalid unit ID")
    .nullable()
    .optional(),
  quantity: z.number().min(0, "Quantity must be positive"),
});

// Recipe image schema - use refine instead of deprecated .url()
const imageSchema = z
  .object({
    url: z
      .string()
      .min(1, "URL is required")
      .refine((val) => {
        try {
          new URL(val);
          return true;
        } catch {
          return false;
        }
      }, "Invalid image URL"),
    filename: z.string().min(1, "Filename is required"),
  })
  .nullable()
  .optional();

// Create recipe schema
export const createRecipeSchema = z.object({
  name: z.string().min(1, "Name is required").max(200, "Name too long"),
  timeInMinutes: z
    .number()
    .min(1, "Time must be at least 1 minute")
    .max(10000, "Time too long"),
  serves: z
    .number()
    .min(1, "Must serve at least 1")
    .max(100, "Serves too many"),
  instructions: z
    .array(z.string().min(1))
    .min(1, "At least one instruction required"),
  notes: z.array(z.string()).optional().default([]),
  categoryIds: z
    .array(z.string().regex(objectIdRegex))
    .min(1, "At least one category required"),
  ingredients: z
    .array(ingredientSchema)
    .min(1, "At least one ingredient required"),
  image: imageSchema,
});

export type CreateRecipeInput = z.infer<typeof createRecipeSchema>;

// Update recipe schema (all fields optional)
export const updateRecipeSchema = z
  .object({
    name: z.string().min(1).max(200).optional(),
    timeInMinutes: z.number().min(1).max(10000).optional(),
    serves: z.number().min(1).max(100).optional(),
    instructions: z.array(z.string().min(1)).min(1).optional(),
    notes: z.array(z.string()).optional(),
    categoryIds: z.array(z.string().regex(objectIdRegex)).min(1).optional(),
    ingredients: z.array(ingredientSchema).min(1).optional(),
    image: imageSchema,
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

export type UpdateRecipeInput = z.infer<typeof updateRecipeSchema>;

// Update recipe status schema
export const updateRecipeStatusSchema = z.object({
  approved: z.boolean(),
});

export type UpdateRecipeStatusInput = z.infer<typeof updateRecipeStatusSchema>;
