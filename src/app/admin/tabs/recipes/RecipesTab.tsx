import { useEffect, useMemo, useState } from 'react';
import { RiDeleteBinLine, RiEdit2Line } from 'react-icons/ri';

import { Recipe } from '@/types/types';

import { useDeleteRecipe } from '@/hooks/recipes/useAddEditRecipe';
import useRecipes from '@/hooks/recipes/useRecipes';

import AddRecipe from '@/components/AddRecipe/AddRecipe';
import Button from '@/components/Button/Button';
import SearchBar from '@/components/FormSearchBar/SearchBar';
import Modal from '@/components/Modal/Modal';
import { useModal } from '@/components/Modal/ModalContext';
import OpenModal from '@/components/Modal/OpenModal';

import styles from '../../styles.module.scss';

const RecipesTab = () => {
	const [query, setQuery] = useState('');
	const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>();

	const { allRecipes, filterRecipes } = useRecipes();

	const deleteRecipe = useDeleteRecipe();

	const searchResults = useMemo(() => {
		return filterRecipes(allRecipes, query);
	}, [allRecipes, query, filterRecipes]);

	const { openModals, closeModal } = useModal();

	useEffect(() => {
		if (!openModals.length) {
			setSelectedRecipe(null);
		}
	}, [openModals]);

	return (
		<div className={styles.adminTabs}>
			<OpenModal name="AddRecipe" styles="flex items-center my-4">
				<Button type="primary" text="Add New Recipe"></Button>
			</OpenModal>

			<div className={styles.searchBar}>
				<SearchBar
					searchQuery={query}
					setSearchQuery={setQuery}
					placeholder="Search existing recipes"
				/>
			</div>
			{searchResults.length ? (
				<>
					<div className={styles.searchResultsContainer}>
						{searchResults.map((result) => (
							<div className={styles.searchResult} key={result._id}>
								<p className="capitalize">{result.name}</p>
								<div className="flex space-x-2">
									<OpenModal
										onClick={() => setSelectedRecipe(result)}
										name="EditRecipe"
									>
										<Button type="primary">
											<RiEdit2Line />
										</Button>
									</OpenModal>
									<OpenModal
										onClick={() => setSelectedRecipe(result)}
										name="DeleteRecipe"
									>
										<Button type="primary">
											<RiDeleteBinLine />
										</Button>
									</OpenModal>
								</div>
							</div>
						))}
					</div>
				</>
			) : null}
			<Modal name={'AddRecipe'} title="Add new recipe">
				<AddRecipe />
			</Modal>
			{selectedRecipe && openModals.includes('EditRecipe') ? (
				<Modal name="EditRecipe" title={`Edit ${selectedRecipe.name} `}>
					<AddRecipe recipe={selectedRecipe} />
				</Modal>
			) : null}
			{selectedRecipe && openModals.includes('DeleteRecipe') ? (
				<Modal
					name="DeleteRecipe"
					customSize="small"
					title={`Delete ${selectedRecipe.name}`}
				>
					<div className="modal--p-and-button my-4">
						<p className="text-center">
							Are you sure you would like to delete this recipe?
						</p>
						<Button
							onClick={() => {
								deleteRecipe(selectedRecipe._id);
								closeModal('DeleteRecipe');
							}}
							text="Delete Recipe"
							border
						/>
					</div>
				</Modal>
			) : null}
		</div>
	);
};

export default RecipesTab;
