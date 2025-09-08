import { useAuthenticatedMutation } from "@/hooks/shared/useBasicMutation";
import { bulkUpdateUserRoles } from "@/actions/users";
import { UserRole } from "@/data/types";
import { queryKeys } from "@/lib/constants";

export function useBulkUpdateUserRoles() {
  return useAuthenticatedMutation<
    { userIds: string[]; role: UserRole },
    { success: boolean; updatedCount: number; message: string }
  >({
    mutationFn: bulkUpdateUserRoles,
    minimumRole: UserRole.ADMIN,
    successMessage: (data) =>
      data.message || "User roles updated successfully!",
    invalidateQueries: [[queryKeys.USERS]],
  });
}
