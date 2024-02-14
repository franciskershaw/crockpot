'use client';

import { Category, Ingredient, Recipe } from '@/types/types';

import useUser from '@/hooks/auth/useUser';
import useRecipes from '@/hooks/recipes/useRecipes';

import {
	CheckboxData,
	useBrowsePageContext,
} from './context/BrowsePageContext';

import BrowsePageAppliedFilters from './components/BrowsePageAppliedFilters/BrowsePageAppliedFilters';
import BrowsePageFiltersMenu from './components/BrowsePageFiltersMenu';
import BrowsePageSearchBar from './components/BrowsePageSearchBar';
import AddRecipe from '@/components/AddRecipe/AddRecipe';
import EmptyState from '@/components/EmptyState/EmptyState';
import LoadingSpinner from '@/components/Loading/LoadingSpinner';
import Modal from '@/components/Modal/Modal';
import { useModal } from '@/components/Modal/ModalContext';
import RecipeCardList from '@/components/RecipeCardList/RecipeCardList';
import RecipeCardModal from '@/components/RecipeCardModal/RecipeCardModal';

const BrowsePage = () => {
	const { shuffledRecipes: allRecipes, isFetching } = useRecipes();
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

	const { selectedRecipe, setSelectedRecipe } = useModal();

	// Filter recipes based on search query, favourites toggle, my recipe toggle, cooking time, categories and ingredients
	const filteredRecipes = allRecipes.filter((recipe: Recipe) => {
		const isInFavourites =
			!showOnlyFavourites || favouriteRecipes.includes(recipe._id);
		const isMyRecipe =
			!showOnlyMyRecipes || (user && recipe.createdBy._id === user._id);

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
		<>
			{isFetching ? <LoadingSpinner /> : null}
			<div className="container container--1-2">
				<div className="container--1-2__1">
					<div className="container--1-2__1__sticky-menu mt-4">
						<BrowsePageFiltersMenu />
					</div>
				</div>
				<div className="container--1-2__2">
					<div className="container--1-2__2__sticky-menu">
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
			{selectedRecipe ? (
				<Modal
					title={
						<div className="flex">
							<div className="lowercase">
								{selectedRecipe.timeInMinutes} mins
							</div>
							{selectedRecipe.categories.map((category, index) => (
								<div key={index} className="ml-2 pl-2 border-l border-white">
									{category.name}
								</div>
							))}
						</div>
					}
					name="RecipeModal"
					onClose={() => setSelectedRecipe(null)}
				>
					<RecipeCardModal recipe={selectedRecipe} />
				</Modal>
			) : null}
			<Modal name="AddRecipe" title="Add new recipe">
				<AddRecipe />
			</Modal>
		</>
	);
};

export default BrowsePage;
