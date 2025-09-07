import { UserRole } from "@/data/types";
import { updateUserRole, bulkUpdateUserRoles } from "@/actions/admin";
import { toast } from "sonner";

export async function changeUserRole(userId: string, role: UserRole) {
  try {
    await updateUserRole({ userId, role });
    toast.success(`User role updated to ${role}`);
    window.location.reload();
  } catch (error) {
    console.error("Role change error:", error);
    toast.error("Failed to update user role");
  }
}

export async function changeUsersRole(userIds: string[], role: UserRole) {
  try {
    await bulkUpdateUserRoles({ userIds, role });
    toast.success(`${userIds.length} users updated to ${role}`);
    window.location.reload();
  } catch (error) {
    console.error("Bulk role change error:", error);
    toast.error("Failed to update user roles");
  }
}

export async function deleteUser(userId: string) {
  // Proof of concept - not implemented yet
  console.log("Delete user:", userId);
  toast.info("Delete functionality would be implemented here");
}

export async function deleteUsers(userIds: string[]) {
  // Proof of concept - not implemented yet
  console.log("Delete users:", userIds);
  toast.info(
    `Delete functionality would be implemented for ${userIds.length} users`
  );
}
