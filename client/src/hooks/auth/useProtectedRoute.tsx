import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useUser from "@/src/hooks/auth/useUser";

const useProtectedRoute = (redirectTo = "/login", adminOnly = false) => {
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    if (!user || (adminOnly && !user.isAdmin)) {
      router.push(redirectTo);
    }
  }, [user, router, redirectTo, adminOnly]);

  return { user, isAdmin: user?.isAdmin || false };
};

export default useProtectedRoute;
