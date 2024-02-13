import React from 'react';
import { AiFillFilter } from 'react-icons/ai';
import { GrRefresh } from 'react-icons/gr';

import { useBrowsePageContext } from '../context/BrowsePageContext';

import Button from '@/src/components/Button/Button';
import SearchBar from '@/src/components/FormSearchBar/SearchBar';
import Modal from '@/src/components/Modal/Modal';

import BrowsePageFiltersMenu from './BrowsePageFiltersMenu';

function BrowsePageSearchBar() {
	const { recipeSearchQuery, setRecipeSearchQuery, resetFilters } =
		useBrowsePageContext();

	return (
		<div className="flex space-x-2 pb-2 pt-4">
			<SearchBar
				searchQuery={recipeSearchQuery}
				setSearchQuery={setRecipeSearchQuery}
			/>
			<div className="md:hidden">
				<Modal
					title="Recipe Filters"
					size="sm"
					trigger={
						<Button type="primary">
							<AiFillFilter />
						</Button>
					}
				>
					<BrowsePageFiltersMenu />
				</Modal>
			</div>
			<div className="md:hidden">
				<Button type="primary" onClick={resetFilters}>
					<GrRefresh />
				</Button>
			</div>
			<div className="hidden md:block">
				<Button onClick={resetFilters} text={'Clear Filters'} type="primary" />
			</div>
		</div>
	);
}

export default BrowsePageSearchBar;
