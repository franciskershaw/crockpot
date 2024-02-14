import React from 'react';
import { AiFillFilter } from 'react-icons/ai';
import { GrRefresh } from 'react-icons/gr';

import { useBrowsePageContext } from '../context/BrowsePageContext';

import Button from '@/components/Button/Button';
import SearchBar from '@/components/FormSearchBar/SearchBar';
import Modal2 from '@/components/Modal2/Modal2';
import OpenModal from '@/components/Modal2/OpenModal';
import Modal from '@/components/Modal/Modal';

import BrowsePageFiltersMenu from './BrowsePageFiltersMenu';

function BrowsePageSearchBar() {
	const { recipeSearchQuery, setRecipeSearchQuery, resetFilters } =
		useBrowsePageContext();

	return (
		<>
			<div className="flex space-x-2 pb-2 pt-4">
				<SearchBar
					searchQuery={recipeSearchQuery}
					setSearchQuery={setRecipeSearchQuery}
				/>
				<div className="md:hidden">
					<OpenModal name="mobBrowseFilters">
						<Button type="primary">
							<AiFillFilter />
						</Button>
					</OpenModal>
				</div>
				<div className="md:hidden">
					<Button type="primary" onClick={resetFilters}>
						<GrRefresh />
					</Button>
				</div>
				<div className="hidden md:block">
					<Button
						onClick={resetFilters}
						text={'Clear Filters'}
						type="primary"
					/>
				</div>
			</div>
			<Modal2 name="mobBrowseFilters" title="Recipe Filters">
				<BrowsePageFiltersMenu />
			</Modal2>
		</>
	);
}

export default BrowsePageSearchBar;
