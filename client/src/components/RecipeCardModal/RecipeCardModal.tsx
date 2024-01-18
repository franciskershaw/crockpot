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
			<div className="p-4">
				<ul className="flex flex-wrap">
					{recipe.ingredients.map((ingredient, index) => (
						<li key={index} className="w-full sm:w-1/2">
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
						<div className="absolute right-5 top-2">
							<div className="flex gap-2">
								<Modal
									trigger={
										<div className="border-2 border-black bg-white rounded-full w-fit">
											<Button type="primary">
												<RiEdit2Line />
											</Button>
										</div>
									}
									title={`Edit ${recipe.name}`}
									open={modalOpen}
									setOpen={setModalOpen}
								>
									<AddRecipe recipe={recipe} />
								</Modal>
								<Modal
									trigger={
										<div className="border-2 border-black bg-white rounded-full w-fit">
											<Button onClick={openDeleteConfirmation} type="primary">
												<RiDeleteBinLine />
											</Button>
										</div>
									}
									title="Are you sure you'd like to delete this recipe?"
									open={deleteRecipeConf}
									setOpen={setDeleteRecipeConf}
								>
									<div className="flex flex-col items-center justify-center gap-3">
										<p className="text-xl">Warning - cannot be undone</p>
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
				<div className="absolute bottom-0 left-0 right-0 m-4 p-4 md:right-auto md:w-2/3 bg-white border border-black-25 flex flex-row items-center justify-between rounded">
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
			<div className="px-2 pt-4">
				<Tabs titles={tabTitles} isModal>
					<>{tabIngredients()}</>
					<>{tabInstructions()}</>
				</Tabs>
			</div>
		</div>
	);
};

export default RecipeCardModal;
