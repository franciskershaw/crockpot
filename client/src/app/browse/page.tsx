'use client';

import useRecipes from '@/src/hooks/recipes/useRecipes';
import RecipeCardList from '../../components/RecipeCardList/RecipeCardList';
import BrowsePageFiltersMenu from './components/BrowsePageFiltersMenu';
import BrowsePageSearchBar from './components/BrowsePageSearchBar';
import { useBrowsePageContext } from './context/BrowsePageContext';
import { useEffect } from 'react';
import { Category, Ingredient, Recipe } from '@/src/types/types';
import BrowsePageAppliedFilters from './components/BrowsePageAppliedFilters/BrowsePageAppliedFilters';

type CheckboxData = {
	_id: string;
	name: string;
};

const BrowsePage = () => {
	const { allRecipes } = useRecipes();

	const {
		recipeSearchQuery,
		cookingTimeMin,
		cookingTimeMax,
		selectedCategories,
		selectedIngredients,
	} = useBrowsePageContext();

	useEffect(() => {
		console.log(
			recipeSearchQuery,
			cookingTimeMin,
			cookingTimeMax,
			selectedCategories,
			selectedIngredients,
		);
	}, [
		recipeSearchQuery,
		cookingTimeMin,
		cookingTimeMax,
		selectedCategories,
		selectedIngredients,
	]);

	// Filter recipes based on search query, cooking time, categories and ingredients
	const filteredRecipes = allRecipes.filter((recipe: Recipe) => {
		return (
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
				<div className="container pt-20 md:w-1/3 md:bg-slate-200 md:border-4 md:border-slate-200 md:pt-2 md:mx-4 md:my-0 md:max-h-[85vh] md:overflow-scroll md:sticky md:top-[110px]">
					<div className="hidden md:block">
						<BrowsePageFiltersMenu />
					</div>
				</div>
				<div className="container md:w-2/3 md:pl-4">
					<div className="hidden md:flex space-x-2 mb-4">
						<BrowsePageSearchBar />
					</div>
					<BrowsePageAppliedFilters />
					<RecipeCardList recipes={filteredRecipes} />
				</div>
			</div>
		</>
	);
};

export default BrowsePage;
