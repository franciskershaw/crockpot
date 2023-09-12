"use client";

import Header from "./components/Header/Header";
import useProtectedRoute from "@/src/hooks/auth/useProtectedRoute";

const YourCrockpotPage = () => {
  const { user } = useProtectedRoute();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Header />
    </div>
  );
};

export default YourCrockpotPage;
