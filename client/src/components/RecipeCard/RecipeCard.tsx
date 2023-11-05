import React from 'react';
import ButtonFav from '../ButtonFav/ButtonFav';
import ButtonCart from '../ButtonCart/ButtonCart';
import TimingTag from '../TimingTag/TimingTag';
import useUser from '@/src/hooks/auth/useUser';

type RecipeCardProps = {
	imageUrl: any;
	timeInMinutes: number;
	name: string;
	categories: string[];
};

const RecipeCard = ({
	imageUrl,
	timeInMinutes,
	name,
	categories,
}: RecipeCardProps) => {
	const firstThreeCategories = categories.slice(0, 3);
	const remainingCategoriesCount = categories.length - 3;

	const { user } = useUser();

	return (
		<div className="rounded-xl overflow-hidden cursor-pointer">
			<div className="relative">
				{/* Background image */}
				<div
					className="bg-cover bg-center h-64"
					style={{ backgroundImage: `url(${imageUrl})` }}
				/>

				{/* Absolute buttons */}
				{user && (
					<>
						<div className="absolute top-1 left-1">
							<ButtonFav recipeId={name} />
						</div>
						<div className="absolute top-1 right-1">
							<ButtonCart recipeId={name} />
						</div>
					</>
				)}
				<div className="absolute bottom-[-12px] right-2">
					<TimingTag time={timeInMinutes} />
				</div>
			</div>

			{/* Name and categories */}
			<div className="px-2 py-3 bg-white rounded-b-xl border border-gray-300">
				<h3 className="truncate">{name}</h3>
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
