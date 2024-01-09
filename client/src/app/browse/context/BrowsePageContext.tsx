'use client';

import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from 'react';
import useRecipes from '@/src/hooks/recipes/useRecipes';

interface BrowsePageContextValue {
	recipeSearchQuery: string;
	showOnlyFavourites: boolean;
	showOnlyMyRecipes: boolean;
	cookingTimeMin: number;
	cookingTimeMax: number;
	selectedCategories: string[];
	selectedIngredients: string[];
	setRecipeSearchQuery: (query: string) => void;
	setShowOnlyFavourites: (show: boolean) => void;
	toggleShowOnlyFavourites: () => void;
	setShowOnlyMyRecipes: (show: boolean) => void;
	toggleShowOnlyMyRecipes: () => void;
	setCookingTime: (min: number, max: number) => void;
	setSelectedCategories: (categories: string[]) => void;
	setSelectedIngredients: (ingredients: string[]) => void;
	resetFilters: () => void;
}

interface BrowsePageProviderProps {
	children: ReactNode;
}

const BrowsePageContext = createContext<BrowsePageContextValue | undefined>(
	undefined,
);

export const useBrowsePageContext = (): BrowsePageContextValue => {
	const context = useContext(BrowsePageContext);
	if (!context) {
		throw new Error('useBrowsePage must be used within a BrowsePageProvider');
	}
	return context;
};

export const BrowsePageProvider: React.FC<BrowsePageProviderProps> = ({
	children,
}) => {
	const { cookingTimeMinMax } = useRecipes();
	const [recipeSearchQuery, setRecipeSearchQuery] = useState<string>('');
	const [showOnlyFavourites, setShowOnlyFavourites] = useState<boolean>(false);
	const [showOnlyMyRecipes, setShowOnlyMyRecipes] = useState<boolean>(false);
	const [cookingTimeMin, setCookingTimeMin] = useState<number>(0);
	const [cookingTimeMax, setCookingTimeMax] = useState<number>(Infinity);
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);

	useEffect(() => {
		if (cookingTimeMinMax) {
			setCookingTimeMin(cookingTimeMinMax.min);
			setCookingTimeMax(cookingTimeMinMax.max);
		}
	}, [cookingTimeMinMax]);

	const setCookingTime = (min: number, max: number) => {
		setCookingTimeMin(min);
		setCookingTimeMax(max);
	};

	const toggleShowOnlyFavourites = () => setShowOnlyFavourites((prev) => !prev);
	const toggleShowOnlyMyRecipes = () => setShowOnlyMyRecipes((prev) => !prev);

	const resetFilters = () => {
		setRecipeSearchQuery('');
		setShowOnlyFavourites(false);
		setShowOnlyMyRecipes(false);
		setCookingTimeMin(cookingTimeMinMax.min);
		setCookingTimeMax(cookingTimeMinMax.max);
		setSelectedCategories([]);
		setSelectedIngredients([]);
	};

	const value: BrowsePageContextValue = {
		recipeSearchQuery,
		showOnlyFavourites,
		showOnlyMyRecipes,
		cookingTimeMin,
		cookingTimeMax,
		selectedCategories,
		selectedIngredients,
		setRecipeSearchQuery,
		setShowOnlyFavourites,
		toggleShowOnlyFavourites,
		setShowOnlyMyRecipes,
		toggleShowOnlyMyRecipes,
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
