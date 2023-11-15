import React, { useState } from 'react';
import ButtonCart from '../ButtonCart/ButtonCart';
import Tabs from '../Tabs/Tabs';
import { Recipe } from '@/src/types/types';
import useUser from '@/src/hooks/auth/useUser';

type RecipeCardModalProps = {
	recipe: Recipe;
};

const RecipeCardModal = ({ recipe }: RecipeCardModalProps) => {
	const [quantity, setQuantity] = useState(4);
	const { user } = useUser();
	const isMenu = user?.recipeMenu.find((rec: Recipe) => rec._id === recipe._id);
	const tabTitles = ['Ingredients', 'Instructions'];
	const tabIngredients = () => {
		return (
			<div className="p-4">
				<ul className="flex flex-wrap">
					{recipe.ingredients.map((ingredient, index) => (
						<li key={index} className="w-full sm:w-1/2">
							{ingredient._id.name} x{' '}
							{(ingredient.quantity * quantity)
								.toFixed(2)
								.replace(/\.00$|0$/, '')}{' '}
							{ingredient.unit}
						</li>
					))}
				</ul>
			</div>
		);
	};

	const tabInstructions = () => {
		return (
			<div className="p-4">
				{recipe.instructions && (
					<ol>
						{recipe.instructions.map((instruction, index) => (
							<li key={index}>{instruction}</li>
						))}
					</ol>
				)}
				{recipe.notes && recipe.notes[0] !== '' && (
					<>
						<hr className="my-2" />
						<ul>
							{recipe.notes.map((note, index) => (
								<li key={index}>{note}</li>
							))}
						</ul>
					</>
				)}
			</div>
		);
	};

	return (
		<div>
			<div className="relative">
				<div
					className="bg-cover bg-center h-80"
					style={{ backgroundImage: `url(${recipe.image.url})` }}
				/>
				<div className="absolute bottom-0 left-0 right-0 m-4 p-4 md:right-auto md:w-2/3 bg-white border-2 border-green-500 flex flex-row items-center justify-between">
					<div>
						<h2>{recipe.name}</h2>
						<h3>Created by {recipe.createdBy?.username}</h3>
					</div>
					{user && (
						<ButtonCart
							recipe={recipe}
							initialValue={quantity}
							onChange={setQuantity}
							isMenu={isMenu}
						/>
					)}
				</div>
			</div>
			<div className="p-4 pb-0">
				<Tabs titles={tabTitles}>
					<>{tabIngredients()}</>
					<>{tabInstructions()}</>
				</Tabs>
			</div>
		</div>
	);
};

export default RecipeCardModal;
