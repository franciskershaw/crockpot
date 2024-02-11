import React from 'react';

import { Category, Recipe } from '@/types/types';

import useUser from '@/hooks/auth/useUser';

import ButtonCart from '@/components/ButtonCart/ButtonCart';
import ButtonFav from '@/components/ButtonFav/ButtonFav';
import TimingTag from '@/components/TimingTag/TimingTag';

type RecipeCardProps = {
	recipe: Recipe;
};

const RecipeCard = ({ recipe }: RecipeCardProps) => {
	const categoryNames = recipe.categories.map(
		(category: Category) => category.name,
	);
	const firstThreeCategories = categoryNames.slice(0, 3);
	const remainingCategoriesCount = categoryNames.length - 3;

	const { user } = useUser();
	const isFav = user?.favouriteRecipes.includes(recipe._id);
	const isMenu = user?.recipeMenu.find((rec: Recipe) => rec._id === recipe._id);

	return (
		<div className="rounded-xl overflow-hidden cursor-pointer shadow animate animate--grow-sm animate--shadow border border-black-25">
			<div className="relative">
				{/* Background image */}
				<div
					className="bg-cover bg-center h-64"
					style={{
						backgroundImage: `url(${recipe.image?.url || '/images/placeholder.png'})`,
					}}
				/>

				{/* Absolute buttons */}
				{user && (
					<>
						<div className="absolute top-1 left-1">
							<ButtonFav id={recipe._id} isFav={isFav} />
						</div>
						<div className="absolute top-1 right-1">
							<ButtonCart recipe={recipe} isMenu={isMenu} />
						</div>
					</>
				)}
				<div className="absolute bottom-[-12px] right-2">
					<TimingTag time={recipe.timeInMinutes} />
				</div>
			</div>

			{/* Name and categories */}
			<div className="px-2 py-3 bg-white rounded-b-xl border-t border-black-25">
				<h3 className="truncate">{recipe.name}</h3>
				<p className="truncate">
					{firstThreeCategories.join(' | ')}
					{remainingCategoriesCount > 0 &&
						` | +${remainingCategoriesCount} more`}
				</p>
			</div>
		</div>
	);
};

export default RecipeCard;
