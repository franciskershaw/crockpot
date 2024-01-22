import { AiOutlineSearch } from 'react-icons/ai';

import Icon from '@/src/components/Icon/Icon';

type SearchBarProps = {
	label?: string;
	placeholder?: string;
	searchQuery: string;
	setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
	error?: string;
};

const SearchBar = ({
	label,
	placeholder,
	searchQuery,
	setSearchQuery,
	error = '',
}: SearchBarProps) => {
	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(event.target.value);
	};

	return (
		<div className="w-full">
			{label ? <label htmlFor="">{label}</label> : ''}
			<input
				className="searchbar"
				type="text"
				placeholder={placeholder || 'Search for...'}
				value={searchQuery}
				onChange={handleInputChange}
			/>
			{error && <p className="error">{error}</p>}
		</div>
	);
};

export default SearchBar;
