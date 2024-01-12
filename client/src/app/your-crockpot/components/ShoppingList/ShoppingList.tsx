import SearchBar from '@/src/components/FormSearchBar/SearchBar';
import { useState, useMemo } from 'react';
import Accordion from '@/src/components/Accordion/Accordion';
import useShoppingList from '../../hooks/useShoppingList';
import useExtraItems from '../../hooks/useExtraItems';
import useRecipeMenu from '../../hooks/useRecipeMenu';
import { FaQuestion } from 'react-icons/fa';
import Icon from '@/src/components/Icon/Icon';
import iconMapping from '@/src/components/Icon/iconMapping';
import ShoppingListItem from './ShoppingListItem';
import Button from '@/src/components/Button/Button';
import useItems from '@/src/hooks/items/useItems';
import Modal from '@/src/components/Modal/Modal';
import QuantityInput from '@/src/components/QuantityInput/QuantityInput';
import { Item } from '@/src/types/types';

const ShoppingList = () => {
	const [searchQuery, setSearchQuery] = useState('');
	const [extraQuantity, setExtraQuantity] = useState(0);
	const [extraUnit, setExtraUnit] = useState('');

	const { groupedShoppingList } = useShoppingList();
	const { clearExtraItems, updateExtraItems } = useExtraItems();

	const { filterItems, allItems } = useItems();

	const { recipeMenu, updateRecipeMenu } = useRecipeMenu();

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
					{searchResults.length ? (
						<div className='absolute top-full left-0 z-10 w-full bg-white border border-black-25 shadow'>
							{searchResults.map((result) => (
								<Modal
									key={result._id}
									title={`Add extra ${result.name} to Shopping List`}
									trigger={<p>{result.name}</p>}
								>
									<div className='flex flex-col items-center gap-4 p-8'>
										<div className='flex items-center justify-center gap-8 flex-grow mb-4'>
											<div className='flex flex-col gap-2'>
												<label htmlFor=''>Amount</label>
												<QuantityInput
													value={extraQuantity}
													setValue={setExtraQuantity}
												/>
											</div>
											<div className='flex flex-col gap-2'>
												<label htmlFor=''>Unit (if applicable)</label>
												<select
													className='border-2 rounded h-[44px] text-xl w-full py-1'
													name=''
													id=''
													onChange={(e) => setExtraUnit(e.target.value)}
													value={extraUnit}
												>
													<option value=''>-</option>
													<option value='cans'>Cans</option>
													<option value='g'>g</option>
													<option value='ml'>ml</option>
													<option value='tbsp'>Tablespoons</option>
													<option value='tsp'>Teaspoons</option>
												</select>
											</div>
										</div>
										<Button
											onClick={() => handleAddExtraItem(result)}
											inverse
											text='Add to Shopping List'
										/>
									</div>
								</Modal>
							))}
						</div>
					) : null}
				</div>
				<div className='md:hidden'>
					<Button
						onClick={() => clearExtraItems()}
						type='primary'
						border
						text='Clear Extra Items'
					/>
				</div>

				{recipeMenu.length ? (
					<div className='hidden md:flex justify-center md:space-y-2 lg:space-y-0 lg:space-x-2 w-full md:flex-col lg:flex-row'>
						<Button
							onClick={() => clearExtraItems()}
							type='primary'
							border
							text='Clear Extra Items'
						/>
						<Button
							onClick={() => updateRecipeMenu({ type: 'clear' })}
							type='primary'
							border
							text='Clear Menu'
						/>
					</div>
				) : null}
			</div>
			{/* Shopping list */}
			<Accordion items={accordionItems} />
		</div>
	);
};

export default ShoppingList;
