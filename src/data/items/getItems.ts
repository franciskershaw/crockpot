import { prisma } from "@/lib/prisma";

export async function getItems() {
  const items = await prisma.item.findMany({
    orderBy: { name: "asc" },
  });

  return items;
}
