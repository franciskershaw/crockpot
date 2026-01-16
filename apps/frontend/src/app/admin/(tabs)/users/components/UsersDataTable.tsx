"use client";

import * as React from "react";
import { AdminUser } from "@/data/types";
import { UserRole } from "@/data/types";
import { AdminDataTable } from "@/app/admin/components/AdminDataTable/AdminDataTable";
import {
  GenericStatusChangeDialog,
  StatusOption,
} from "@/app/admin/components/AdminDataTable/GenericStatusChangeDialog";
import { roleColours } from "@/lib/constants";
import { createUserColumns } from "../utils/userColumns";
import { useUpdateUserRole } from "@/app/admin/hooks/useUpdateUserRole";
import { useBulkUpdateUserRoles } from "@/app/admin/hooks/useBulkUpdateUserRoles";
import { useRouter } from "next/navigation";

interface UsersDataTableProps {
  data: AdminUser[];
}

export function UsersDataTable({ data }: UsersDataTableProps) {
  const router = useRouter();
  const [roleDialogOpen, setRoleDialogOpen] = React.useState(false);
  const [bulkRoleDialogOpen, setBulkRoleDialogOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<AdminUser | null>(
    null
  );
  const [selectedUsers, setSelectedUsers] = React.useState<AdminUser[]>([]);

  const updateRoleMutation = useUpdateUserRole();
  const bulkUpdateRolesMutation = useBulkUpdateUserRoles();

  const handleRoleChange = (user: AdminUser) => {
    setSelectedUser(user);
    setRoleDialogOpen(true);
  };

  const handleBulkRoleChange = (users: AdminUser[]) => {
    setSelectedUsers(users);
    setBulkRoleDialogOpen(true);
  };

  const confirmRoleChange = (role: UserRole) => {
    if (selectedUser) {
      updateRoleMutation.mutate(
        { userId: selectedUser.id, role },
        {
          onSuccess: () => {
            setRoleDialogOpen(false);
            router.refresh();
          },
        }
      );
    }
  };

  const confirmBulkRoleChange = (role: UserRole) => {
    if (selectedUsers.length > 0) {
      bulkUpdateRolesMutation.mutate(
        { userIds: selectedUsers.map((u) => u.id), role },
        {
          onSuccess: () => {
            setBulkRoleDialogOpen(false);
            router.refresh();
          },
        }
      );
    }
  };

  const columns = createUserColumns({
    onRoleChange: handleRoleChange,
  });

  const actions = [
    {
      label: "Set to Free",
      onClick: (users: AdminUser[]) => handleBulkRoleChange(users),
      variant: "default" as const,
    },
    {
      label: "Set to Premium",
      onClick: (users: AdminUser[]) => handleBulkRoleChange(users),
      variant: "default" as const,
    },
    {
      label: "Set to Pro",
      onClick: (users: AdminUser[]) => handleBulkRoleChange(users),
      variant: "default" as const,
    },
    {
      label: "Set to Admin",
      onClick: (users: AdminUser[]) => handleBulkRoleChange(users),
      variant: "destructive" as const,
    },
  ];

  const roleOptions: StatusOption<UserRole>[] = [
    {
      label: "Free",
      value: UserRole.FREE,
      colorClass: roleColours[UserRole.FREE],
    },
    {
      label: "Premium",
      value: UserRole.PREMIUM,
      colorClass: roleColours[UserRole.PREMIUM],
    },
    {
      label: "Pro",
      value: UserRole.PRO,
      colorClass: roleColours[UserRole.PRO],
    },
    {
      label: "Admin",
      value: UserRole.ADMIN,
      colorClass: roleColours[UserRole.ADMIN],
    },
  ];

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
        currentStatus={selectedUser?.role ?? UserRole.FREE}
        statusOptions={roleOptions}
        onConfirm={confirmRoleChange}
        entityName="user"
        statusName="role"
      />

      <GenericStatusChangeDialog
        open={bulkRoleDialogOpen}
        onOpenChange={setBulkRoleDialogOpen}
        currentStatus={UserRole.FREE}
        statusOptions={roleOptions}
        onConfirm={confirmBulkRoleChange}
        isMultiple={true}
        count={selectedUsers.length}
        entityName="user"
        statusName="role"
      />
    </>
  );
}
