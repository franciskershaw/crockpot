'use client';

import React, { createContext, useContext, useState } from 'react';

const BrowsePageContext = createContext();

export const useBrowsePageContext = () => {
	const context = useContext(BrowsePageContext);
	if (!context) {
		throw new Error('useBrowsePage must be used within a BrowsePageProvider');
	}
	return context;
};

export const BrowsePageProvider = ({ children }) => {
	const [recipeSearchQuery, setRecipeSearchQuery] = useState('');
	const [cookingTimeMin, setCookingTimeMin] = useState(0);
	const [cookingTimeMax, setCookingTimeMax] = useState(Infinity);

	const setCookingTime = (min, max) => {
		setCookingTimeMin(min);
		setCookingTimeMax(max);
	};

	const value = {
		recipeSearchQuery,
		cookingTimeMin,
		cookingTimeMax,
		setRecipeSearchQuery,
		setCookingTime,
	};

	return (
		<BrowsePageContext.Provider value={value}>
			{children}
		</BrowsePageContext.Provider>
	);
};
