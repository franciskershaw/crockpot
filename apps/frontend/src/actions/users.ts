"use server";

import { getAllUsers } from "@/data/user/getAllUsers";
import { updateUserRole as updateUserRoleDAL } from "@/data/user/updateUserRole";
import { bulkUpdateUserRoles as bulkUpdateUserRolesDAL } from "@/data/user/bulkUpdateUserRoles";
import {
  withPermission,
  withPermissionAndValidation,
  Permission,
} from "@/lib/action-helpers";
import {
  updateUserRoleSchema,
  bulkUpdateUserRolesSchema,
} from "@/lib/validations";

// Get all users for admin
export const getUsersForAdminPanel = withPermission(
  Permission.ADMIN_PANEL,
  async () => {
    return await getAllUsers();
  }
);

// Update user role
export const updateUserRole = withPermissionAndValidation(
  Permission.ADMIN_PANEL,
  updateUserRoleSchema,
  async (data) => {
    const updatedUser = await updateUserRoleDAL(data);

    return {
      success: true,
      user: updatedUser,
      message: `User role updated to ${data.role}`,
    };
  }
);

// Bulk update user roles
export const bulkUpdateUserRoles = withPermissionAndValidation(
  Permission.ADMIN_PANEL,
  bulkUpdateUserRolesSchema,
  async (data) => {
    const result = await bulkUpdateUserRolesDAL(data);

    return {
      success: true,
      updatedCount: result.count,
      message: `${result.count} users updated to ${data.role}`,
    };
  }
);
