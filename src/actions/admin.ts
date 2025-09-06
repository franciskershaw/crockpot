"use server";

import { getAllUsers } from "@/data/admin/getAllUsers";
import { updateUserRole as updateUserRoleDAL } from "@/data/admin/updateUserRole";
import { bulkUpdateUserRoles as bulkUpdateUserRolesDAL } from "@/data/admin/bulkUpdateUserRoles";
import {
  withPermission,
  withPermissionAndValidation,
  Permission,
} from "@/lib/action-helpers";
import { UserRole } from "@/data/types";
import { z } from "zod";

// Schema for updating user role
const updateUserRoleSchema = z.object({
  userId: z.string(),
  role: z.nativeEnum(UserRole),
});

// Schema for bulk updating user roles
const bulkUpdateUserRolesSchema = z.object({
  userIds: z.array(z.string()),
  role: z.nativeEnum(UserRole),
});

// Get all users for admin
export const getAdminUsers = withPermission(
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
