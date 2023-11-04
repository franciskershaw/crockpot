'use client';

import React from 'react';
import RecipeCard from '../RecipeCard/RecipeCard';
import RecipeCardModal from '../RecipeCardModal/RecipeCardModal';
import './styles.scss';
import { v4 as uuidv4 } from 'uuid';
import { Recipe } from '@/src/types/types';
import Modal from '../Modal/Modal';
import BrowsePageFiltersMenu from '@/src/app/browse/components/BrowsePageFiltersMenu';

type RecipeCardListProps = {
	recipes: Recipe[];
};

function RecipeCardList({ recipes }: RecipeCardListProps) {
	return (
		<div className="recipe-card-list">
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
							<RecipeCard
								imageUrl={recipe.image?.url}
								timeInMinutes={recipe.timeInMinutes}
								name={recipe.name}
								categories={recipe.categories.map((category) => category.name)}
							/>
						</div>
					}
				>
					<RecipeCardModal
						imageUrl={recipe.image?.url}
						name={recipe.name}
						ingredients={recipe.ingredients}
						instructions={recipe.instructions}
						notes={recipe.notes}
					/>
				</Modal>
			))}
		</div>
	);
}

export default RecipeCardList;
