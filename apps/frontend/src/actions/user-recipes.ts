// "use server";

// // import { withAuthentication } from "@/lib/action-helpers";
// import { getUserRecipeCount as getUserRecipeCountFromDAL } from "@/data/recipes/getUserRecipeCount";
// import { getUserCreatedRecipes as getUserCreatedRecipesFromDAL } from "@/data/user/getUserRecipes";

// // Get user's created recipes
// export const getUserCreatedRecipes = withAuthentication(async (userId) => {
//   return await getUserCreatedRecipesFromDAL(userId);
// });

// // Get user's recipe count
// export const getUserRecipeCount = withAuthentication(async (userId) => {
//   return await getUserRecipeCountFromDAL(userId);
// });
