"use client";

import * as React from "react";
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

export interface StatusOption<T> {
  value: T;
  label: string;
  colorClass: string;
}

interface GenericStatusChangeDialogProps<T> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentStatus: T;
  statusOptions: StatusOption<T>[];
  onConfirm: (newStatus: T) => void;
  isMultiple?: boolean;
  count?: number;
  entityName?: string; // e.g., "user", "recipe"
  statusName?: string; // e.g., "role", "status"
}

type DialogState = "select" | "confirm";

export function GenericStatusChangeDialog<T>({
  open,
  onOpenChange,
  currentStatus,
  statusOptions,
  onConfirm,
  isMultiple = false,
  count = 1,
  entityName = "item",
  statusName = "status",
}: GenericStatusChangeDialogProps<T>) {
  const [state, setState] = React.useState<DialogState>("select");
  const [selectedStatus, setSelectedStatus] = React.useState<T | null>(null);

  const updateState = (newState: DialogState, newStatus: T | null = null) => {
    setState(newState);
    setSelectedStatus(newStatus);
  };

  const handleStatusSelect = (status: T) => {
    updateState("confirm", status);
  };

  const handleConfirm = () => {
    if (selectedStatus !== null) {
      onConfirm(selectedStatus);
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

  const getCurrentStatusOption = (status: T) =>
    statusOptions.find((option) => option.value === status);

  const currentStatusOption = getCurrentStatusOption(currentStatus);
  const selectedStatusOption =
    selectedStatus !== null ? getCurrentStatusOption(selectedStatus) : null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {state === "select"
              ? `Change ${statusName}`
              : `Confirm ${statusName} Change`}
          </DialogTitle>
          <DialogDescription>
            {state === "select"
              ? isMultiple
                ? `Select a new ${statusName} for ${count} ${entityName}${
                    count > 1 ? "s" : ""
                  }`
                : `Select a new ${statusName} for this ${entityName}`
              : isMultiple
              ? `Are you sure you want to change ${count} ${entityName}${
                  count > 1 ? "s" : ""
                } to ${selectedStatusOption?.label}?`
              : `Are you sure you want to change this ${entityName}'s ${statusName} to ${selectedStatusOption?.label}?`}
          </DialogDescription>
        </DialogHeader>

        {state === "select" && (
          <div className="space-y-3">
            <div className="text-sm text-muted-foreground">
              Current {statusName}:{" "}
              <Badge className={currentStatusOption?.colorClass}>
                {currentStatusOption?.label}
              </Badge>
            </div>
            <div className="space-y-2">
              {statusOptions.map((option) => (
                <Button
                  key={String(option.value)}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleStatusSelect(option.value)}
                  disabled={option.value === currentStatus}
                >
                  <Badge className={option.colorClass}>{option.label}</Badge>
                  {option.value === currentStatus && (
                    <span className="ml-2 text-sm text-muted-foreground">
                      (current)
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </div>
        )}

        {state === "confirm" && selectedStatusOption && currentStatusOption && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge className={currentStatusOption.colorClass}>
                {currentStatusOption.label}
              </Badge>
              <span>→</span>
              <Badge className={selectedStatusOption.colorClass}>
                {selectedStatusOption.label}
              </Badge>
            </div>
            {isMultiple && (
              <div className="text-sm text-muted-foreground">
                This will affect {count} {entityName}
                {count > 1 ? "s" : ""}
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
