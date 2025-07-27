import { signOut } from "next-auth/react";
import { useCallback } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function useLogout() {
  const router = useRouter();
  return useCallback(
    async (callback?: () => void) => {
      try {
        // Call signOut directly from client side - this automatically updates all useSession() hooks
        await signOut({ redirect: false });
        // Refresh the router to ensure server components update
        router.refresh();
        toast.success("Logged out successfully");
        callback?.();
      } catch (error) {
        console.error("Logout failed:", error);
      }
    },
    [router]
  );
}
