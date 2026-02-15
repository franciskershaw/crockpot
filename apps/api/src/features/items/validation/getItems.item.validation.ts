import { z } from "zod";

export const getItemsQuerySchema = z.object({
  mode: z.enum(["all", "ingredients"]).optional().default("all"),
});

export type GetItemsQuery = z.infer<typeof getItemsQuerySchema>;

export const createItemSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  categoryId: z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid category ID"),
  allowedUnitIds: z
    .array(z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid unit ID"))
    .optional()
    .default([]),
});

export type CreateItemInput = z.infer<typeof createItemSchema>;

export const updateItemSchema = z
  .object({
    name: z.string().min(1).max(100).optional(),
    categoryId: z
      .string()
      .regex(/^[a-fA-F0-9]{24}$/, "Invalid category ID")
      .optional(),
    allowedUnitIds: z
      .array(z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid unit ID"))
      .optional(),
  })
  .refine(
    (data) =>
      data.name !== undefined ||
      data.categoryId !== undefined ||
      data.allowedUnitIds !== undefined,
    { message: "At least one field must be provided for update" }
  );

export type UpdateItemInput = z.infer<typeof updateItemSchema>;
