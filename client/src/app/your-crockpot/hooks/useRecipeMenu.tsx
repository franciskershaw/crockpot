import { useQuery } from "@tanstack/react-query";
import useAxios from "@/src/hooks/axios/useAxios";
import { queryKeys } from "@/src/providers/Providers";
import useUser from "@/src/hooks/auth/useUser";
import { useState, useEffect } from "react";
import { MenuRecipe } from "@/src/types/types";

const useRecipeMenu = () => {
  const [recipeMenuRecipes, setRecipeMenuRecipes] = useState([]);

  const api = useAxios();
  const { user } = useUser();

  const getRecipeMenu = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${user?.accessToken}`,
      },
    };

    const response = await api.get(`/api/users/recipeMenu`, config);
    return response.data;
  };

  const { data: recipeMenu = [] } = useQuery(
    [queryKeys.recipeMenu],
    getRecipeMenu
  );

  useEffect(() => {
    if (recipeMenu.length) {
      setRecipeMenuRecipes(
        recipeMenu.map((recipe: MenuRecipe) => recipe.recipe)
      );
    }
  }, [recipeMenu]);

  return { recipeMenu, recipeMenuRecipes };
};

export default useRecipeMenu;
