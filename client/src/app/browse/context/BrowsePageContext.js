'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import useRecipes from '@/src/hooks/recipes/useRecipes';

const BrowsePageContext = createContext();

export const useBrowsePageContext = () => {
	const context = useContext(BrowsePageContext);
	if (!context) {
		throw new Error('useBrowsePage must be used within a BrowsePageProvider');
	}
	return context;
};

export const BrowsePageProvider = ({ children }) => {
	const { cookingTimeMinMax } = useRecipes();
	const [recipeSearchQuery, setRecipeSearchQuery] = useState('');
	const [showOnlyFavourites, setShowOnlyFavourites] = useState(false);
	const [cookingTimeMin, setCookingTimeMin] = useState(0);
	const [cookingTimeMax, setCookingTimeMax] = useState(Infinity);
	const [selectedCategories, setSelectedCategories] = useState([]);
	const [selectedIngredients, setSelectedIngredients] = useState([]);

	useEffect(() => {
		if (cookingTimeMinMax) {
			setCookingTimeMin(cookingTimeMinMax.min);
			setCookingTimeMax(cookingTimeMinMax.max);
		}
	}, [cookingTimeMinMax]);

	const setCookingTime = (min, max) => {
		setCookingTimeMin(min);
		setCookingTimeMax(max);
	};

	const toggleShowOnlyFavourites = () => setShowOnlyFavourites((prev) => !prev);

	const resetFilters = () => {
		setRecipeSearchQuery('');
		setShowOnlyFavourites(false);
		setCookingTimeMin(cookingTimeMinMax.min);
		setCookingTimeMax(cookingTimeMinMax.max);
		setSelectedCategories([]);
		setSelectedIngredients([]);
	};

	const value = {
		recipeSearchQuery,
		showOnlyFavourites,
		cookingTimeMin,
		cookingTimeMax,
		selectedCategories,
		selectedIngredients,
		setRecipeSearchQuery,
		setShowOnlyFavourites,
		toggleShowOnlyFavourites,
		setCookingTime,
		setSelectedCategories,
		setSelectedIngredients,
		resetFilters,
	};

	return (
		<BrowsePageContext.Provider value={value}>
			{children}
		</BrowsePageContext.Provider>
	);
};
