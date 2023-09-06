"use client";

import Header from "./components/Header/Header";
import useProtectedRoute from "@/src/hooks/auth/useProtectedRoute";

const YourCrockpotPage = () => {
  const { user } = useProtectedRoute();

  if (!user) {
    return null;
  }

  return (
    <div>
      <Header />
    </div>
  );
};

export default YourCrockpotPage;
