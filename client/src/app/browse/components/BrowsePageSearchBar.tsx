import Button from '@/src/components/Button/Button';
import SearchBar from '@/src/components/FormSearchBar/SearchBar';
import Modal from '@/src/components/Modal/Modal';
import React, { useState } from 'react';
import { AiFillFilter } from 'react-icons/ai';
import { GrRefresh } from 'react-icons/gr';
import BrowsePageFiltersMenu from './BrowsePageFiltersMenu';

function BrowsePageSearchBar() {
	const [searchQuery, setSearchQuery] = useState('');

	return (
		<>
			<div className="w-full">
				<SearchBar setSearchQuery={setSearchQuery} />
			</div>
			<div className="md:hidden">
				<Modal
					title="My Modal Title"
					trigger={
						<Button border onClick={() => console.log('Hello!')}>
							<AiFillFilter />
						</Button>
					}
				>
					<BrowsePageFiltersMenu />
				</Modal>
			</div>
			<div className="md:hidden">
				<Button border onClick={() => console.log('Hello!')}>
					<GrRefresh />
				</Button>
			</div>
			<div className="hidden md:block">
				<Button
					border
					onClick={() => console.log('Hello!')}
					text={'Clear filters'}
				/>
			</div>
		</>
	);
}

export default BrowsePageSearchBar;
