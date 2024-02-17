import Image from 'next/image';

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
		<div className="rounded-xl overflow-hidden cursor-pointer shadow animate animate--grow-sm animate--shadow border border-borderLight">
			<div className="relative">
				<div className="h-64 relative">
					<Image
						src={recipe.image?.url || '/images/placeholder.png'}
						alt={recipe.name}
						fill
						style={{ objectFit: 'cover' }}
						className="bg-cover bg-center"
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						priority
					/>
				</div>

				{/* Absolute buttons */}
				{user && (
					<>
						<div className="absolute top-1.5 left-1.5">
							<ButtonFav id={recipe._id} isFav={isFav} />
						</div>
						<div className="absolute top-1.5 right-1.5">
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
				<h3 className="truncate capitalize">{recipe.name}</h3>
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
