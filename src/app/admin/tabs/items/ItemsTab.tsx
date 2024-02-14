import { useEffect, useMemo, useState } from 'react';
import { RiDeleteBinLine, RiEdit2Line } from 'react-icons/ri';

import { Item } from '@/types/types';

import { useDeleteItem } from '@/hooks/items/useAddEditItem';
import useItems from '@/hooks/items/useItems';

import AddItem from '@/components/AddItem/AddItem';
import Button from '@/components/Button/Button';
import SearchBar from '@/components/FormSearchBar/SearchBar';
import Modal from '@/components/Modal/Modal';
import { useModal } from '@/components/Modal/ModalContext';
import OpenModal from '@/components/Modal/OpenModal';

import styles from '../../styles.module.scss';

const ItemsTab = () => {
	const [query, setQuery] = useState('');
	const [selectedItem, setSelectedItem] = useState<Item | null>();

	const { allItems, filterItems } = useItems();

	const deleteItem = useDeleteItem();

	const searchResults = useMemo(() => {
		return filterItems(allItems, query);
	}, [allItems, query, filterItems]);

	const { openModals, closeModal } = useModal();

	useEffect(() => {
		if (!openModals.length) {
			setSelectedItem(null);
		}
	}, [openModals]);

	return (
		<div className={styles.adminTabs}>
			<OpenModal name="AddItem" styles="flex items-center my-4">
				<Button type="primary" border text="Add New Item"></Button>
			</OpenModal>
			<div className={styles.searchBar}>
				<SearchBar
					searchQuery={query}
					setSearchQuery={setQuery}
					placeholder="Search existing items"
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
										onClick={() => setSelectedItem(result)}
										name="EditItem"
									>
										<Button type="primary">
											<RiEdit2Line />
										</Button>
									</OpenModal>
									<OpenModal
										onClick={() => setSelectedItem(result)}
										name="DeleteItem"
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
			<Modal name={'AddItem'} title="Add new item">
				<AddItem />
			</Modal>
			{selectedItem && openModals.includes('EditItem') ? (
				<Modal name="EditItem" title={`Edit ${selectedItem.name} `}>
					<AddItem item={selectedItem} />
				</Modal>
			) : null}
			{selectedItem && openModals.includes('DeleteItem') ? (
				<Modal name="DeleteItem" customSize="small">
					<div className="modal--p-and-button">
						<p className="text-center">
							Are you sure you would like to delete this item?
						</p>
						<Button
							onClick={() => {
								deleteItem(selectedItem._id);
								closeModal('DeleteItem');
							}}
							text="Delete Item"
							border
						/>
					</div>
				</Modal>
			) : null}
		</div>
	);
};

export default ItemsTab;
