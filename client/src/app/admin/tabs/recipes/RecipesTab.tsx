import { useMemo, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { RiDeleteBinLine, RiEdit2Line } from 'react-icons/ri';

import { useDeleteRecipe } from '@/src/hooks/recipes/useAddEditRecipe';
import useRecipes from '@/src/hooks/recipes/useRecipes';

import AddRecipe from '@/src/components/AddRecipe/AddRecipe';
import Button from '@/src/components/Button/Button';
import SearchBar from '@/src/components/FormSearchBar/SearchBar';
import Modal from '@/src/components/Modal/Modal';

const RecipesTab = () => {
	const [query, setQuery] = useState('');
	const [addRecipeModalOpen, setAddRecipeModalOpen] = useState(false);

	const { allRecipes, filterRecipes } = useRecipes();

	const deleteRecipe = useDeleteRecipe();

	const searchResults = useMemo(() => {
		return filterRecipes(allRecipes, query);
	}, [allRecipes, query, filterRecipes]);

	return (
		<div className="flex flex-col justify-center items-center">
			<div className="flex items-center gap-2 my-4">
				<Modal
					trigger={
						<Button type="primary" border text="Add New Recipe"></Button>
					}
					title="Add new recipe"
					open={addRecipeModalOpen}
					setOpen={setAddRecipeModalOpen}
					paddingOn
				>
					<AddRecipe setModal={setAddRecipeModalOpen} />
				</Modal>
			</div>
			<div className="w-full mb-4 md:w-1/3">
				<SearchBar
					searchQuery={query}
					setSearchQuery={setQuery}
					placeholder="Search existing recipes"
				/>
			</div>
			{searchResults.length ? (
				<div className="w-full">
					<div className="border w-full md:w-2/3 md:mx-auto">
						{searchResults.map((result) => (
							<div
								className="flex items-center border py-4 px-2 gap-2 justify-between"
								key={result._id}
							>
								<p className="w-1/2 md:w-2/3">{result.name}</p>
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
									>
										<div className="flex flex-col items-center space-y-2">
											<p>Are you sure you'd like to delete this recipe?</p>
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
				</div>
			) : null}
		</div>
	);
};

export default RecipesTab;
