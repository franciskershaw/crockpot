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
				<div className="md:mt-4">
					<Menu />
				</div>
				<div className="md:mt-4">
					<Favourites />
				</div>
				<div className="md:mt-4">
					<MyRecipes />
				</div>
			</Tabs>
		</div>
	);
};

export default YourCrockpotPage;
