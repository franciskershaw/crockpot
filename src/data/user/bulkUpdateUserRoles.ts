import { prisma } from "@/lib/prisma";
import { UserRole } from "@/data/types";

export interface BulkUpdateUserRolesInput {
  userIds: string[];
  role: UserRole;
}

export interface BulkUpdateUserRolesResult {
  count: number;
}

export async function bulkUpdateUserRoles(
  data: BulkUpdateUserRolesInput
): Promise<BulkUpdateUserRolesResult> {
  const result = await prisma.user.updateMany({
    where: {
      id: {
        in: data.userIds,
      },
    },
    data: {
      role: data.role,
    },
  });

  return result;
}
