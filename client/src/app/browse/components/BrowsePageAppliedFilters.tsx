import React, { useContext } from 'react';
import { useBrowsePageContext } from '../context/BrowsePageContext';

const AppliedFilters = () => {
	const {
		recipeSearchQuery,
		cookingTimeMin,
		cookingTimeMax,
		selectedCategories,
		selectedIngredients,
		setRecipeSearchQuery,
		setCookingTime,
		setSelectedCategories,
		setSelectedIngredients,
	} = useBrowsePageContext();

	// Function to remove a specific filter
	const removeFilter = (filterType, value) => {
		switch (filterType) {
			case 'searchQuery':
				setRecipeSearchQuery('');
				break;
			case 'cookingTime':
				setCookingTime(0, Infinity);
				break;
			case 'selectedCategories':
				setSelectedCategories((prev) => prev.filter((id) => id !== value));
				break;
			case 'selectedIngredients':
				setSelectedIngredients((prev) => prev.filter((id) => id !== value));
				break;
			default:
				// Handle unknown filter types if necessary
				break;
		}
	};

	// Helper function to create a label for the filter
	const filterLabel = (type, value) => {
		switch (type) {
			case 'searchQuery':
				return `Search: "${value}"`;
			case 'cookingTime':
				return `Cooking Time: ${value[0]} - ${value[1]} mins`;
			case 'selectedCategories':
				// Assuming you have a way to get the category name by its ID
				// You would replace `value` with the actual category name
				return `Category: ${value.name}`;
			case 'selectedIngredients':
				// Similarly, replace `value` with the ingredient name
				return `Ingredient: ${value.name}`;
			default:
				return '';
		}
	};

	return (
		<div className="applied-filters">
			{recipeSearchQuery && (
				<div
					className="filter-tag"
					onClick={() => removeFilter('searchQuery', recipeSearchQuery)}
				>
					{filterLabel('searchQuery', recipeSearchQuery)}
					<span className="remove-filter">x</span>
				</div>
			)}
			{(cookingTimeMin !== 0 || cookingTimeMax !== Infinity) && (
				<div
					className="filter-tag"
					onClick={() =>
						removeFilter('cookingTime', [cookingTimeMin, cookingTimeMax])
					}
				>
					{filterLabel('cookingTime', [cookingTimeMin, cookingTimeMax])}
					<span className="remove-filter">x</span>
				</div>
			)}
			{selectedCategories.map((categoryId) => (
				<div
					key={categoryId}
					className="filter-tag"
					onClick={() => removeFilter('selectedCategories', categoryId)}
				>
					{filterLabel('selectedCategories', categoryId)}
					<span className="remove-filter">x</span>
				</div>
			))}
			{selectedIngredients.map((ingredientId) => (
				<div
					key={ingredientId}
					className="filter-tag"
					onClick={() => removeFilter('selectedIngredients', ingredientId)}
				>
					{filterLabel('selectedIngredients', ingredientId)}
					<span className="remove-filter">x</span>
				</div>
			))}
		</div>
	);
};

export default AppliedFilters;
