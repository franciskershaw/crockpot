"use client";

import * as React from "react";
import { AdminUser } from "@/data/types";
import { UserRole } from "@/data/types";
import { AdminDataTable } from "../../components/AdminDataTable/AdminDataTable";
import {
  GenericStatusChangeDialog,
  StatusOption,
} from "../../components/AdminDataTable/GenericStatusChangeDialog";
import { roleColours } from "@/lib/constants";
import { createUserColumns } from "../utils/userColumns";
import {
  changeUserRole,
  changeUsersRole,
  deleteUsers,
} from "../utils/userActions";

interface UsersDataTableProps {
  data: AdminUser[];
}

const roleStatusOptions: StatusOption<UserRole>[] = [
  {
    value: UserRole.FREE,
    label: UserRole.FREE,
    colorClass: roleColours[UserRole.FREE],
  },
  {
    value: UserRole.PREMIUM,
    label: UserRole.PREMIUM,
    colorClass: roleColours[UserRole.PREMIUM],
  },
  {
    value: UserRole.PRO,
    label: UserRole.PRO,
    colorClass: roleColours[UserRole.PRO],
  },
  {
    value: UserRole.ADMIN,
    label: UserRole.ADMIN,
    colorClass: roleColours[UserRole.ADMIN],
  },
];

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

      <GenericStatusChangeDialog
        open={roleDialogOpen}
        onOpenChange={setRoleDialogOpen}
        currentStatus={currentRole}
        statusOptions={roleStatusOptions}
        onConfirm={handleRoleConfirm}
        isMultiple={selectedUsers.length > 0}
        count={selectedUsers.length || 1}
        entityName="user"
        statusName="role"
      />
    </>
  );
}
