import { useState } from 'react';
import { FaTrash } from 'react-icons/fa';

import { ShoppingListItem as ShoppingListItemType } from '@/src/types/types';

import useExtraItems from '../../hooks/useExtraItems';
import useShoppingList from '../../hooks/useShoppingList';

import Button from '@/src/components/Button/Button';
import Checkbox from '@/src/components/Checkbox/Checkbox';

import './styles.scss';

interface ShoppingListItemProps {
	item: ShoppingListItemType;
}

const ShoppingListItem: React.FC<ShoppingListItemProps> = ({ item }) => {
	const [quantity, setQuantity] = useState(item.quantity);
	const [obtained, setObtained] = useState(item.obtained);

	const { updateExtraItems } = useExtraItems();
	const { toggleObtained } = useShoppingList();

	const handleClickCheckbox = (checked: boolean) => {
		try {
			toggleObtained({
				itemId: item.item._id,
				obtained: checked,
				isExtra: item.extra || false,
			});
			setObtained(checked);
		} catch (err) {
			setObtained(!checked);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const inputValue = e.target.value;

		const parsedQuantity = parseFloat(inputValue);

		setQuantity(isNaN(parsedQuantity) ? 0 : parsedQuantity);
	};

	const handleUpdateQuantity = () => {
		try {
			const extraQuantity = quantity - item.quantity;

			if (extraQuantity !== 0) {
				updateExtraItems({
					itemId: item.item._id,
					body: {
						quantity: extraQuantity,
						unit: item.unit,
					},
				});
			}
		} catch (err) {
			console.log(err);
			setQuantity(item.quantity);
		}
	};

	const handleDeleteItem = () => {
		try {
			updateExtraItems({
				itemId: item.item._id,
				body: {
					quantity: -quantity,
					unit: item.unit,
				},
			});
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div className="flex justify-between" key={item.item._id}>
			<div className="flex items-center overflow-hidden pr-2 space-x-1.5">
				<Checkbox
					label={item.item.name}
					onChange={handleClickCheckbox}
					isChecked={obtained}
				/>
				<span>x</span>
				<input
					type="number"
					name=""
					id=""
					value={
						!isNaN(quantity)
							? quantity.toString().replace(/(\.\d{2})\d+/, '$1')
							: '0'
					}
					onChange={handleChange}
					onBlur={handleUpdateQuantity}
					className="w-[60px] border border-black rounded text-center p-0.5"
				/>
				<span>{item.unit}</span>
			</div>
			<Button onClick={handleDeleteItem} type="primary" border iconXs>
				<FaTrash />
			</Button>
		</div>
	);
};
export default ShoppingListItem;
