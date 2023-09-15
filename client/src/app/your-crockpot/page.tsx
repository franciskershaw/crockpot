"use client";

import HeaderToggle from "./components/HeaderToggle/HeaderToggle";
import useProtectedRoute from "@/src/hooks/auth/useProtectedRoute";

const YourCrockpotPage = () => {
  const { user } = useProtectedRoute();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <HeaderToggle />
    </>
  );
};

export default YourCrockpotPage;
