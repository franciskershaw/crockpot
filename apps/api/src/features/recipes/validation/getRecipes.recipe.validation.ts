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
