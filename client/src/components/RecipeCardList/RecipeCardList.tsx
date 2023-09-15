'use client';

import React from 'react';
import RecipeCard from '../RecipeCard/RecipeCard';
import recipesData from '@/src/data/recipes.json';
import './styles.scss';
import { v4 as uuidv4 } from 'uuid';
import { Recipe } from '@/src/types/types';

type RecipeCardListProps = {
	recipes: Recipe[];
};

function RecipeCardList({ recipes }: RecipeCardListProps) {
	return (
		<div className="tw">
			<h3 className="font-bold mb-2">{recipes.length} recipes:</h3>
			<div className="recipe-card-list">
				{recipes.map((recipe) => (
					<div className="recipe-card" key={uuidv4()}>
						<RecipeCard
							imageUrl={recipe.image?.url}
							timeInMinutes={recipe.timeInMinutes}
							name={recipe.name}
							categories={recipe.categories.map((category) => category.name)}
						/>
					</div>
				))}
			</div>
		</div>
	);
}

export default RecipeCardList;
