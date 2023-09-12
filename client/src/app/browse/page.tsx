'use client';

import RecipeCardList from '../../components/RecipeCardList/RecipeCardList';
import BrowsePageFiltersMenu from './components/BrowsePageFiltersMenu';
import BrowsePageSearchBar from './components/BrowsePageSearchBar';

const BrowsePage = () => {
	return (
		<>
			<div className="container flex py-4 space-x-2 bg-white bg-opacity-90 fixed z-10 md:hidden">
				<BrowsePageSearchBar />
			</div>
			<div className="container !px-0 md:flex">
				<div className="container pt-20 md:pt-0 md:w-1/3 md:pr-4">
					<div className="hidden md:block md:sticky md:top-[110px]">
						<BrowsePageFiltersMenu />
					</div>
				</div>
				<div className="container md:w-2/3 md:pl-4">
					<div className="hidden md:flex space-x-2 mb-4">
						<BrowsePageSearchBar />
					</div>
					<RecipeCardList />
				</div>
			</div>
		</>
	);
};

export default BrowsePage;
