import React, { useState } from 'react';
import { RiDeleteBinLine, RiEdit2Line } from 'react-icons/ri';

import { Recipe } from '@/types/types';

import useUser from '@/hooks/auth/useUser';
import { useDeleteRecipe } from '@/hooks/recipes/useAddEditRecipe';

import AddRecipe from '@/components/AddRecipe/AddRecipe';
import Button from '@/components/Button/Button';
import ButtonCart from '@/components/ButtonCart/ButtonCart';
import Modal from '@/components/Modal/Modal';
import QuantityInput from '@/components/QuantityInput/QuantityInput';
import Tabs from '@/components/Tabs/Tabs';

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
		<>
			<div className="relative">
				<div
					className="bg-cover bg-center h-80 relative"
					style={{
						backgroundImage: `url(${recipe.image?.url || '/images/placeholder.png'})`,
					}}
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
									title={
										<>
											Edit <i>{recipe.name}</i>
										</>
									}
									open={modalOpen}
									setOpen={setModalOpen}
									nested
									paddingOn
									size="md"
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
									title={
										<>
											Delete <i>{recipe.name}</i>
										</>
									}
									open={deleteRecipeConf}
									setOpen={setDeleteRecipeConf}
									nested
									paddingOn
									size="sm"
								>
									<div className="modal--p-and-button">
										<p>Are you sure you&aposd like to delete this recipe?</p>
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
					{user ? (
						<ButtonCart
							recipe={recipe}
							initialValue={quantity}
							onChange={setQuantity}
							isMenu={isMenu}
						/>
					) : (
						<QuantityInput
							min={1}
							max={16}
							value={quantity}
							setValue={setQuantity}
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
		</>
	);
};

export default RecipeCardModal;
