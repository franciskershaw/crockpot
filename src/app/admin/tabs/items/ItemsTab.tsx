import { useMemo, useState } from 'react';
import { RiDeleteBinLine, RiEdit2Line } from 'react-icons/ri';

import { useDeleteItem } from '@/hooks/items/useAddEditItem';
import useItems from '@/hooks/items/useItems';

import AddItem from '@/components/AddItem/AddItem';
import Button from '@/components/Button/Button';
import SearchBar from '@/components/FormSearchBar/SearchBar';
import Modal from '@/components/Modal/Modal';

import styles from '../../styles.module.scss';

const ItemsTab = () => {
	const [query, setQuery] = useState('');
	const [addItemModalOpen, setAddItemModalOpen] = useState(false);

	const { allItems, filterItems } = useItems();

	const deleteItem = useDeleteItem();

	const searchResults = useMemo(() => {
		return filterItems(allItems, query);
	}, [allItems, query, filterItems]);

	return (
		<div className={styles.adminTabs}>
			<div className={styles.adminTabsModalTrigger}>
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
			<div className={styles.adminTabsSearchBar}>
				<SearchBar
					searchQuery={query}
					setSearchQuery={setQuery}
					placeholder="Search existing items"
				/>
			</div>
			{searchResults.length ? (
				<>
					<div className={styles.adminTabsSearchResultsContainer}>
						{searchResults.map((result) => (
							<div className={styles.adminTabsSearchResult} key={result._id}>
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
											<p>Are you sure you would like to delete this item?</p>
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
