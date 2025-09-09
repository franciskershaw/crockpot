import { ColumnDef } from "@tanstack/react-table";
import { AdminUser } from "@/data/types";

import {
  createSelectionColumn,
  createTextColumn,
  createBadgeColumn,
  createDateColumn,
  createCountColumn,
  createActionsColumn,
} from "@/app/admin/components/AdminDataTable/AdminDataTable";
// Note: Delete user functionality is not implemented yet
import { roleColours } from "@/lib/constants";

export interface UserColumnOptions {
  onRoleChange: (user: AdminUser) => void;
}

export function createUserColumns(
  options: UserColumnOptions
): ColumnDef<AdminUser>[] {
  const { onRoleChange } = options;

  return [
    // Selection column
    createSelectionColumn<AdminUser>(),

    // Name column with sorting
    createTextColumn<AdminUser>("name", "Name", {
      sortable: true,
      transform: (value) => (value ? String(value) : "No name"),
    }),

    // Email column with sorting
    createTextColumn<AdminUser>("email", "Email", {
      sortable: true,
      transform: (value) => (value ? String(value).toLowerCase() : "No email"),
    }),

    // Role column with badge
    createBadgeColumn<AdminUser>("role", "Role", roleColours),

    // Created recipes count
    createCountColumn<AdminUser>(
      "createdRecipes",
      "Recipes",
      (user) => user._count.createdRecipes
    ),

    // Favourite recipes count
    createCountColumn<AdminUser>(
      "favouriteRecipes",
      "Favourites",
      (user) => user._count.favouriteRecipes
    ),

    // Created date with sorting
    createDateColumn<AdminUser>("createdAt", "Created"),

    // Actions column with dropdown
    createActionsColumn<AdminUser>("Actions", [
      {
        label: "Change Role",
        onClick: (user: AdminUser) => onRoleChange(user),
      },
      {
        label: "Delete User",
        onClick: (user: AdminUser) => {
          console.log("Delete user:", user.id);
          // TODO: Implement delete user functionality
        },
        variant: "destructive" as const,
      },
    ]),
  ];
}
