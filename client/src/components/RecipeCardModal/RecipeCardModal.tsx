import React, { useState } from 'react';
import { RiDeleteBinLine, RiEdit2Line } from 'react-icons/ri';

import { Recipe } from '@/src/types/types';

import useUser from '@/src/hooks/auth/useUser';
import { useDeleteRecipe } from '@/src/hooks/recipes/useAddEditRecipe';

import AddRecipe from '@/src/components/AddRecipe/AddRecipe';
import Button from '@/src/components/Button/Button';
import ButtonCart from '@/src/components/ButtonCart/ButtonCart';
import Modal from '@/src/components/Modal/Modal';
import Tabs from '@/src/components/Tabs/Tabs';

type RecipeCardModalProps = {
	recipe: Recipe;
};

const RecipeCardModal = ({ recipe }: RecipeCardModalProps) => {
	const [modalOpen, setModalOpen] = useState(false);
	const [deleteRecipeConf, setDeleteRecipeConf] = useState(false);

	const { user } = useUser();
	const deleteRecipe = useDeleteRecipe();

	const isMenu = user?.recipeMenu.find((rec: Recipe) => rec._id === recipe._id);
	const [quantity, setQuantity] = useState(isMenu ? isMenu.serves : 4);

	const tabTitles = ['Ingredients', 'Instructions'];

	const tabIngredients = () => {
		return (
			<div className="p-3">
				<ul className="flex flex-wrap">
					{recipe.ingredients.map((ingredient, index) => (
						<li key={index} className="w-full xs:w-1/2">
							{ingredient._id.name} x{' '}
							{((ingredient.quantity / recipe.serves) * quantity)
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
			<div className="p-3">
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

	const openDeleteConfirmation = () => {
		setDeleteRecipeConf(true);
	};

	const handleDelete = () => {
		deleteRecipe(recipe._id);
		setDeleteRecipeConf(false);
	};

	return (
		<div>
			<div className="relative">
				<div
					className="bg-cover bg-center h-80 relative"
					style={{ backgroundImage: `url(${recipe.image.url})` }}
				>
					{(recipe.createdBy._id === user?._id || user?.isAdmin) && (
						<div className="absolute top-0 right-0 m-3">
							<div className="flex space-x-2">
								<Modal
									trigger={
										<Button type="primary" border>
											<RiEdit2Line />
										</Button>
									}
									title={`Edit ${recipe.name}`}
									open={modalOpen}
									setOpen={setModalOpen}
								>
									<AddRecipe recipe={recipe} />
								</Modal>
								<Modal
									trigger={
										<Button
											onClick={openDeleteConfirmation}
											type="primary"
											border
										>
											<RiDeleteBinLine />
										</Button>
									}
									title="Are you sure you'd like to delete this recipe?"
									open={deleteRecipeConf}
									setOpen={setDeleteRecipeConf}
								>
									<div className="p-3 flex justify-center">
										<Button
											onClick={handleDelete}
											text="Delete Recipe"
											border
										/>
									</div>
								</Modal>
							</div>
						</div>
					)}
				</div>
				<div className="absolute bottom-0 left-0 right-0 m-3 p-3 md:right-auto md:w-2/3 bg-white border border-black-25 flex items-center justify-between rounded">
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
			<div className="p-3 pb-0">
				<Tabs titles={tabTitles} isModal>
					<>{tabIngredients()}</>
					<>{tabInstructions()}</>
				</Tabs>
			</div>
		</div>
	);
};

export default RecipeCardModal;
