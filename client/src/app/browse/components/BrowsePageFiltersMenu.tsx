'use client';

import React from 'react';
import Switch from '@/src/components/Switch/Switch';
import Slider from '@/src/components/Slider/Slider';
import Checkbox from '@/src/components/Checkbox/Checkbox';
import SearchBar from '@/src/components/FormSearchBar/SearchBar';
import recipesData from '@/src/data/recipes.json';
import {
	getCategories,
	getIngredients,
	getMinMaxTimeInMinutes,
} from '@/src/hooks/recipeFunctions';
import { useState } from 'react';
import { Recipe } from '@/src/types/types';
import BrowsePageSearchableCheckboxList from './BrowsePageSearchableCheckboxList';

function BrowsePageFiltersMenu() {
	const recipes: Recipe[] = recipesData;
	const categories = getCategories(recipes);
	const ingredients = getIngredients(recipes);
	const cookingTime = getMinMaxTimeInMinutes(recipes);
	const [searchQuery, setSearchQuery] = useState('');

	return (
		<div className="space-y-3">
			<Switch
				label="My Favourites (3)"
				onChange={() => console.log('Hello!')}
			/>
			<hr />
			<Switch label="My Recipes (2)" onChange={() => console.log('Hello!')} />
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
				checkboxes={categories}
			/>
			{/* <hr />
			<BrowsePageSearchableCheckboxList
				title={'Ingredients'}
				placeholderText={'Search for a ingredient...'}
				checkboxes={ingredients}
			/> */}
		</div>
	);
}

export default BrowsePageFiltersMenu;
