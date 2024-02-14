import { useEffect, useMemo, useState } from 'react';
import { RiDeleteBinLine, RiEdit2Line } from 'react-icons/ri';

import { Recipe } from '@/types/types';

import { useDeleteRecipe } from '@/hooks/recipes/useAddEditRecipe';
import useRecipes from '@/hooks/recipes/useRecipes';

import AddRecipe from '@/components/AddRecipe/AddRecipe';
import Button from '@/components/Button/Button';
import SearchBar from '@/components/FormSearchBar/SearchBar';
import Modal2 from '@/components/Modal2/Modal2';
import { useModal } from '@/components/Modal2/ModalContext';
import OpenModal from '@/components/Modal2/OpenModal';

import styles from '../../styles.module.scss';

const RecipesTab = () => {
	const [query, setQuery] = useState('');
	const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>();

	const { allRecipes, filterRecipes } = useRecipes();

	const deleteRecipe = useDeleteRecipe();

	const searchResults = useMemo(() => {
		return filterRecipes(allRecipes, query);
	}, [allRecipes, query, filterRecipes]);

	const { openModals } = useModal();

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
								<p>{result.name}</p>
								<div className="flex space-x-2">
									<OpenModal
										onClick={() => setSelectedRecipe(result)}
										name="EditRecipe"
										// styles="flex space-x-2"
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
			<Modal2 name={'AddRecipe'} title="Add new recipe">
				<AddRecipe />
			</Modal2>
			{selectedRecipe && openModals.includes('EditRecipe') ? (
				<Modal2 name="EditRecipe" title={`Edit ${selectedRecipe.name} `}>
					<AddRecipe recipe={selectedRecipe} />
				</Modal2>
			) : null}
			{selectedRecipe && openModals.includes('DeleteRecipe') ? (
				<Modal2 name="DeleteRecipe" customSize="small">
					<div className="modal--p-and-button">
						<p className="text-center">
							Are you sure you would like to delete this recipe?
						</p>
						<Button
							onClick={() => deleteRecipe(selectedRecipe._id)}
							text="Delete Recipe"
							border
						/>
					</div>
				</Modal2>
			) : null}
		</div>
	);
};

export default RecipesTab;
