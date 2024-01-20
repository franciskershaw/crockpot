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
		<div className="relative w-full">
			{label ? <label htmlFor="">{label}</label> : ''}
			<input
				className="border-black border-2 bg-white p-2 rounded w-full focus-visible:black"
				type="text"
				placeholder={placeholder || 'Search for...'}
				value={searchQuery}
				onChange={handleInputChange}
			/>
			<div className="absolute bottom-0 right-0 p-1.5 pl-10">
				<Icon type="primary">
					<AiOutlineSearch />
				</Icon>
			</div>
			{error && <p className="pt-2 text-error text-xs">{error}</p>}
		</div>
	);
};

export default SearchBar;
