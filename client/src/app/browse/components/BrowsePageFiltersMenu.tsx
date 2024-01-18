'use client';

import React from 'react';

import { Recipe } from '@/src/types/types';

import useUser from '@/src/hooks/auth/useUser';
import useItems from '@/src/hooks/items/useItems';
import useRecipeCategories from '@/src/hooks/recipes/useRecipeCategories';
import useRecipes from '@/src/hooks/recipes/useRecipes';

import {
	CheckboxData,
	useBrowsePageContext,
} from '../context/BrowsePageContext';

import Slider from '@/src/components/Slider/Slider';
import Switch from '@/src/components/Switch/Switch';

import BrowsePageSearchableCheckboxList from './BrowsePageSearchableCheckboxList';

function BrowsePageFiltersMenu() {
	const {
		showOnlyFavourites,
		toggleShowOnlyFavourites,
		showOnlyMyRecipes,
		toggleShowOnlyMyRecipes,
		cookingTimeMin,
		cookingTimeMax,
		setCookingTime,
		setSelectedCategories,
		setSelectedIngredients,
	} = useBrowsePageContext();
	const { allRecipes, cookingTimeMinMax } = useRecipes();
	const categories = useRecipeCategories();
	const { ingredients } = useItems();
	const { user } = useUser();

	const myRecipes = user
		? allRecipes.filter((recipe: Recipe) => recipe.createdBy === user._id)
		: null;

	const handleCategoryCheckboxChange = (
		category: CheckboxData,
		isChecked: boolean,
	) => {
		setSelectedCategories((prevSelected: CheckboxData[]) => {
			if (isChecked) {
				return [...prevSelected, category];
			} else {
				return prevSelected.filter(
					(item: CheckboxData) => item._id !== category._id,
				);
			}
		});
	};

	const handleIngredientCheckboxChange = (
		ingredient: CheckboxData,
		isChecked: boolean,
	) => {
		setSelectedIngredients((prevSelected: CheckboxData[]) => {
			if (isChecked) {
				return [...prevSelected, ingredient];
			} else {
				return prevSelected.filter(
					(item: CheckboxData) => item._id !== ingredient._id,
				);
			}
		});
	};

	const extractIdAndName = (
		items: CheckboxData[],
	): { _id: string; name: string }[] => {
		return items.map(({ _id, name }) => ({ _id, name }));
	};

	const simplifiedIngredients = extractIdAndName(ingredients);
	const simplifiedCategories = extractIdAndName(categories.recipeCategories);

	return (
		<div className="space-y-3 p-4 md:px-2 md:py-3">
			{user && (
				<>
					<Switch
						label={`My Favourites (${user.favouriteRecipes.length})`}
						checked={showOnlyFavourites}
						onChange={toggleShowOnlyFavourites}
					/>
					<hr />
					<Switch
						label={`My Recipes (${myRecipes ? myRecipes.length : '0'})`}
						checked={showOnlyMyRecipes}
						onChange={toggleShowOnlyMyRecipes}
					/>
					<hr />
				</>
			)}
			<div>
				<h3>Serving Time</h3>
				<Slider
					min={cookingTimeMinMax.min}
					max={cookingTimeMinMax.max}
					value={[cookingTimeMin, cookingTimeMax]}
					onChange={(values: number[]) => {
						const [newMin, newMax] = values;
						setCookingTime(newMin, newMax);
					}}
				/>
			</div>
			<hr />
			<BrowsePageSearchableCheckboxList
				title={'Categories'}
				placeholderText={'Search for a category...'}
				checkboxes={simplifiedCategories}
				onCheckboxChange={handleCategoryCheckboxChange}
				listType="category"
			/>
			<hr />
			<BrowsePageSearchableCheckboxList
				title={'Ingredients'}
				placeholderText={'Search for a ingredient...'}
				checkboxes={simplifiedIngredients}
				onCheckboxChange={handleIngredientCheckboxChange}
				listType="ingredient"
			/>
		</div>
	);
}

export default BrowsePageFiltersMenu;
