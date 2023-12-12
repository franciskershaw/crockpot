import SearchBar from '@/src/components/FormSearchBar/SearchBar';
import { useState, useMemo } from 'react';
import Accordion from '@/src/components/Accordion/Accordion';
import useShoppingList from '../../hooks/useShoppingList';
import useExtraItems from '../../hooks/useExtraItems';
import { FaQuestion } from 'react-icons/fa';
import Icon from '@/src/components/Icon/Icon';
import iconMapping from '@/src/components/Icon/iconMapping';
import ShoppingListItem from './ShoppingListItem';
import Button from '@/src/components/Button/Button';
import useItems from '@/src/hooks/items/useItems';
import Modal from '@/src/components/Modal/Modal';
import QuantityInput from '@/src/components/QuantityInput/QuantityInput';
import { Item } from '@/src/types/types';
import SearchResults from '@/src/components/SearchResults/SearchResults';
import ExtraItemModal from './ExtraItemModal';

const ShoppingList = () => {
	const [searchQuery, setSearchQuery] = useState('');
	const [extraQuantity, setExtraQuantity] = useState(0);
	const [extraUnit, setExtraUnit] = useState('');

	const { groupedShoppingList } = useShoppingList();
	const { clearExtraItems, updateExtraItems } = useExtraItems();

	const { filterItems, allItems } = useItems();

	const accordionItems = useMemo(() => {
		return groupedShoppingList?.map((category) => {
			const IconComponent = iconMapping[category.faIcon] || FaQuestion;
			return {
				heading: (
					<div className='flex overflow-hidden'>
						<Icon type='primary'>
							<IconComponent />
						</Icon>
						<span className='h3 text-left pl-2 pr-1 truncate'>
							{category.categoryName}
						</span>
						<span>
							({category.items.filter((item) => item.obtained).length}/
							{category.items.length})
						</span>
					</div>
				),
				children: (
					<div className='space-y-0.5'>
						{category.items.map((item) => (
							<ShoppingListItem
								key={`${item.item._id}_${item.quantity}_${item.unit}`}
								item={item}
							/>
						))}
					</div>
				),
			};
		});
	}, [groupedShoppingList]);

	const searchResults = useMemo(() => {
		return filterItems(allItems, searchQuery);
	}, [allItems, searchQuery, filterItems]);

	const handleAddExtraItem = (item: Item) => {
		if (extraQuantity > 0) {
			updateExtraItems({
				itemId: item._id,
				body: {
					quantity: extraQuantity,
					unit: extraUnit,
				},
			});
			setSearchQuery('');
			setExtraQuantity(0);
			setExtraUnit('');
		}
	};

	return (
		<div className='flex flex-col'>
			<h2 className='hidden md:block font-bold'>Shopping List</h2>
			<div className='flex space-x-2 md:space-x-0 md:flex-wrap items-end justify-between pb-3'>
				{/* Header and search */}
				<div className='relative w-full md:mb-2'>
					<SearchBar
						searchQuery={searchQuery}
						setSearchQuery={setSearchQuery}
						label='Search Extra Items'
					/>
					<SearchResults results={searchResults}>
						{(result) => (
							<Modal
								key={result._id}
								title={`Add extra ${result.name} to shopping list`}
								trigger={<p>{result.name}</p>}
							>
								<ExtraItemModal
									amountValue={extraQuantity}
									setAmountValue={setExtraQuantity}
									extraUnit={extraUnit}
									setExtraUnit={setExtraUnit}
									onSubmit={() => handleAddExtraItem(result)}
								/>
							</Modal>
						)}
					</SearchResults>
				</div>
				<div className='md:hidden'>
					<Button
						onClick={() => clearExtraItems()}
						type='primary'
						border
						text='Clear Extra Items'
					/>
				</div>
				<div className='hidden md:flex justify-center md:space-y-2 lg:space-y-0 lg:space-x-2 w-full md:flex-col lg:flex-row'>
					<Button
						onClick={() => clearExtraItems()}
						type='primary'
						border
						text='Clear Extra Items'
					/>
					<Button type='primary' border text='Clear Menu' />
				</div>
			</div>
			{/* Shopping list */}
			<Accordion items={accordionItems} />
		</div>
	);
};

export default ShoppingList;
