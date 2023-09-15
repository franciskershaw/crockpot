import React, { useState } from 'react';
import SearchBar from '@/src/components/FormSearchBar/SearchBar';
import Checkbox from '@/src/components/Checkbox/Checkbox';

type CheckboxData = {
	_id: string;
	name: string;
};

type BrowsePageSearchableCheckboxListProps = {
	title: string;
	placeholderText: string;
	checkboxes: CheckboxData[];
};

type CheckboxState = {
	[key: string]: boolean;
};

const BrowsePageSearchableCheckboxList: React.FC<
	BrowsePageSearchableCheckboxListProps
> = ({ title, placeholderText, checkboxes }) => {
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [showAllCategories, setShowAllCategories] = useState(false);
	const [checkboxStates, setCheckboxStates] = useState<CheckboxState>({});

	const initialVisibleCheckboxes = 2;

	const handleCheckboxChange = (label: string, isChecked: boolean) => {
		setCheckboxStates((prevState) => ({
			...prevState,
			[label]: isChecked,
		}));
	};

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
						onClick={() => setShowAllCategories(!showAllCategories)}
					>
						{showAllCategories ? 'Hide' : 'Show'}
					</h4>
				) : null}
			</div>
			<SearchBar
				placeholder={placeholderText}
				searchQuery={searchQuery}
				setSearchQuery={setSearchQuery}
			/>
			<div className="mt-2 space-y-1 overflow-scroll max-h-[250px] bg-slate-200 p-2">
				{filteredCheckboxes.map((checkbox, index) => (
					<div
						key={checkbox._id}
						className={
							index > initialVisibleCheckboxes && !showAllCategories
								? 'hidden'
								: ''
						}
					>
						<Checkbox
							label={checkbox.name}
							onChange={(isChecked: boolean) =>
								handleCheckboxChange(checkbox._id, isChecked)
							}
							isChecked={checkboxStates[checkbox._id] || false}
						/>
					</div>
				))}
			</div>
		</div>
	);
};

export default BrowsePageSearchableCheckboxList;
