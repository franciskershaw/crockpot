'use client';

import React from 'react';
import Switch from '@/src/components/Switch/Switch';
import Slider from '@/src/components/Slider/Slider';
import BrowsePageSearchableCheckboxList from './BrowsePageSearchableCheckboxList';
import useItems from '@/src/hooks/items/useItems';
import useRecipeCategories from '@/src/hooks/recipes/useRecipeCategories';
import useRecipes from '@/src/hooks/recipes/useRecipes';
import { useBrowsePageContext } from '../context/BrowsePageContext';
import useUser from '@/src/hooks/auth/useUser';

type CheckboxData = {
	_id: string;
	name: string;
};

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
		? allRecipes.filter((recipe) => recipe.createdBy === user._id)
		: null;

	const handleCategoryCheckboxChange = (
		categoryId: string,
		isChecked: boolean,
	) => {
		setSelectedCategories((prevSelected: string[]) => {
			if (isChecked) {
				return [...prevSelected, categoryId];
			} else {
				return prevSelected.filter((id: string) => id !== categoryId);
			}
		});
	};

	const handleIngredientCheckboxChange = (
		ingredientId: string,
		isChecked: boolean,
	) => {
		setSelectedIngredients((prevSelected: string[]) => {
			if (isChecked) {
				return [...prevSelected, ingredientId];
			} else {
				return prevSelected.filter((id: string) => id !== ingredientId);
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
		<div className='space-y-3'>
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
				listType='category'
			/>
			<hr />
			<BrowsePageSearchableCheckboxList
				title={'Ingredients'}
				placeholderText={'Search for a ingredient...'}
				checkboxes={simplifiedIngredients}
				onCheckboxChange={handleIngredientCheckboxChange}
				listType='ingredient'
			/>
		</div>
	);
}

export default BrowsePageFiltersMenu;
