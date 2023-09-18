import React, { useState } from 'react';
import SearchBar from '@/src/components/FormSearchBar/SearchBar';
import Checkbox from '@/src/components/Checkbox/Checkbox';
import { useBrowsePageContext } from '../context/BrowsePageContext';

type CheckboxData = {
	_id: string;
	name: string;
};

type BrowsePageSearchableCheckboxListProps = {
	title: string;
	placeholderText: string;
	checkboxes: CheckboxData[];
	onCheckboxChange?: (id: string, isChecked: boolean) => void;
	listType: 'category' | 'ingredient';
};

const BrowsePageSearchableCheckboxList: React.FC<
	BrowsePageSearchableCheckboxListProps
> = ({ title, placeholderText, checkboxes, listType }) => {
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [showAllCheckboxes, setShowAllCheckboxes] = useState(false);
	const {
		selectedCategories,
		selectedIngredients,
		setSelectedCategories,
		setSelectedIngredients,
	} = useBrowsePageContext();

	// Choose the appropriate selected items based on listType
	const selectedItems =
		listType === 'category' ? selectedCategories : selectedIngredients;

	// Choose the appropriate setSelected function based on listType
	const setSelected =
		listType === 'category' ? setSelectedCategories : setSelectedIngredients;

	const handleCheckboxChange = (id: string, isChecked: boolean) => {
		setSelected((prevSelected: string[]) => {
			if (isChecked) {
				return [...prevSelected, id];
			} else {
				return prevSelected.filter((itemId: string) => itemId !== id);
			}
		});
	};

	const initialVisibleCheckboxes = 5;

	const filteredCheckboxes = checkboxes.filter((checkbox) =>
		checkbox.name.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	return (
		<div>
			<div className="flex justify-between mb-2">
				<h3>
					{title} ({checkboxes.length})
				</h3>
				{checkboxes.length > initialVisibleCheckboxes ? (
					<h4
						className="cursor-pointer underline my-auto"
						onClick={() => setShowAllCheckboxes(!showAllCheckboxes)}
					>
						{showAllCheckboxes ? 'Hide' : 'Show'}
					</h4>
				) : null}
			</div>
			<SearchBar
				placeholder={placeholderText}
				searchQuery={searchQuery}
				setSearchQuery={setSearchQuery}
			/>
			<div className="mt-2 space-y-1 overflow-scroll max-h-[250px] bg-white p-2">
				{filteredCheckboxes.length === 0 ? (
					<h4 className="text-center">0 results</h4>
				) : (
					filteredCheckboxes.map((checkbox, index) => (
						<div
							key={checkbox._id}
							className={
								index > initialVisibleCheckboxes && !showAllCheckboxes
									? 'hidden'
									: ''
							}
						>
							<Checkbox
								key={checkbox._id}
								label={checkbox.name}
								onChange={(isChecked: boolean) =>
									handleCheckboxChange(checkbox._id, isChecked)
								}
								isChecked={selectedItems.includes(checkbox._id)} // <-- Change here
							/>
						</div>
					))
				)}
			</div>
		</div>
	);
};

export default BrowsePageSearchableCheckboxList;
