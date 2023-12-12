import React, { FC } from 'react';

interface SearchResultsContainerProps {
	children: React.ReactNode;
}

const SearchResultsContainer: FC<SearchResultsContainerProps> = ({
	children,
}) => {
	return (
		<div className='absolute top-full left-0 z-10 w-full bg-white border border-black-25 shadow'>
			{children}
		</div>
	);
};

export default SearchResultsContainer;
