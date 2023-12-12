import React from 'react';

type SearchResultsProps<T> = {
	results: T[];
	children: (result: T) => React.ReactNode;
};

function SearchResults<T>({ results, children }: SearchResultsProps<T>) {
	if (results.length === 0) {
		return null;
	}

	return (
		<div className='absolute top-full left-0 z-10 w-full bg-white border border-black-25 shadow'>
			{results.map((result, index) => (
				<React.Fragment key={index}>{children(result)}</React.Fragment>
			))}
		</div>
	);
}

export default SearchResults;
