'use client';

import {
	Dispatch,
	FC,
	ReactNode,
	SetStateAction,
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react';

import useRecipes from '@/hooks/recipes/useRecipes';

export interface CheckboxData {
	_id: string;
	name: string;
}

interface BrowsePageContextValue {
	recipeSearchQuery: string;
	showOnlyFavourites: boolean;
	showOnlyMyRecipes: boolean;
	cookingTimeMin: number;
	cookingTimeMax: number;
	selectedCategories: CheckboxData[];
	selectedIngredients: CheckboxData[];
	setRecipeSearchQuery: Dispatch<SetStateAction<string>>;
	setShowOnlyFavourites: (show: boolean) => void;
	toggleShowOnlyFavourites: () => void;
	setShowOnlyMyRecipes: (show: boolean) => void;
	toggleShowOnlyMyRecipes: () => void;
	setCookingTime: (min: number, max: number) => void;
	setSelectedCategories: Dispatch<SetStateAction<CheckboxData[]>>;
	setSelectedIngredients: Dispatch<SetStateAction<CheckboxData[]>>;
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

export const BrowsePageProvider: FC<BrowsePageProviderProps> = ({
	children,
}) => {
	const { cookingTimeMinMax } = useRecipes();
	const [recipeSearchQuery, setRecipeSearchQuery] = useState<string>('');
	const [showOnlyFavourites, setShowOnlyFavourites] = useState<boolean>(false);
	const [showOnlyMyRecipes, setShowOnlyMyRecipes] = useState<boolean>(false);
	const [cookingTimeMin, setCookingTimeMin] = useState<number>(0);
	const [cookingTimeMax, setCookingTimeMax] = useState<number>(Infinity);
	const [selectedCategories, setSelectedCategories] = useState<CheckboxData[]>(
		[],
	);
	const [selectedIngredients, setSelectedIngredients] = useState<
		CheckboxData[]
	>([]);

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

	const resetFilters = useCallback(() => {
		setRecipeSearchQuery('');
		setShowOnlyFavourites(false);
		setShowOnlyMyRecipes(false);
		setCookingTimeMin(cookingTimeMinMax.min);
		setCookingTimeMax(cookingTimeMinMax.max);
		setSelectedCategories([]);
		setSelectedIngredients([]);
	}, [cookingTimeMinMax.max, cookingTimeMinMax.min]);

	const value: BrowsePageContextValue = useMemo(
		() => ({
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
		}),
		[
			recipeSearchQuery,
			showOnlyFavourites,
			showOnlyMyRecipes,
			cookingTimeMin,
			cookingTimeMax,
			selectedCategories,
			selectedIngredients,

			resetFilters,
		],
	);

	return (
		<BrowsePageContext.Provider value={value}>
			{children}
		</BrowsePageContext.Provider>
	);
};
