'use client';

import React from 'react';

import { Recipe } from '@/types/types';

import Modal from '@/components/Modal/Modal';
import RecipeCard from '@/components/RecipeCard/RecipeCard';
import RecipeCardModal from '@/components/RecipeCardModal/RecipeCardModal';

import './styles.scss';

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
					key={recipe._id}
					title={
						<div className="flex">
							<div className="lowercase">{recipe.timeInMinutes} mins</div>
							{recipe.categories.map((category, index) => (
								<div key={index} className="ml-2 pl-2 border-l border-white">
									{category.name}
								</div>
							))}
						</div>
					}
					trigger={
						// Recipe card class needs to be outside component for trigger functionality
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
