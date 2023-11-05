import Button from '@/src/components/Button/Button';
import SearchBar from '@/src/components/FormSearchBar/SearchBar';
import Modal from '@/src/components/Modal/Modal';
import React from 'react';
import { AiFillFilter } from 'react-icons/ai';
import { GrRefresh } from 'react-icons/gr';
import BrowsePageFiltersMenu from './BrowsePageFiltersMenu';
import { useBrowsePageContext } from '../context/BrowsePageContext';

function BrowsePageSearchBar() {
	const { recipeSearchQuery, setRecipeSearchQuery, resetFilters } =
		useBrowsePageContext();

	return (
		<>
			<div className="w-full">
				<SearchBar
					searchQuery={recipeSearchQuery}
					setSearchQuery={setRecipeSearchQuery}
				/>
			</div>
			<div className="md:hidden">
				<Modal
					title="Recipe Filters"
					trigger={
						<Button border>
							<AiFillFilter />
						</Button>
					}
				>
					<BrowsePageFiltersMenu />
				</Modal>
			</div>
			<div className="md:hidden">
				<Button border onClick={resetFilters}>
					<GrRefresh />
				</Button>
			</div>
			<div className="hidden md:block">
				<Button border onClick={resetFilters} text={'Clear filters'} />
			</div>
		</>
	);
}

export default BrowsePageSearchBar;
