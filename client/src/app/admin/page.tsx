'use client';

import useProtectedRoute from '@/src/hooks/auth/useProtectedRoute';

import Tabs from '@/src/components/Tabs/Tabs';

import ItemsTab from './tabs/items/ItemsTab';
import RecipesTab from './tabs/recipes/RecipesTab';

const AdminPage = () => {
	const { fetchingUser } = useProtectedRoute('/your-crockpot', true);

	const tabTitles = ['Recipes', 'Items'];

	if (fetchingUser) {
		return <div>Loading...</div>;
	}

	return (
		<div className="container pt-4 md:pt-0">
			<Tabs titles={tabTitles}>
				<RecipesTab />
				<ItemsTab />
			</Tabs>
		</div>
	);
};

export default AdminPage;
