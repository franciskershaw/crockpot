import { useState, useMemo, useEffect } from 'react';
import Button from '@/src/components/Button/Button';
import SearchBar from '@/src/components/FormSearchBar/SearchBar';
import Modal from '@/src/components/Modal/Modal';
import AddItem from '@/src/components/AddItem/AddItem';
import { AiOutlinePlus } from 'react-icons/ai';
import useItems from '@/src/hooks/items/useItems';
import { RiDeleteBinLine, RiEdit2Line } from 'react-icons/ri';
// import { useDeleteRecipe } from '@/src/hooks/recipes/useAddEditRecipe';

const ItemsTab = () => {
	const [query, setQuery] = useState('');
	const [addItemModalOpen, setAddItemModalOpen] = useState(false);

	const { allItems, filterItems } = useItems();

	// const deleteRecipe = useDeleteRecipe();

	const searchResults = useMemo(() => {
		return filterItems(allItems, query);
	}, [allItems, query, filterItems]);

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
					title='Add new Item'
					open={addItemModalOpen}
					setOpen={setAddItemModalOpen}
				>
					{/* <AddRecipe setModal={setAddRecipeModalOpen} /> */}
					<AddItem setModal={setAddItemModalOpen} />
				</Modal>

				<p className='text-lg'>Add new Item</p>
			</div>
			<div className='w-full mb-4 md:w-1/3'>
				<SearchBar
					searchQuery={query}
					setSearchQuery={setQuery}
					placeholder='Search existing items'
				/>
			</div>
			{searchResults.length ? (
				<div className='w-full'>
					<div className='border w-full md:w-2/3 md:mx-auto'>
						{searchResults.map((result) => (
							<div
								className='flex items-center border py-4 px-2 gap-2 justify-between'
								key={result._id}
							>
								<p className='w-1/2 md:w-2/3'>{result.name}</p>
								<div className='flex gap-2'>
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
										<AddItem item={result} />
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
												// onClick={() => deleteRecipe(result._id)}
												text='Delete Recipe'
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

export default ItemsTab;
