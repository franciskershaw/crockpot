import { useMemo, useState } from 'react';
import { RiDeleteBinLine, RiEdit2Line } from 'react-icons/ri';

import { useDeleteRecipe } from '@/hooks/recipes/useAddEditRecipe';
import useRecipes from '@/hooks/recipes/useRecipes';

import AddRecipe from '@/components/AddRecipe/AddRecipe';
import Button from '@/components/Button/Button';
import SearchBar from '@/components/FormSearchBar/SearchBar';
import Modal from '@/components/Modal/Modal';

import styles from '../../styles.module.scss';

const RecipesTab = () => {
	const [query, setQuery] = useState('');
	const [addRecipeModalOpen, setAddRecipeModalOpen] = useState(false);

	const { allRecipes, filterRecipes } = useRecipes();

	const deleteRecipe = useDeleteRecipe();

	const searchResults = useMemo(() => {
		return filterRecipes(allRecipes, query);
	}, [allRecipes, query, filterRecipes]);

	return (
		<div className={styles.adminTabs}>
			<div className={styles.modalTrigger}>
				<Modal
					trigger={<Button type="primary" text="Add New Recipe"></Button>}
					title="Add new recipe"
					open={addRecipeModalOpen}
					setOpen={setAddRecipeModalOpen}
					paddingOn
					size="md"
				>
					<AddRecipe setModal={setAddRecipeModalOpen} />
				</Modal>
			</div>
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
									<Modal
										trigger={
											<Button type="primary">
												<RiEdit2Line />
											</Button>
										}
										title={
											<>
												Edit <i>{result.name}</i>
											</>
										}
										paddingOn
										size="md"
									>
										<AddRecipe recipe={result} />
									</Modal>
									<Modal
										trigger={
											<Button type="primary">
												<RiDeleteBinLine />
											</Button>
										}
										title={
											<>
												Delete <i>{result.name}</i>
											</>
										}
										paddingOn
										size="sm"
									>
										<div className="modal--p-and-button">
											<p>Are you sure you&aposd like to delete this recipe?</p>
											<Button
												onClick={() => deleteRecipe(result._id)}
												text="Delete Recipe"
												border
											/>
										</div>
									</Modal>
								</div>
							</div>
						))}
					</div>
				</>
			) : null}
		</div>
	);
};

export default RecipesTab;
