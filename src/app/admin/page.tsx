'use client';

import Tabs from '@/components/Tabs/Tabs';

import ItemsTab from './tabs/items/ItemsTab';
import RecipesTab from './tabs/recipes/RecipesTab';

const AdminPage = () => {
	const tabTitles = ['Recipes', 'Items'];

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
