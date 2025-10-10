import { prisma } from "@/lib/prisma";
import { Item } from "@/data/types";
import { ValidationError } from "@/lib/errors";
import { CreateItemInput } from "@/lib/validations";
import { itemWithRelationsInclude } from "@/data/fragments/query-fragments";

/**
 * Creates a new item in the database
 * @param itemData - Item creation data
 * @returns The created item
 */
export async function createItem(itemData: CreateItemInput): Promise<Item> {
  const createdItem = await prisma.item.create({
    data: itemData,
    include: itemWithRelationsInclude,
  });

  if (!createdItem) {
    throw new ValidationError("Failed to create item");
  }

  return createdItem;
}
