import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const commaSeparatedObjectIds = z
  .string()
  .optional()
  .transform((s) =>
    s
      ? s
          .split(",")
          .map((id) => id.trim())
          .filter(Boolean)
      : undefined
  )
  .refine(
    (ids) => !ids || ids.every((id) => objectIdRegex.test(id)),
    "Invalid ObjectId in list"
  );

export const getRecipesQuerySchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  pageSize: z.coerce.number().min(1).max(100).optional().default(10),
  query: z.string().min(1).optional(),
  minTime: z.coerce.number().min(0).optional(),
  maxTime: z.coerce.number().min(0).optional(),
  categoryIds: commaSeparatedObjectIds,
  categoryMode: z.enum(["include", "exclude"]).optional().default("include"),
  ingredientIds: commaSeparatedObjectIds,
  seed: z.coerce.number().optional(),
});

export type GetRecipesQuery = z.infer<typeof getRecipesQuerySchema>;
