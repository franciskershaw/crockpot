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

	const value = {
		recipeSearchQuery,
		setRecipeSearchQuery,
	};

	return (
		<BrowsePageContext.Provider value={value}>
			{children}
		</BrowsePageContext.Provider>
	);
};
