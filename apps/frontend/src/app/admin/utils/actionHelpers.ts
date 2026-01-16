import { toast } from "sonner";

export interface ActionHandler<T> {
  label: string;
  action: (items: T[]) => Promise<void>;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  requiresConfirmation?: boolean;
  confirmationMessage?: string;
}

export interface BulkActionHandler<T> {
  label: string;
  action: (items: T[]) => Promise<void>;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  requiresConfirmation?: boolean;
  confirmationMessage?: string;
}

/**
 * Creates a bulk action handler with confirmation and error handling
 */
export function createBulkActionHandler<T>(
  options: BulkActionHandler<T>
): (items: T[], onSuccess?: () => void) => Promise<void> {
  return async (items: T[], onSuccess?: () => void) => {
    if (items.length === 0) {
      toast.error("Please select items to perform this action");
      return;
    }

    if (options.requiresConfirmation) {
      const confirmed = window.confirm(
        options.confirmationMessage ||
          `Are you sure you want to ${options.label.toLowerCase()} ${
            items.length
          } item(s)?`
      );
      if (!confirmed) return;
    }

    try {
      await options.action(items);
      toast.success(
        `${items.length} item(s) ${options.label.toLowerCase()}d successfully`
      );
      onSuccess?.();
    } catch (error) {
      console.error(`Bulk ${options.label} error:`, error);
      toast.error(`Failed to ${options.label.toLowerCase()} items`);
    }
  };
}

/**
 * Creates an individual action handler with confirmation and error handling
 */
export function createActionHandler<T>(
  options: ActionHandler<T>
): (item: T, onSuccess?: () => void) => Promise<void> {
  return async (item: T, onSuccess?: () => void) => {
    if (options.requiresConfirmation) {
      const confirmed = window.confirm(
        options.confirmationMessage ||
          `Are you sure you want to ${options.label.toLowerCase()} this item?`
      );
      if (!confirmed) return;
    }

    try {
      await options.action([item]);
      toast.success(`Item ${options.label.toLowerCase()}d successfully`);
      onSuccess?.();
    } catch (error) {
      console.error(`${options.label} error:`, error);
      toast.error(`Failed to ${options.label.toLowerCase()} item`);
    }
  };
}
