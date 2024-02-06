import { useMemo, useState } from 'react';
import { RiDeleteBinLine, RiEdit2Line } from 'react-icons/ri';

import { useDeleteItem } from '@/src/hooks/items/useAddEditItem';
import useItems from '@/src/hooks/items/useItems';

import AddItem from '@/src/components/AddItem/AddItem';
import Button from '@/src/components/Button/Button';
import SearchBar from '@/src/components/FormSearchBar/SearchBar';
import Modal from '@/src/components/Modal/Modal';

const ItemsTab = () => {
	const [query, setQuery] = useState('');
	const [addItemModalOpen, setAddItemModalOpen] = useState(false);

	const { allItems, filterItems } = useItems();

	const deleteItem = useDeleteItem();

	const searchResults = useMemo(() => {
		return filterItems(allItems, query);
	}, [allItems, query, filterItems]);

	return (
		<div className="admin-tabs">
			<div className="admin-tabs__modal-trigger">
				<Modal
					trigger={<Button type="primary" border text="Add New Item"></Button>}
					title="Add new item"
					open={addItemModalOpen}
					setOpen={setAddItemModalOpen}
					paddingOn
					size="sm"
				>
					<AddItem setModal={setAddItemModalOpen} />
				</Modal>
			</div>
			<div className="admin-tabs__search-bar">
				<SearchBar
					searchQuery={query}
					setSearchQuery={setQuery}
					placeholder="Search existing items"
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
										size="sm"
									>
										<AddItem item={result} />
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
											<p>Are you sure you'd like to delete this item?</p>
											<Button
												onClick={() => deleteItem(result._id)}
												text="Delete Item"
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

export default ItemsTab;
