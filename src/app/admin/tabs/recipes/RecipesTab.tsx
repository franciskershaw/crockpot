import { useMemo, useState } from 'react';
import { RiDeleteBinLine, RiEdit2Line } from 'react-icons/ri';

import { useDeleteRecipe } from '@/hooks/recipes/useAddEditRecipe';
import useRecipes from '@/hooks/recipes/useRecipes';

import AddRecipe from '@/components/AddRecipe/AddRecipe';
import Button from '@/components/Button/Button';
import SearchBar from '@/components/FormSearchBar/SearchBar';
import Modal from '@/components/Modal/Modal';

const RecipesTab = () => {
	const [query, setQuery] = useState('');
	const [addRecipeModalOpen, setAddRecipeModalOpen] = useState(false);

	const { allRecipes, filterRecipes } = useRecipes();

	const deleteRecipe = useDeleteRecipe();

	const searchResults = useMemo(() => {
		return filterRecipes(allRecipes, query);
	}, [allRecipes, query, filterRecipes]);

	return (
		<div className="admin-tabs">
			<div className="admin-tabs__modal-trigger">
				<Modal
					trigger={
						<Button type="primary" border text="Add New Recipe"></Button>
					}
					title="Add new recipe"
					open={addRecipeModalOpen}
					setOpen={setAddRecipeModalOpen}
					paddingOn
					size="md"
				>
					<AddRecipe setModal={setAddRecipeModalOpen} />
				</Modal>
			</div>
			<div className="admin-tabs__search-bar">
				<SearchBar
					searchQuery={query}
					setSearchQuery={setQuery}
					placeholder="Search existing recipes"
				/>
			</div>
			{searchResults.length ? (
				<>
					<div className="admin-tabs__search-results-container">
						{searchResults.map((result) => (
							<div className="admin-tabs__search-result" key={result._id}>
								<p>{result.name}</p>
								<div className="flex space-x-2">
									<Modal
										trigger={
											<Button type="primary" border>
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
											<Button type="primary" border>
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
