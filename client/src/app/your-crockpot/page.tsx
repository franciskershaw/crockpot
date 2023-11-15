'use client';

import Tabs from '@/src/components/Tabs/Tabs';
import Menu from './tabs/Menu/Menu';
import Favourites from './tabs/Favourites/Favourites';
import MyRecipes from './tabs/MyRecipes/MyRecipes';
import useProtectedRoute from '@/src/hooks/auth/useProtectedRoute';

const YourCrockpotPage = () => {
	const { user } = useProtectedRoute();

	if (!user) {
		return <div>Loading...</div>;
	}

	const tabTitles = ['Menu', 'Favourites', 'My Recipes'];

	return (
		<Tabs titles={tabTitles}>
			<Menu />
			<Favourites />
			<MyRecipes />
		</Tabs>
	);
};

export default YourCrockpotPage;
