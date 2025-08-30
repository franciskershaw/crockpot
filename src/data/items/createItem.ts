import { prisma } from "@/lib/prisma";
import { Item } from "@/data/types";
import { ValidationError } from "@/lib/errors";

/**
 * Creates a new item in the database
 * @param item - Item to create
 * @returns The created item
 */
export async function createItem(item: Item): Promise<Item> {
  const createdItem = await prisma.item.create({
    data: item,
  });

  if (!createdItem) {
    throw new ValidationError("Failed to create item");
  }

  return createdItem;
}
