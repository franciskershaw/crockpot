'use client';

import React from 'react';

import { v4 as uuidv4 } from 'uuid';

import { Recipe } from '@/src/types/types';

import './styles.scss';

import Modal from '../Modal/Modal';
import RecipeCard from '../RecipeCard/RecipeCard';
import RecipeCardModal from '../RecipeCardModal/RecipeCardModal';

type RecipeCardListProps = {
	recipes: Recipe[];
	fullWidth?: boolean;
};

function RecipeCardList({ recipes, fullWidth }: RecipeCardListProps) {
	return (
		<div
			className={`recipe-card-list ${fullWidth ? 'recipe-card-list--full' : 'recipe-card-list--1-2'}`}
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
