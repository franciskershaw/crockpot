'use client';

import useProtectedRoute from '@/src/hooks/auth/useProtectedRoute';

import LoadingSpinner from '@/src/components/Loading/LoadingSpinner';
import Tabs from '@/src/components/Tabs/Tabs';

import ItemsTab from './tabs/items/ItemsTab';
import RecipesTab from './tabs/recipes/RecipesTab';

const AdminPage = () => {
	const { fetchingUser } = useProtectedRoute('/your-crockpot', true);

	const tabTitles = ['Recipes', 'Items'];

	if (fetchingUser) {
		return <LoadingSpinner />;
	}

	return (
		<div className="container pt-3 md:pt-4">
			<Tabs titles={tabTitles}>
				<RecipesTab />
				<ItemsTab />
			</Tabs>
		</div>
	);
};

export default AdminPage;
