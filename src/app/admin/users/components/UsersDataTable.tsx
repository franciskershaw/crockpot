"use client";

import * as React from "react";
import { AdminUser } from "@/data/types";
import { UserRole } from "@/data/types";
import { AdminDataTable } from "../../components/AdminDataTable/AdminDataTable";
import { RoleChangeDialog } from "../../components/AdminDataTable/RoleChangeDialog";
import { createUserColumns } from "../utils/userColumns";
import {
  changeUserRole,
  changeUsersRole,
  deleteUsers,
} from "../utils/userActions";

interface UsersDataTableProps {
  data: AdminUser[];
}

export function UsersDataTable({ data }: UsersDataTableProps) {
  const [roleDialogOpen, setRoleDialogOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<AdminUser | null>(
    null
  );
  const [selectedUsers, setSelectedUsers] = React.useState<AdminUser[]>([]);

  const handleRoleChange = (user: AdminUser) => {
    setSelectedUser(user);
    setSelectedUsers([]);
    setRoleDialogOpen(true);
  };

  const handleBulkRoleChange = (users: AdminUser[]) => {
    setSelectedUser(null);
    setSelectedUsers(users);
    setRoleDialogOpen(true);
  };

  const handleRoleConfirm = (newRole: UserRole) => {
    if (selectedUser) {
      changeUserRole(selectedUser.id, newRole);
    } else if (selectedUsers.length > 0) {
      changeUsersRole(
        selectedUsers.map((u) => u.id),
        newRole
      );
    }
  };

  const columns = createUserColumns({
    onRoleChange: handleRoleChange,
  });

  const actions = [
    {
      label: "Change Role",
      onClick: (users: AdminUser[]) => handleBulkRoleChange(users),
    },
    {
      label: "Delete Selected",
      onClick: (users: AdminUser[]) => deleteUsers(users.map((u) => u.id)),
      variant: "destructive" as const,
    },
  ];

  const currentRole =
    selectedUser?.role ||
    (selectedUsers.length > 0 ? selectedUsers[0].role : UserRole.FREE);

  return (
    <>
      <AdminDataTable
        data={data}
        columns={columns}
        searchPlaceholder="Filter by name or email..."
        searchFields={["name", "email"]}
        actions={actions}
        pageSize={10}
      />

      <RoleChangeDialog
        open={roleDialogOpen}
        onOpenChange={setRoleDialogOpen}
        currentRole={currentRole}
        onConfirm={handleRoleConfirm}
        isMultiple={selectedUsers.length > 0}
        count={selectedUsers.length || 1}
      />
    </>
  );
}
