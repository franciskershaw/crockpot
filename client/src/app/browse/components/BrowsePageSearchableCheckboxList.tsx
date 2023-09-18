import React, { useEffect, useState } from 'react';
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
	onCheckboxChange?: (id: string, isChecked: boolean) => void;
};

type CheckboxState = {
	[key: string]: boolean;
};

const BrowsePageSearchableCheckboxList: React.FC<
	BrowsePageSearchableCheckboxListProps
> = ({ title, placeholderText, checkboxes, onCheckboxChange }) => {
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [showAllCheckboxes, setShowAllCheckboxes] = useState(false);
	const [checkboxStates, setCheckboxStates] = useState<CheckboxState>({});

	const initialVisibleCheckboxes = 5;

	const handleCheckboxChange = (label: string, isChecked: boolean) => {
		if (onCheckboxChange) {
			onCheckboxChange(label, isChecked);
		}

		setCheckboxStates((prevState) => ({
			...prevState,
			[label]: isChecked,
		}));
	};

	const filteredCheckboxes = checkboxes.filter((checkbox) =>
		checkbox.name.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	useEffect(() => {
		console.log(title, checkboxStates);
	}, [title, checkboxStates]);

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
								label={checkbox.name}
								onChange={(isChecked: boolean) =>
									handleCheckboxChange(checkbox._id, isChecked)
								}
								isChecked={checkboxStates[checkbox._id] || false}
							/>
						</div>
					))
				)}
			</div>
		</div>
	);
};

export default BrowsePageSearchableCheckboxList;
