'use client';

import React, { useEffect } from 'react';
import Switch from '@/src/components/Switch/Switch';
import Slider from '@/src/components/Slider/Slider';
import BrowsePageSearchableCheckboxList from './BrowsePageSearchableCheckboxList';
import useItems from '@/src/hooks/items/useItems';
import useRecipeCategories from '@/src/hooks/recipes/useRecipeCategories';
import { useBrowsePageContext } from '../context/BrowsePageContext';
import useRecipes from '@/src/hooks/recipes/useRecipes';

interface Item {
	_id: string;
	name: string;
}

function BrowsePageFiltersMenu() {
	const { cookingTimeMinMax } = useRecipes();

	console.log(cookingTimeMinMax);

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
					onChange={(values: number[]) => console.log(values)}
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
