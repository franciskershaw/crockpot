import { z } from "zod";

export const getRecipesQuerySchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  pageSize: z.coerce.number().min(1).max(100).optional().default(10),
});

export type GetRecipesQuery = z.infer<typeof getRecipesQuerySchema>;
