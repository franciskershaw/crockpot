import React from 'react';
import { AiFillFilter } from 'react-icons/ai';
import { GrRefresh } from 'react-icons/gr';

import Button from '@/src/components/Button/Button';
import SearchBar from '@/src/components/FormSearchBar/SearchBar';
import Modal from '@/src/components/Modal/Modal';
import BrowsePageFiltersMenu from './BrowsePageFiltersMenu';
import { useBrowsePageContext } from '../context/BrowsePageContext';

function BrowsePageSearchBar() {
	const { recipeSearchQuery, setRecipeSearchQuery, resetFilters } =
		useBrowsePageContext();

	return (
		<div className="flex space-x-2 p-2">
			<SearchBar
				searchQuery={recipeSearchQuery}
				setSearchQuery={setRecipeSearchQuery}
			/>
			<div className="md:hidden">
				<Modal
					title="Recipe Filters"
					trigger={
						<Button type="primary" border>
							<AiFillFilter />
						</Button>
					}
				>
					<BrowsePageFiltersMenu />
				</Modal>
			</div>
			<div className="md:hidden">
				<Button type="primary" border onClick={resetFilters}>
					<GrRefresh />
				</Button>
			</div>
			<div className="hidden md:block">
				<Button
					onClick={resetFilters}
					text={'Clear filters'}
					type="primary"
					border
				/>
			</div>
		</div>
	);
}

export default BrowsePageSearchBar;
