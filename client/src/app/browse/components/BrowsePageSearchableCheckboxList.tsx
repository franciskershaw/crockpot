import React, { useState } from 'react';
import SearchBar from '@/src/components/FormSearchBar/SearchBar';
import Checkbox from '@/src/components/Checkbox/Checkbox';

type BrowsePageSearchableCheckboxListProps = {
	title: string;
	placeholderText: string;
	checkboxes: string[];
};

type CheckboxState = {
	[key: string]: boolean;
};

const BrowsePageSearchableCheckboxList: React.FC<
	BrowsePageSearchableCheckboxListProps
> = ({ title, placeholderText, checkboxes }) => {
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [checkboxStates, setCheckboxStates] = useState<CheckboxState>({});

	const handleCheckboxChange = (label: string, isChecked: boolean) => {
		setCheckboxStates((prevState) => ({
			...prevState,
			[label]: isChecked,
		}));
	};

	const filteredCheckboxes = checkboxes.filter((checkbox) =>
		checkbox.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	return (
		<div>
			<h3 className="mb-2">
				{title} ({checkboxes.length})
			</h3>
			<div className="space-y-2">
				<SearchBar
					placeholder={placeholderText}
					searchQuery={searchQuery}
					setSearchQuery={setSearchQuery}
				/>
				<div className="space-y-1">
					{filteredCheckboxes.map((checkbox) => (
						<Checkbox
							key={checkbox}
							label={checkbox}
							onChange={(isChecked: boolean) =>
								handleCheckboxChange(checkbox, isChecked)
							}
							isChecked={checkboxStates[checkbox] || false}
						/>
					))}
				</div>
			</div>
		</div>
	);
};

export default BrowsePageSearchableCheckboxList;
