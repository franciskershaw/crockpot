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
					{filteredCheckboxes.map((checkbox, index) => (
						<div
							key={checkbox}
							className={
								index > initialVisibleCheckboxes && !showAllCategories
									? 'hidden'
									: ''
							}
						>
							<Checkbox
								label={checkbox}
								onChange={(isChecked: boolean) =>
									handleCheckboxChange(checkbox, isChecked)
								}
								isChecked={checkboxStates[checkbox] || false}
							/>
						</div>
					))}
				</div>
				{checkboxes.length > initialVisibleCheckboxes ? (
					<h4
						className="cursor-pointer underline"
						onClick={() => setShowAllCategories(!showAllCategories)}
					>
						{showAllCategories
							? `Hide ${
									checkboxes.length - initialVisibleCheckboxes - 1
							  } additional ${title.toLowerCase()}`
							: `Show ${
									checkboxes.length - initialVisibleCheckboxes - 1
							  } additional ${title.toLowerCase()}`}
					</h4>
				) : null}
			</div>
		</div>
	);
};

export default BrowsePageSearchableCheckboxList;
