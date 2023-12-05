'use client';

import React from 'react';
import RecipeCard from '../RecipeCard/RecipeCard';
import RecipeCardModal from '../RecipeCardModal/RecipeCardModal';
import './styles.scss';
import { v4 as uuidv4 } from 'uuid';
import { Recipe } from '@/src/types/types';
import Modal from '../Modal/Modal';

type RecipeCardListProps = {
	recipes: Recipe[];
	fullWidth?: boolean;
};

function RecipeCardList({ recipes, fullWidth }: RecipeCardListProps) {
	return (
		<div
			className={
				fullWidth ? 'recipe-card-list--full-width' : 'recipe-card-list'
			}
		>
			{recipes.map((recipe) => (
				<Modal
					key={uuidv4()}
					title={
						<div className="flex">
							<div>{recipe.timeInMinutes} mins</div>
							{recipe.categories.map((category, index) => (
								<div key={index} className="ml-2 pl-2 border-l border-black">
									{category.name}
								</div>
							))}
						</div>
					}
					isWide
					paddingOff
					trigger={
						<div className="recipe-card">
							<RecipeCard recipe={recipe} />
						</div>
					}
				>
					<RecipeCardModal recipe={recipe} />
				</Modal>
			))}
		</div>
	);
}

export default RecipeCardList;
