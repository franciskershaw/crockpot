// YourCrockpotPage.tsx
"use client";

import HeaderToggle from "./components/HeaderToggle/HeaderToggle";
import Menu from "./tabs/Menu/Menu";
import Favourites from "./tabs/Favourites/Favourites";
import MyRecipes from "./tabs/MyRecipes/MyRecipes";
import useProtectedRoute from "@/src/hooks/auth/useProtectedRoute";

const YourCrockpotPage = () => {
  const { user } = useProtectedRoute();

  if (!user) {
    return <div>Loading...</div>;
  }

  const tabTitles = ["Menu", "Favourites", "My Recipes"];

  return (
    <HeaderToggle titles={tabTitles}>
      <Menu />
      <Favourites />
      <MyRecipes />
    </HeaderToggle>
  );
};

export default YourCrockpotPage;
