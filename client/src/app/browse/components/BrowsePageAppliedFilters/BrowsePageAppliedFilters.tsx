import React from 'react';
import { useBrowsePageContext } from '../../context/BrowsePageContext';
import useRecipes from '@/src/hooks/recipes/useRecipes';
import './styles.scss';

type AppliedFiltersProps = {
	recipeNum: number;
};

type FilterItem = {
	_id: string;
	name: string;
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
			case 'cookingTime':
				setCookingTime(cookingTimeMinMax.min, cookingTimeMinMax.max);
				break;
			case 'selectedCategories':
				setSelectedCategories((prev: FilterItem[]) =>
					prev.filter((category: FilterItem) => category._id !== value._id),
				);
				break;
			case 'selectedIngredients':
				setSelectedIngredients((prev: FilterItem[]) =>
					prev.filter((ingredient: FilterItem) => ingredient._id !== value._id),
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
		cookingTimeMin !== cookingTimeMinMax.min ||
		cookingTimeMax !== cookingTimeMinMax.max ||
		selectedCategories.length > 0 ||
		selectedIngredients.length > 0;

	return (
		<div>
			<h3 className="font-bold">
				{recipeNum} {recipeNum === 1 ? 'recipe' : 'recipes'} found:
			</h3>
			{isFilters && (
				<div className="flex overflow-x-auto whitespace-nowrap bg-slate-200 py-1 pl-2 mb-2 rounded">
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
					{selectedCategories.map((category: FilterItem) => (
						<div
							key={category._id}
							className="filter-tag"
							onClick={() => removeFilter('selectedCategories', category)}
						>
							{filterLabel('selectedCategories', category)}
						</div>
					))}
					{selectedIngredients.map((ingredient: FilterItem) => (
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
