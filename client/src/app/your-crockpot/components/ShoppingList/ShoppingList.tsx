import { useMemo, useState } from 'react';
import { FaQuestion } from 'react-icons/fa';

import { Item } from '@/src/types/types';

import useExtraItems from '../../hooks/useExtraItems';
import useRecipeMenu from '../../hooks/useRecipeMenu';
import useShoppingList from '../../hooks/useShoppingList';
import useItems from '@/src/hooks/items/useItems';

import Accordion from '@/src/components/Accordion/Accordion';
import Button from '@/src/components/Button/Button';
import SearchBar from '@/src/components/FormSearchBar/SearchBar';
import Icon from '@/src/components/Icon/Icon';
import iconMapping from '@/src/components/Icon/iconMapping';
import Modal from '@/src/components/Modal/Modal';
import QuantityInput from '@/src/components/QuantityInput/QuantityInput';

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
					<div className="flex overflow-hidden">
						<Icon type="primary">
							<IconComponent />
						</Icon>
						<span className="h3 text-left pl-2 pr-1 truncate">
							{category.categoryName}
						</span>
						<span>
							({category.items.filter((item) => item.obtained).length}/
							{category.items.length})
						</span>
					</div>
				),
				children: (
					<div className="space-y-0.5">
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
							<div className="absolute top-full left-0 z-10 w-full bg-white border border-black-25 shadow p-1 space-y-0.5 rounded-b">
								{searchResults.map((result) => (
									<Modal
										key={result._id}
										title={`Add extra ${result.name} to Shopping List`}
										trigger={<p>{result.name}</p>}
									>
										<div className="p-3 flex flex-col justify-center">
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
														className="border-2 rounded h-[44px] text-xl w-full py-1"
														name=""
														id=""
														onChange={(e) => setExtraUnit(e.target.value)}
														value={extraUnit}
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
											<div className="mx-auto">
												<Button
													onClick={() => handleAddExtraItem(result)}
													text="Add to Shopping List"
													border
												/>
											</div>
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
							border
							text="Clear Extra Items"
						/>
					</div>
				</div>
				{/* Clear buttons */}
				<div className="space-x-4 justify-center hidden md:flex">
					<Button
						onClick={() => clearExtraItems()}
						type="primary"
						border
						text="Clear Extra Items"
					/>
					<Button
						onClick={() => updateRecipeMenu({ type: 'clear' })}
						type="primary"
						border
						text="Clear Menu"
					/>
				</div>
				{/* Shopping list */}
				<Accordion items={accordionItems} />
			</div>
		</div>
	);
};

export default ShoppingList;
