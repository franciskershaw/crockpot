import { useAuthenticatedMutation } from "@/hooks/shared/useAuthenticatedMutation";
import { updateUserRole } from "@/actions/users";
import { UserRole } from "@/data/types";
import { queryKeys } from "@/lib/constants";

export function useUpdateUserRole() {
  return useAuthenticatedMutation<
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
    minimumRole: UserRole.ADMIN,
    successMessage: (data) => data.message || "User role updated successfully!",
    invalidateQueries: [[queryKeys.USERS]],
  });
}
