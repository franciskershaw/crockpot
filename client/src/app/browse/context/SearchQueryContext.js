'use client';

import React, { createContext, useContext, useState } from 'react';

const SearchQueryContext = createContext();

export const useSearchQuery = () => {
	const context = useContext(SearchQueryContext);
	if (!context) {
		throw new Error('useSearchQuery must be used within a SearchQueryProvider');
	}
	return context;
};

export const SearchQueryProvider = ({ children }) => {
	const [searchQuery, setSearchQuery] = useState('');
	const value = { searchQuery, setSearchQuery };

	return (
		<SearchQueryContext.Provider value={value}>
			{children}
		</SearchQueryContext.Provider>
	);
};
