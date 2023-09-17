'use client';

import React from 'react';
import Switch from '@/src/components/Switch/Switch';
import Slider from '@/src/components/Slider/Slider';
import BrowsePageSearchableCheckboxList from './BrowsePageSearchableCheckboxList';
import useItems from '@/src/hooks/items/useItems';
import useRecipeCategories from '@/src/hooks/recipes/useRecipeCategories';
import useRecipes from '@/src/hooks/recipes/useRecipes';
import { useBrowsePageContext } from '../context/BrowsePageContext';

interface Item {
	_id: string;
	name: string;
}

function BrowsePageFiltersMenu() {
	const { setCookingTime } = useBrowsePageContext();
	const { cookingTimeMinMax } = useRecipes();
	const categories = useRecipeCategories();
	const { ingredients } = useItems();

	const extractIdAndName = (items: Item[]): { _id: string; name: string }[] => {
		return items.map(({ _id, name }) => ({ _id, name }));
	};

	const simplifiedIngredients = extractIdAndName(ingredients);
	const simplifiedCategories = extractIdAndName(categories.recipeCategories);

	return (
		<div className="space-y-3">
			<Switch label="My Favourites (3)" />
			<hr />
			<Switch label="My Recipes (2)" />
			<hr />
			<div>
				<h3>Serving Time</h3>
				<Slider
					min={cookingTimeMinMax.min}
					max={cookingTimeMinMax.max}
					onChange={(values: number[]) => {
						const [newMin, newMax] = values;
						setCookingTime(newMin, newMax); // <-- Update the context state here
					}}
				/>
			</div>
			<hr />
			<BrowsePageSearchableCheckboxList
				title={'Categories'}
				placeholderText={'Search for a category...'}
				checkboxes={simplifiedCategories}
			/>
			<hr />
			<BrowsePageSearchableCheckboxList
				title={'Ingredients'}
				placeholderText={'Search for a ingredient...'}
				checkboxes={simplifiedIngredients}
			/>
		</div>
	);
}

export default BrowsePageFiltersMenu;
