'use client';

import useRecipes from '@/src/hooks/recipes/useRecipes';
import RecipeCardList from '../../components/RecipeCardList/RecipeCardList';
import BrowsePageFiltersMenu from './components/BrowsePageFiltersMenu';
import BrowsePageSearchBar from './components/BrowsePageSearchBar';
import { useBrowsePageContext } from './context/BrowsePageContext';
import { Category, Ingredient, Recipe } from '@/src/types/types';
import BrowsePageAppliedFilters from './components/BrowsePageAppliedFilters/BrowsePageAppliedFilters';
import useUser from '@/src/hooks/auth/useUser';

type CheckboxData = {
	_id: string;
	name: string;
};

const BrowsePage = () => {
	const { allRecipes } = useRecipes();
	const { user } = useUser();
	const favouriteRecipes = user?.favouriteRecipes || [];

	const {
		recipeSearchQuery,
		showOnlyFavourites,
		cookingTimeMin,
		cookingTimeMax,
		selectedCategories,
		selectedIngredients,
	} = useBrowsePageContext();

	// Filter recipes based on search query, favourites toggle, my recipe toggle, cooking time, categories and ingredients
	const filteredRecipes = allRecipes.filter((recipe: Recipe) => {
		const isInFavourites =
			!showOnlyFavourites || favouriteRecipes.includes(recipe._id);

		return (
			isInFavourites &&
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
						(ing: Ingredient) => ing._id === selectedIngredient._id,
					),
				))
		);
	});

	return (
		<>
			<div className="container flex py-4 space-x-2 bg-white bg-opacity-90 fixed z-10 md:hidden">
				<BrowsePageSearchBar />
			</div>
			<div className="container !px-0 md:flex">
				<div className="container pt-20 md:w-1/3 md:bg-slate-200 md:border-4 md:border-slate-200 md:pt-2 md:mx-4 xl:ml-0 md:my-0 md:max-h-[85vh] md:overflow-scroll md:sticky md:top-[110px]">
					<div className="hidden md:block">
						<BrowsePageFiltersMenu />
					</div>
				</div>
				<div className="container md:w-2/3 md:pl-4">
					<div className="hidden md:flex space-x-2 mb-4">
						<BrowsePageSearchBar />
					</div>
					<BrowsePageAppliedFilters recipeNum={filteredRecipes.length} />
					<RecipeCardList recipes={filteredRecipes} />
				</div>
			</div>
		</>
	);
};

export default BrowsePage;
