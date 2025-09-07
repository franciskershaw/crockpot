"use client";

import * as React from "react";
import { UserRole } from "@/data/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { roleColours } from "@/lib/constants";

interface RoleChangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRole: UserRole;
  onConfirm: (newRole: UserRole) => void;
  isMultiple?: boolean;
  count?: number;
}

type DialogState = "select" | "confirm";

export function RoleChangeDialog({
  open,
  onOpenChange,
  currentRole,
  onConfirm,
  isMultiple = false,
  count = 1,
}: RoleChangeDialogProps) {
  const [state, setState] = React.useState<DialogState>("select");
  const [selectedRole, setSelectedRole] = React.useState<UserRole | null>(null);

  const updateState = (
    newState: DialogState,
    newRole: UserRole | null = null
  ) => {
    setState(newState);
    setSelectedRole(newRole);
  };

  const handleRoleSelect = (role: UserRole) => {
    updateState("confirm", role);
  };

  const handleConfirm = () => {
    if (selectedRole) {
      onConfirm(selectedRole);
      onOpenChange(false);
      updateState("select", null);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    updateState("select", null);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      updateState("select", null);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {state === "select" ? "Change Role" : "Confirm Role Change"}
          </DialogTitle>
          <DialogDescription>
            {state === "select"
              ? isMultiple
                ? `Select a new role for ${count} user${count > 1 ? "s" : ""}`
                : "Select a new role for this user"
              : isMultiple
              ? `Are you sure you want to change ${count} user${
                  count > 1 ? "s" : ""
                } to ${selectedRole}?`
              : `Are you sure you want to change this user's role to ${selectedRole}?`}
          </DialogDescription>
        </DialogHeader>

        {state === "select" && (
          <div className="space-y-3">
            <div className="text-sm text-muted-foreground">
              Current role:{" "}
              <Badge className={roleColours[currentRole]}>{currentRole}</Badge>
            </div>
            <div className="space-y-2">
              {Object.values(UserRole).map((role) => (
                <Button
                  key={role}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleRoleSelect(role)}
                  disabled={role === currentRole}
                >
                  <Badge className={roleColours[role]}>{role}</Badge>
                  {role === currentRole && (
                    <span className="ml-2 text-sm text-muted-foreground">
                      (current)
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </div>
        )}

        {state === "confirm" && selectedRole && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge className={roleColours[currentRole]}>{currentRole}</Badge>
              <span>→</span>
              <Badge className={roleColours[selectedRole]}>
                {selectedRole}
              </Badge>
            </div>
            {isMultiple && (
              <div className="text-sm text-muted-foreground">
                This will affect {count} user{count > 1 ? "s" : ""}
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          {state === "confirm" && (
            <Button
              variant="outline"
              onClick={() => updateState("select", null)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          )}
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          {state === "confirm" && (
            <Button onClick={handleConfirm}>Confirm Change</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
