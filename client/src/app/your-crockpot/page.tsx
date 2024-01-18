'use client';

import Favourites from './tabs/Favourites/Favourites';
import Menu from './tabs/Menu/Menu';
import MyRecipes from './tabs/MyRecipes/MyRecipes';

import useProtectedRoute from '@/src/hooks/auth/useProtectedRoute';

import LoadingSpinner from '@/src/components/Loading/LoadingSpinner';
import Tabs from '@/src/components/Tabs/Tabs';

const YourCrockpotPage = () => {
	const { user } = useProtectedRoute();

	if (!user) {
		return <LoadingSpinner />;
	}

	const tabTitles = ['Menu', 'Favourites', 'My Recipes'];

	return (
		<div className="container pt-4 md:pt-0">
			<Tabs titles={tabTitles}>
				<Menu />
				<Favourites />
				<MyRecipes />
			</Tabs>
		</div>
	);
};

export default YourCrockpotPage;
