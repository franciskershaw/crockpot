'use client';

import useProtectedRoute from '@/hooks/auth/useProtectedRoute';

import LoadingSpinner from '@/components/Loading/LoadingSpinner';
import Tabs from '@/components/Tabs/Tabs';

import Favourites from './tabs/Favourites/Favourites';
import Menu from './tabs/Menu/Menu';
import MyRecipes from './tabs/MyRecipes/MyRecipes';

const YourCrockpotPage = () => {
	const { user } = useProtectedRoute();

	if (!user) {
		return <LoadingSpinner />;
	}

	const tabTitles = ['Menu', 'Favourites', 'My Recipes'];

	return (
		<div className="container pt-3 md:pt-4">
			<Tabs titles={tabTitles}>
				<div className="md:mt-4">
					<Menu />
				</div>
				<div className="mt-4">
					<Favourites />
				</div>
				<div className="mt-4">
					<MyRecipes />
				</div>
			</Tabs>
		</div>
	);
};

export default YourCrockpotPage;
