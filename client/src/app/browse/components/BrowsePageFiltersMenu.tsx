'use client';

import React, { useEffect } from 'react';
import Switch from '@/src/components/Switch/Switch';
import Slider from '@/src/components/Slider/Slider';
import recipesData from '@/src/data/recipes.json';
import {
	getCategories,
	getMinMaxTimeInMinutes,
} from '@/src/hooks/recipeFunctions';
import { useState } from 'react';
import { Recipe } from '@/src/types/types';
import BrowsePageSearchableCheckboxList from './BrowsePageSearchableCheckboxList';
import useItems from '@/src/hooks/items/useItems';
import useRecipeCategories from '@/src/hooks/recipes/useRecipeCategories';

interface Item {
	_id: string;
	name: string;
}

function BrowsePageFiltersMenu() {
	const recipes: Recipe[] = recipesData;
	const categories = useRecipeCategories();
	const { ingredients } = useItems();
	const cookingTime = getMinMaxTimeInMinutes(recipes);
	const [searchQuery, setSearchQuery] = useState('');

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
					min={cookingTime.min}
					max={cookingTime.max}
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
