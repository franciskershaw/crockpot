import { FC, useState } from 'react';
import { Item } from '@/src/types/types';
import TextInput from '../FormComponents/TextInput/TextInput';
import useItemCategories from '@/src/hooks/items/useItemCategories';
import SelectInput from '../FormComponents/SelectInput/SelectInput';
import Button from '../Button/Button';

interface AddItemProps {
	setModal?: (open: boolean) => void;
	item?: Item;
}

const AddItem: FC<AddItemProps> = ({ setModal, item }) => {
	const [name, setName] = useState<string>(item?.name || '');
	const [category, setCategory] = useState<string>(item?.category || '');

	const { itemCategories } = useItemCategories();

	const handleCategoryChange = (newCategories: string[]) => {
		const newCategory = newCategories[0];
		setCategory(newCategory);
	};

	return (
		<form onSubmit={(e) => e.preventDefault()} className=' h-56'>
			<div className='w-full'>
				<SelectInput
					id='category'
					options={itemCategories.map((category) => ({
						value: category._id,
						label: category.name,
					}))}
					value={category}
					label='Select relevant category'
					onChange={handleCategoryChange}
				/>
			</div>
			<div className='w-full'>
				<TextInput
					label='Item name'
					id='name'
					value={name}
					onChange={(name) => setName(name)}
				/>
			</div>
			<div className='flex justify-center items-center'>
				<Button text='Submit' type='primary' border />
			</div>
		</form>
	);
};

export default AddItem;
