import { useBasicMutation } from "@/hooks/shared/useBasicMutation";
import { bulkUpdateUserRoles } from "@/actions/users";
import type { UserRole } from "@/data/types";
import { queryKeys } from "@/lib/constants";

export function useBulkUpdateUserRoles() {
  return useBasicMutation<
    { userIds: string[]; role: UserRole },
    { success: boolean; updatedCount: number; message: string }
  >({
    mutationFn: bulkUpdateUserRoles,
    requireAuth: true,
    successMessage: (data) =>
      data.message || "User roles updated successfully!",
    invalidateQueries: [[queryKeys.USERS]],
  });
}
