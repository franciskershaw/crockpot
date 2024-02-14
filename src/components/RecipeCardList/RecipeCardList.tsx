'use client';

import React from 'react';

import { Recipe } from '@/types/types';

import RecipeCard from '@/components/RecipeCard/RecipeCard';

import './styles.scss';

import { useModal } from '../Modal/ModalContext';
import OpenModal from '../Modal/OpenModal';

type RecipeCardListProps = {
	recipes: Recipe[];
	fullWidth?: boolean;
};

function RecipeCardList({ recipes, fullWidth }: RecipeCardListProps) {
	const { setSelectedRecipe } = useModal();
	return (
		<div
			className={`recipe-card-list ${fullWidth ? 'recipe-card-list--full' : 'recipe-card-list--1-2'}`}
		>
			{recipes.map((recipe) => (
				<React.Fragment key={recipe._id}>
					<OpenModal
						onClick={() => setSelectedRecipe(recipe)}
						name="RecipeModal"
						styles="recipe-card"
					>
						<RecipeCard recipe={recipe} />
					</OpenModal>
				</React.Fragment>
			))}
		</div>
	);
}

export default RecipeCardList;
