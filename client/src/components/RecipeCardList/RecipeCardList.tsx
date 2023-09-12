'use client';

import React from 'react';
import RecipeCard from '../RecipeCard/RecipeCard';
import recipesData from '../../data/recipes.json';
import './styles.scss';
import { v4 as uuidv4 } from 'uuid';

function RecipeCardList() {
	const recipes = recipesData;

	return (
		<div className="tw">
			<h3 className="font-bold mb-2">{recipes.length} recipes:</h3>
			<div className="recipe-card-list">
				{recipes.map((recipe) => (
					<div className="recipe-card" key={uuidv4()}>
						<RecipeCard
							imageUrl={recipe.imageUrl}
							cookingTime={recipe.cookingTime}
							recipeName={recipe.recipeName}
							categories={recipe.categories}
						/>
					</div>
				))}
			</div>
		</div>
	);
}

export default RecipeCardList;
