import { useState, useMemo } from 'react';
import Button from '@/src/components/Button/Button';
import SearchBar from '@/src/components/FormSearchBar/SearchBar';
import Modal from '@/src/components/Modal/Modal';
import AddRecipe from '@/src/components/AddRecipe/AddRecipe';
import { AiOutlinePlus } from 'react-icons/ai';
import useRecipes from '@/src/hooks/recipes/useRecipes';
import Checkbox from '@/src/components/Checkbox/Checkbox';
import { RiDeleteBinLine, RiEdit2Line } from 'react-icons/ri';
import { useDeleteRecipe } from '@/src/hooks/recipes/useAddEditRecipe';

const RecipesTab = () => {
	const [query, setQuery] = useState('');
	const [addRecipeModalOpen, setAddRecipeModalOpen] = useState(false);

	const [showPending, setShowPending] = useState(false);

	const { allRecipes, filterRecipes } = useRecipes();

	const deleteRecipe = useDeleteRecipe();

	const searchResults = useMemo(() => {
		return filterRecipes(allRecipes, query);
	}, [allRecipes, query, filterRecipes]);

	return (
		<div className='flex flex-col justify-center items-center'>
			<div className='flex items-center gap-2 my-4'>
				<Modal
					trigger={
						<div>
							<Button border>
								<AiOutlinePlus />
							</Button>
						</div>
					}
					title='Add new recipe'
					open={addRecipeModalOpen}
					setOpen={setAddRecipeModalOpen}
				>
					<AddRecipe setModal={setAddRecipeModalOpen} />
				</Modal>

				<p className='text-lg'>Add new recipe</p>
			</div>
			<div className='w-full mb-4'>
				<SearchBar
					searchQuery={query}
					setSearchQuery={setQuery}
					placeholder='Search recipes'
				/>
			</div>
			{searchResults.length ? (
				<div className='w-full'>
					<div className='mb-4'>
						<Checkbox
							isChecked={showPending}
							onChange={() => setShowPending(!showPending)}
							label='Show Pending Approval'
						/>
					</div>

					<div className='border w-full'>
						{searchResults.map((result) => (
							<div
								className='flex items-center border py-4 px-2 gap-2 justify-between'
								key={result._id}
							>
								<p className='w-1/3'>{result.name}</p>
								<Modal
									trigger={
										<div className='border-2 border-black bg-white rounded-full w-fit'>
											<Button type='primary'>
												<RiEdit2Line />
											</Button>
										</div>
									}
									title={`Edit ${result.name}`}
								>
									<AddRecipe recipe={result} />
								</Modal>
								<Modal
									trigger={
										<div className='border-2 border-black bg-white rounded-full w-fit'>
											<Button type='primary'>
												<RiDeleteBinLine />
											</Button>
										</div>
									}
									title={`Are you sure you'd like to delete ${result.name}?`}
								>
									<div className='flex flex-col items-center justify-center gap-3'>
										<p className='text-xl'>Warning - cannot be undone</p>
										<Button
											onClick={() => deleteRecipe(result._id)}
											text='Delete Recipe'
											border
										/>
									</div>
								</Modal>
								<div className='flex flex-col justify-center items-center gap-2'>
									<label className='text-xs' htmlFor={result._id}>
										Approved
									</label>
									<Checkbox
										isChecked={result.approved}
										onChange={() => console.log('Change')}
										id={result._id}
									/>
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
