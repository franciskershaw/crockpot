"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
}

export default function LogoutButton({
  variant = "outline",
  className,
  children = "Sign Out",
}: LogoutButtonProps) {
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    try {
      // Call signOut directly from client side - this automatically updates all useSession() hooks
      await signOut({ redirect: false });
      // Refresh the router to ensure server components update
      router.refresh();
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, [router]);

  return (
    <Button onClick={handleLogout} variant={variant} className={className}>
      {children}
    </Button>
  );
}
