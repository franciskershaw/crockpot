import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useUser from "@/src/hooks/auth/useUser";

const useProtectedRoute = (redirectTo = "/login", adminOnly = false) => {
  const router = useRouter();
  const { user, fetchingUser } = useUser();

  useEffect(() => {
    if (fetchingUser) return;

    if (!user) {
      router.push(redirectTo);
    } else if (adminOnly && !user.isAdmin) {
      router.push("/your-crockpot");
    }
  }, [user, fetchingUser, router, redirectTo, adminOnly]);

  return { user, isAdmin: user?.isAdmin || false, fetchingUser };
};

export default useProtectedRoute;
