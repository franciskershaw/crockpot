import { useBasicMutation } from "@/hooks/shared/useBasicMutation";
import { updateUserRole } from "@/actions/users";
import type { UserRole } from "@/data/types";
import { queryKeys } from "@/lib/constants";

export function useUpdateUserRole() {
  return useBasicMutation<
    { userId: string; role: UserRole },
    {
      success: boolean;
      user: {
        id: string;
        name: string | null;
        email: string | null;
        role: UserRole;
      };
      message: string;
    }
  >({
    mutationFn: updateUserRole,
    requireAuth: true,
    successMessage: (data) => data.message || "User role updated successfully!",
    invalidateQueries: [[queryKeys.USERS]],
  });
}
