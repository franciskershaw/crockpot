import { AiOutlineSearch } from 'react-icons/ai';
import { useState } from 'react';
import Icon from '../Icon/Icon';

type SearchBarProps = {
	label?: string;
	placeholder?: string;
	searchQuery: string;
	setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
};

const SearchBar = ({
	label,
	placeholder,
	searchQuery,
	setSearchQuery,
}: SearchBarProps) => {
	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(event.target.value);
	};

	return (
		<div className="relative">
			{label ? (
				<label className="mr-2 text-xs" htmlFor="">
					{label}
				</label>
			) : (
				''
			)}
			<input
				className="border-black border-2 bg-white p-2 rounded w-full"
				type="text"
				placeholder={placeholder || 'Search for...'}
				value={searchQuery}
				onChange={handleInputChange}
			/>
			<div className="absolute bottom-0 right-0 p-1.5 pl-10">
				<Icon>
					<AiOutlineSearch />
				</Icon>
			</div>
		</div>
	);
};

export default SearchBar;
