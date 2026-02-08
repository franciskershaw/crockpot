import { z } from "zod";

export const getItemsQuerySchema = z.object({
  mode: z.enum(["all", "ingredients"]).optional().default("all"),
});

export type GetItemsQuery = z.infer<typeof getItemsQuerySchema>;
