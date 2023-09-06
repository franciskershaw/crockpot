"use client";

import useProtectedRoute from "@/src/hooks/auth/useProtectedRoute";

const AdminPage = () => {
  const { isAdmin } = useProtectedRoute("/your-crockpot");

  if (!isAdmin) {
    return null;
  }

  return <div>Admin page</div>;
};

export default AdminPage;
