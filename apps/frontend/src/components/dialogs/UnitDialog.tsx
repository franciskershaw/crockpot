"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UnitWithUsage } from "@/data/units/getUnitsWithUsage";
import { updateUnit } from "@/actions/units";
import { useCreateUnit } from "@/app/admin/hooks/useCreateUnit";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface UnitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  unit?: UnitWithUsage | null;
}

export function UnitDialog({
  open,
  onOpenChange,
  onSuccess,
  unit,
}: UnitDialogProps) {
  const [name, setName] = useState("");
  const [abbreviation, setAbbreviation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!unit;
  const createUnitMutation = useCreateUnit();

  // Reset form when dialog opens or unit changes
  useEffect(() => {
    if (open) {
      if (unit) {
        // Editing mode - populate with existing data
        setName(unit.name);
        setAbbreviation(unit.abbreviation);
      } else {
        // Creating mode - reset form
        setName("");
        setAbbreviation("");
      }
    }
  }, [open, unit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!name.trim() || !abbreviation.trim()) {
      return;
    }

    const unitData = {
      name: name.trim(),
      abbreviation: abbreviation.trim(),
    };

    if (isEditing && unit) {
      // Use direct server action for editing
      setIsSubmitting(true);
      try {
        const result = await updateUnit(unitData, unit.id);
        if (result.success) {
          toast.success("Unit updated successfully!");
          handleClose();
          onSuccess();
        }
      } catch (error) {
        console.error("Update unit error:", error);
        toast.error("Failed to update unit");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Use mutation for creating
      createUnitMutation.mutate(unitData, {
        onSuccess: (data: {
          success: boolean;
          unit: unknown;
          message: string;
        }) => {
          if (data.success) {
            toast.success("Unit created successfully!");
            handleClose();
            onSuccess();
          }
        },
      });
    }
  };

  const handleClose = () => {
    setName("");
    setAbbreviation("");
    onOpenChange(false);
  };

  const isLoading = isSubmitting || createUnitMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Unit" : "Create New Unit"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the unit details below."
              : "Add a new measurement unit to the database. This will be available for all users."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Unit Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Cup, Tablespoon, Gram"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="abbreviation">Abbreviation *</Label>
            <Input
              id="abbreviation"
              value={abbreviation}
              onChange={(e) => setAbbreviation(e.target.value)}
              placeholder="e.g. cup, tbsp, g"
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!name.trim() || !abbreviation.trim() || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : isEditing ? (
                "Update Unit"
              ) : (
                "Create Unit"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
