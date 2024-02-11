import React, { useState } from 'react';

import {
	CheckboxData,
	useBrowsePageContext,
} from '../context/BrowsePageContext';

import Checkbox from '@/src/components/Checkbox/Checkbox';
import SearchBar from '@/src/components/FormSearchBar/SearchBar';

type BrowsePageSearchableCheckboxListProps = {
	title: string;
	placeholderText: string;
	checkboxes: CheckboxData[];
	onCheckboxChange?: (item: CheckboxData, isChecked: boolean) => void;
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

	const handleCheckboxChange = (
		checkboxData: CheckboxData,
		isChecked: boolean,
	) => {
		setSelected((prevSelected: CheckboxData[]) => {
			if (isChecked) {
				// Add the checkboxData object to the array
				return [...prevSelected, checkboxData];
			} else {
				// Remove the checkboxData object from the array based on _id
				return prevSelected.filter(
					(item: CheckboxData) => item._id !== checkboxData._id,
				);
			}
		});
	};

	const initialVisibleCheckboxes = 5;

	const filteredCheckboxes = checkboxes.filter((checkbox) =>
		checkbox.name.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	return (
		<div className="space-y-2">
			<div className="flex justify-between">
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
			<div className="space-y-1 overflow-y-scroll max-h-64 md:max-h-80 bg-primary-light">
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
									handleCheckboxChange(checkbox, isChecked)
								}
								isChecked={selectedItems.some(
									(item: CheckboxData) => item._id === checkbox._id,
								)}
							/>
						</div>
					))
				)}
			</div>
		</div>
	);
};

export default BrowsePageSearchableCheckboxList;
