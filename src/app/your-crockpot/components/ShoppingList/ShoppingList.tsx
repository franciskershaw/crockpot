import { useMemo, useState } from 'react';
import { FaQuestion } from 'react-icons/fa';

import { IShoppingListItem, Item } from '@/types/types';

import useExtraItems from '../../hooks/useExtraItems';
import useRecipeMenu from '../../hooks/useRecipeMenu';
import useShoppingList from '../../hooks/useShoppingList';
import useItems from '@/hooks/items/useItems';

import Accordion from '@/components/Accordion/Accordion';
import Button from '@/components/Button/Button';
import SearchBar from '@/components/FormSearchBar/SearchBar';
import Icon from '@/components/Icon/Icon';
import iconMapping from '@/components/Icon/iconMapping';
import Modal from '@/components/Modal/Modal';
import QuantityInput from '@/components/QuantityInput/QuantityInput';

import ShoppingListItem from './ShoppingListItem';

const ShoppingList = () => {
	const [searchQuery, setSearchQuery] = useState('');
	const [extraQuantity, setExtraQuantity] = useState(0);
	const [extraUnit, setExtraUnit] = useState('');

	const { groupedShoppingList } = useShoppingList();
	const { clearExtraItems, updateExtraItems, extraItems } = useExtraItems();

	const { filterItems, allItems } = useItems();

	const { recipeMenu, updateRecipeMenu } = useRecipeMenu();

	const accordionItems = useMemo(() => {
		return groupedShoppingList?.map((category) => {
			const IconComponent = iconMapping[category.faIcon] || FaQuestion;
			return {
				heading: (
					<div className="flex items-center overflow-hidden">
						<Icon type="primary">
							<div className="p-0.5">
								<IconComponent />
							</div>
						</Icon>
						<span className="h3 text-left pl-2 pr-1 truncate">
							{category.categoryName}
						</span>
						<span>
							(
							{
								category.items.filter(
									(item: IShoppingListItem) => item.obtained,
								).length
							}
							/{category.items.length})
						</span>
					</div>
				),
				children: (
					<div className="space-y-0.5">
						{category.items.map((item: IShoppingListItem) => (
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
		<div className="p-3 pb-0 md:px-2">
			<div className="hidden md:block space-y-3 mb-3">
				<h2 className="font-bold">Shopping List</h2>
				<hr />
			</div>
			<div className="space-y-3">
				{/* Searchbar */}
				<div className="flex items-end">
					<div className="relative w-full">
						<SearchBar
							searchQuery={searchQuery}
							setSearchQuery={setSearchQuery}
							label="Search Extra Items"
						/>
						{searchResults.length ? (
							<div className="input-menu-dropdown">
								{searchResults.map((result) => (
									<Modal
										key={result._id}
										title={
											<>
												Add extra <i>{result.name}</i> to shopping list
											</>
										}
										trigger={<p>{result.name}</p>}
										paddingOn
										nested
										size="sm"
									>
										<div className="modal--p-and-button">
											<div className="flex justify-center space-x-4">
												<div>
													<label htmlFor="">Amount</label>
													<QuantityInput
														value={extraQuantity}
														setValue={setExtraQuantity}
													/>
												</div>
												<div>
													<label htmlFor="">Unit</label>
													<select
														name=""
														id=""
														onChange={(e) => setExtraUnit(e.target.value)}
														value={extraUnit}
														className="min-h-[42px] h-[42px]"
													>
														<option value="">-</option>
														<option value="cans">Cans</option>
														<option value="g">g</option>
														<option value="ml">ml</option>
														<option value="tbsp">Tablespoons</option>
														<option value="tsp">Teaspoons</option>
													</select>
												</div>
											</div>
											<Button
												onClick={() => handleAddExtraItem(result)}
												text="Add to Shopping List"
											/>
										</div>
									</Modal>
								))}
							</div>
						) : null}
					</div>
					<div className="md:hidden ml-2">
						<Button
							onClick={() => clearExtraItems()}
							type="primary"
							text="Clear Extra Items"
						/>
					</div>
				</div>
				{/* Clear buttons */}
				{recipeMenu.length || extraItems.length ? (
					<div className="space-x-4 justify-center hidden md:flex">
						{extraItems.length ? (
							<Button
								onClick={() => clearExtraItems()}
								type="primary"
								text="Clear Extra Items"
							/>
						) : null}
						{recipeMenu.length ? (
							<Button
								onClick={() => updateRecipeMenu({ type: 'clear' })}
								type="primary"
								text="Clear Menu"
							/>
						) : null}
					</div>
				) : null}
				{/* Shopping list */}
				<Accordion items={accordionItems} />
			</div>
		</div>
	);
};

export default ShoppingList;
