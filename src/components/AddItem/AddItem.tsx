import { FC, useState } from 'react';

import { Item } from '@/types/types';

import { useAddItem, useEditItem } from '@/hooks/items/useAddEditItem';
import useItemCategories from '@/hooks/items/useItemCategories';

import Button from '@/components/Button/Button';
import SelectInput from '@/components/FormComponents/SelectInput/SelectInput';
import TextInput from '@/components/FormComponents/TextInput/TextInput';

import { useModal } from '../Modal/ModalContext';

interface AddItemProps {
	item?: Item;
}

const AddItem: FC<AddItemProps> = ({ item }) => {
	const [name, setName] = useState<string>(item?.name || '');
	const [nameError, setNameError] = useState('');
	const [category, setCategory] = useState<string>(item?.category || '');
	const [categoryError, setCategoryError] = useState('');

	const { itemCategories } = useItemCategories();

	const addItem = useAddItem();
	const editItem = useEditItem();

	const { closeModal } = useModal();

	const handleNameChange = (name: string) => {
		setNameError('');
		if (!name.trim()) {
			setNameError('Item name is required.');
		}
		setName(name);
	};

	const handleCategoryChange = (newCategories: string[]) => {
		const newCategory = newCategories[0];
		setCategory(newCategory);
	};

	const validateForm = () => {
		let isValid = true;

		if (!name.trim()) {
			setNameError('Item name is required.');
			isValid = false;
		} else {
			setNameError('');
		}

		if (!category.trim()) {
			setCategoryError('Please select a category');
		}
		return isValid;
	};

	const handleSubmit = () => {
		if (!validateForm()) {
			// Prevent form submission if validation fails
			return;
		}
		if (item) {
			editItem({ itemData: { name, category }, _id: item._id });
		} else {
			addItem({ name, category });
		}

		if (item) {
			closeModal('EditItem');
		} else {
			closeModal('AddItem');
		}
	};

	return (
		<form onSubmit={(e) => e.preventDefault()} className="modal--form p-4">
			<TextInput
				label="Item name"
				id="name"
				value={name}
				onChange={handleNameChange}
				error={nameError}
			/>
			<SelectInput
				id="category"
				options={itemCategories.map((category) => ({
					value: category._id,
					label: category.name,
				}))}
				value={category}
				label="Select category"
				onChange={handleCategoryChange}
				error={categoryError}
			/>

			<div className="flex justify-center">
				<Button text="Submit" type="primary" border onClick={handleSubmit} />
			</div>
		</form>
	);
};

export default AddItem;
