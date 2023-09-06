// hooks/useProtectedRoute.js
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useUser from "@/src/hooks/auth/useUser";

const useProtectedRoute = (redirectTo = "/login") => {
  const router = useRouter();
  const { user, fetchingUser } = useUser();

  useEffect(() => {
    if (!user && !fetchingUser) {
      router.push(redirectTo);
    }
  }, [user, router, redirectTo, fetchingUser]);

  return { user };
};

export default useProtectedRoute;
