import React from 'react';
import {
	CheckboxData,
	useBrowsePageContext,
} from '../../context/BrowsePageContext';
import useRecipes from '@/src/hooks/recipes/useRecipes';
import './styles.scss';

type AppliedFiltersProps = {
	recipeNum: number;
};

const AppliedFilters: React.FC<AppliedFiltersProps> = ({ recipeNum }) => {
	const {
		recipeSearchQuery,
		cookingTimeMin,
		cookingTimeMax,
		selectedCategories,
		selectedIngredients,
		setRecipeSearchQuery,
		showOnlyFavourites,
		setShowOnlyFavourites,
		showOnlyMyRecipes,
		setShowOnlyMyRecipes,
		setCookingTime,
		setSelectedCategories,
		setSelectedIngredients,
	} = useBrowsePageContext();

	const { cookingTimeMinMax } = useRecipes();

	// Function to remove a specific filter
	const removeFilter = (filterType: string, value?: any) => {
		switch (filterType) {
			case 'searchQuery':
				setRecipeSearchQuery('');
				break;
			case 'favourites':
				setShowOnlyFavourites(false);
				break;
			case 'myRecipes':
				setShowOnlyMyRecipes(false);
				break;
			case 'cookingTime':
				setCookingTime(cookingTimeMinMax.min, cookingTimeMinMax.max);
				break;
			case 'selectedCategories':
				setSelectedCategories((prev: CheckboxData[]) =>
					prev.filter((category: CheckboxData) => category._id !== value._id),
				);
				break;
			case 'selectedIngredients':
				setSelectedIngredients((prev: CheckboxData[]) =>
					prev.filter(
						(ingredient: CheckboxData) => ingredient._id !== value._id,
					),
				);
				break;
			default:
				break;
		}
	};

	// Helper function to create a label for the filter
	const filterLabel = (type: string, value: any) => {
		switch (type) {
			case 'searchQuery':
				return `${value}`;
			case 'cookingTime':
				return `${value[0]} - ${value[1]} mins`;
			case 'selectedCategories':
				return `${value.name}`;
			case 'selectedIngredients':
				return `${value.name}`;
			default:
				return '';
		}
	};

	const isFilters =
		recipeSearchQuery !== '' ||
		showOnlyFavourites === true ||
		showOnlyMyRecipes === true ||
		cookingTimeMin !== cookingTimeMinMax.min ||
		cookingTimeMax !== cookingTimeMinMax.max ||
		selectedCategories.length > 0 ||
		selectedIngredients.length > 0;

	return (
		<div>
			<h2 className="font-bold mb-2">
				{recipeNum} {recipeNum === 1 ? 'recipe' : 'recipes'} found:
			</h2>
			{isFilters && (
				<div className="flex overflow-x-auto whitespace-nowrap bg-black/10 py-1 pl-2 mb-2 rounded">
					{recipeSearchQuery && (
						<div
							className="filter-tag"
							onClick={() => removeFilter('searchQuery', recipeSearchQuery)}
						>
							{filterLabel('searchQuery', recipeSearchQuery)}
						</div>
					)}
					{showOnlyFavourites && (
						<div
							className="filter-tag"
							onClick={() => removeFilter('favourites')}
						>
							My Favourites
						</div>
					)}
					{showOnlyMyRecipes && (
						<div
							className="filter-tag"
							onClick={() => removeFilter('myRecipes')}
						>
							My Recipes
						</div>
					)}
					{(cookingTimeMin !== cookingTimeMinMax.min ||
						cookingTimeMax !== cookingTimeMinMax.max) && (
						<div
							className="filter-tag"
							onClick={() =>
								removeFilter('cookingTime', [cookingTimeMin, cookingTimeMax])
							}
						>
							{filterLabel('cookingTime', [cookingTimeMin, cookingTimeMax])}
						</div>
					)}
					{selectedCategories.map((category: CheckboxData) => (
						<div
							key={category._id}
							className="filter-tag"
							onClick={() => removeFilter('selectedCategories', category)}
						>
							{filterLabel('selectedCategories', category)}
						</div>
					))}
					{selectedIngredients.map((ingredient: CheckboxData) => (
						<div
							key={ingredient._id}
							className="filter-tag"
							onClick={() => removeFilter('selectedIngredients', ingredient)}
						>
							{filterLabel('selectedIngredients', ingredient)}
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default AppliedFilters;
