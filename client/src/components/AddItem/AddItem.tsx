import { FC, useState } from 'react';

import { Item } from '@/src/types/types';

import { useAddItem, useEditItem } from '@/src/hooks/items/useAddEditItem';
import useItemCategories from '@/src/hooks/items/useItemCategories';

import Button from '../Button/Button';
import SelectInput from '../FormComponents/SelectInput/SelectInput';
import TextInput from '../FormComponents/TextInput/TextInput';

interface AddItemProps {
	setModal?: (open: boolean) => void;
	item?: Item;
}

const AddItem: FC<AddItemProps> = ({ setModal, item }) => {
	const [name, setName] = useState<string>(item?.name || '');
	const [nameError, setNameError] = useState('');
	const [category, setCategory] = useState<string>(item?.category || '');
	const [categoryError, setCategoryError] = useState('');

	const { itemCategories } = useItemCategories();

	const addItem = useAddItem();
	const editItem = useEditItem();

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

		if (setModal) setModal(false);
	};

	return (
		<form onSubmit={(e) => e.preventDefault()} className=" h-56">
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
				label="Select relevant category"
				onChange={handleCategoryChange}
				error={categoryError}
			/>

			<div className="flex justify-center items-center">
				<Button text="Submit" type="primary" border onClick={handleSubmit} />
			</div>
		</form>
	);
};

export default AddItem;
