"use client";

import { useCallback } from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import useUser from "@/hooks/user/useUser";

interface LogoutButtonProps {
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "destructive";
  className?: string;
  children?: React.ReactNode;
  onLogout?: () => void; // Optional callback for additional actions like closing mobile menu
}

export default function LogoutButton({
  variant = "outline",
  className,
  children = "Sign Out",
  onLogout,
}: LogoutButtonProps) {
  const router = useRouter();
  const { clearUser } = useUser();
  const handleLogout = useCallback(async () => {
    try {
      // Call signOut directly from client side - this automatically updates all useSession() hooks
      await clearUser();
      // Refresh the router to ensure server components update
      router.refresh();
      toast.success("Logged out successfully");
      // Call optional callback (e.g., to close mobile menu)
      onLogout?.();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, [router, onLogout, clearUser]);

  return (
    <Button onClick={handleLogout} variant={variant} className={className}>
      {children}
    </Button>
  );
}
