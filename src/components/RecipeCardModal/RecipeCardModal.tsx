import { useState } from 'react';
import { RiDeleteBinLine, RiEdit2Line } from 'react-icons/ri';

import { Recipe } from '@/types/types';

import useUser from '@/hooks/auth/useUser';
import { useDeleteRecipe } from '@/hooks/recipes/useAddEditRecipe';

import AddRecipe from '@/components/AddRecipe/AddRecipe';
import Button from '@/components/Button/Button';
import ButtonCart from '@/components/ButtonCart/ButtonCart';
import QuantityInput from '@/components/QuantityInput/QuantityInput';
import Tabs from '@/components/Tabs/Tabs';

import Modal from '../Modal/Modal';
import { useModal } from '../Modal/ModalContext';
import OpenModal from '../Modal/OpenModal';

type RecipeCardModalProps = {
	recipe: Recipe;
};

const RecipeCardModal = ({ recipe }: RecipeCardModalProps) => {
	const { user } = useUser();
	const deleteRecipe = useDeleteRecipe();

	const isMenu = user?.recipeMenu.find((rec: Recipe) => rec._id === recipe._id);
	const [quantity, setQuantity] = useState(isMenu ? isMenu.serves : 4);

	const { openModals, closeModal } = useModal();

	const tabTitles = ['Ingredients', 'Instructions'];

	const tabIngredients = () => {
		return (
			<div className="p-3">
				<ul className="flex flex-wrap">
					{recipe.ingredients.map((ingredient, index) => (
						<li key={index} className="w-full xs:w-1/2">
							<span className="capitalize">{ingredient._id.name}</span> x{' '}
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
						<>
							<div className="absolute top-0 right-0 m-3">
								<div className="flex space-x-2">
									<OpenModal name="EditRecipe">
										<Button type="primary">
											<RiEdit2Line />
										</Button>
									</OpenModal>
									<OpenModal name="DeleteRecipe">
										<Button type="primary">
											<RiDeleteBinLine />
										</Button>
									</OpenModal>
								</div>
							</div>
							{recipe && openModals.includes('EditRecipe') ? (
								<Modal name="EditRecipe" title={`Edit ${recipe.name} `}>
									<AddRecipe recipe={recipe} />
								</Modal>
							) : null}
							{recipe && openModals.includes('DeleteRecipe') ? (
								<Modal name="DeleteRecipe" customSize="small">
									<div className="modal--p-and-button">
										<p className="text-center">
											Are you sure you would like to delete this recipe?
										</p>
										<Button
											onClick={() => {
												deleteRecipe(recipe._id);
												closeModal('DeleteRecipe');
											}}
											text="Delete Recipe"
											border
										/>
									</div>
								</Modal>
							) : null}
						</>
					)}
				</div>
				<div className="absolute bottom-0 left-0 right-0 m-3 p-3 md:right-auto md:w-2/3 bg-white border border-borderLight flex items-center justify-between rounded">
					<div>
						<h2 className="capitalize">{recipe.name}</h2>
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
