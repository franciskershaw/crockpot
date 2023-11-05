import React, { useState } from 'react';
import ButtonCart from '../ButtonCart/ButtonCart';
import Tabs from '../Tabs/Tabs';
import { Ingredient } from '@/src/types/types';
import useUser from '@/src/hooks/auth/useUser';

type RecipeCardModalProps = {
	id: string;
	imageUrl: any;
	name: string;
	ingredients: Ingredient[];
	instructions: string[];
	notes: string[];
};

const RecipeCardModal = ({
	id,
	imageUrl,
	name,
	ingredients,
	instructions,
	notes,
}: RecipeCardModalProps) => {
	const [quantity, setQuantity] = useState(4);
	const { user } = useUser();

	return (
		<div>
			<div className="relative">
				<div
					className="bg-cover bg-center h-80"
					style={{ backgroundImage: `url(${imageUrl})` }}
				/>
				<div className="absolute bottom-0 left-0 right-0 m-4 p-4 md:right-auto md:w-2/3 bg-white border-2 border-green-500 flex flex-row items-center justify-between">
					<div>
						<h2>{name}</h2>
						<h3>Created by TedBrisket</h3>
					</div>
					{user && (
						<ButtonCart
							recipeId={id}
							initialValue={quantity}
							onChange={setQuantity}
						/>
					)}
				</div>
			</div>
			<div className="p-4 pb-0">
				<Tabs
					tabTitleOne="Ingredients"
					tabTitleTwo="Instructions"
					tabContentOne={
						<ul className="flex flex-wrap">
							{ingredients.map((ingredient, index) => (
								<li key={index} className="w-full sm:w-1/2">
									{ingredient._id} x{' '}
									{(ingredient.quantity * quantity)
										.toFixed(2)
										.replace(/\.00$|0$/, '')}{' '}
									{ingredient.unit}
								</li>
							))}
						</ul>
					}
					tabContentTwo={
						<>
							{instructions && (
								<ol>
									{instructions.map((instruction, index) => (
										<li key={index}>{instruction}</li>
									))}
								</ol>
							)}
							{notes && notes[0] !== '' && (
								<>
									<hr className="my-2" />
									<ul>
										{notes.map((note, index) => (
											<li key={index}>{note}</li>
										))}
									</ul>
								</>
							)}
						</>
					}
				/>
			</div>
		</div>
	);
};

export default RecipeCardModal;
