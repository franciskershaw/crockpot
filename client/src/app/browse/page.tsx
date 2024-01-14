'use client';

import EmptyState from '@/src/components/EmptyState/EmptyState';
import RecipeCardList from '@/src/components/RecipeCardList/RecipeCardList';
import useUser from '@/src/hooks/auth/useUser';
import useRecipes from '@/src/hooks/recipes/useRecipes';
import { Category, Ingredient, Recipe } from '@/src/types/types';

import {
	CheckboxData,
	useBrowsePageContext,
} from './context/BrowsePageContext';

import BrowsePageAppliedFilters from './components/BrowsePageAppliedFilters/BrowsePageAppliedFilters';
import BrowsePageFiltersMenu from './components/BrowsePageFiltersMenu';
import BrowsePageSearchBar from './components/BrowsePageSearchBar';

const BrowsePage = () => {
	const { shuffledRecipes: allRecipes } = useRecipes();
	const { user } = useUser();
	const favouriteRecipes = user?.favouriteRecipes || [];

	const {
		recipeSearchQuery,
		showOnlyFavourites,
		showOnlyMyRecipes,
		cookingTimeMin,
		cookingTimeMax,
		selectedCategories,
		selectedIngredients,
	} = useBrowsePageContext();

	// Filter recipes based on search query, favourites toggle, my recipe toggle, cooking time, categories and ingredients
	const filteredRecipes = allRecipes.filter((recipe: Recipe) => {
		const isInFavourites =
			!showOnlyFavourites || favouriteRecipes.includes(recipe._id);
		const isMyRecipe =
			!showOnlyMyRecipes || (user && recipe.createdBy === user._id);

		return (
			isInFavourites &&
			isMyRecipe &&
			recipe.name.toLowerCase().includes(recipeSearchQuery.toLowerCase()) &&
			recipe.timeInMinutes >= cookingTimeMin &&
			recipe.timeInMinutes <= cookingTimeMax &&
			(selectedCategories.length === 0 ||
				selectedCategories.every((selectedCategory: CheckboxData) =>
					recipe.categories.some(
						(cat: Category) => cat._id === selectedCategory._id,
					),
				)) &&
			(selectedIngredients.length === 0 ||
				selectedIngredients.every((selectedIngredient: CheckboxData) =>
					recipe.ingredients.some(
						(ing: Ingredient) => ing._id._id === selectedIngredient._id,
					),
				))
		);
	});

	return (
		<div className="container container--1-2">
			<div className="hidden md:block relative p-2 ">
				<div className="bg-white/90 sticky top-0 left-0 right-0 z-searchBar border border-black">
					<BrowsePageFiltersMenu />
				</div>
			</div>
			<div className="relative p-2">
				<div className="bg-white/90 sticky top-0 left-0 right-0 z-searchBar">
					<BrowsePageSearchBar />
					<BrowsePageAppliedFilters recipeNum={filteredRecipes.length} />
				</div>
				{filteredRecipes.length !== 0 ? (
					<RecipeCardList recipes={filteredRecipes} />
				) : (
					<EmptyState
						title="No results?"
						description="Try removing some of your filters or searching for something else."
					/>
				)}
			</div>
		</div>
	);
};

export default BrowsePage;
