'use client';

import useProtectedRoute from '@/src/hooks/auth/useProtectedRoute';

import Tabs from '@/src/components/Tabs/Tabs';

import Favourites from './tabs/Favourites/Favourites';
import Menu from './tabs/Menu/Menu';
import MyRecipes from './tabs/MyRecipes/MyRecipes';

const YourCrockpotPage = () => {
	const { user } = useProtectedRoute();

	if (!user) {
		return <div>Loading...</div>;
	}

	const tabTitles = ['Menu', 'Favourites', 'My Recipes'];

	return (
		<div className="container">
			<Tabs titles={tabTitles}>
				<Menu />
				<Favourites />
				<MyRecipes />
			</Tabs>
		</div>
	);
};

export default YourCrockpotPage;
