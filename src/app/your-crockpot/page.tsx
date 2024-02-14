'use client';

import useProtectedRoute from '@/hooks/auth/useProtectedRoute';

import LoadingSpinner from '@/components/Loading/LoadingSpinner';
import Modal from '@/components/Modal/Modal';
import { useModal } from '@/components/Modal/ModalContext';
import RecipeCardModal from '@/components/RecipeCardModal/RecipeCardModal';
import Tabs from '@/components/Tabs/Tabs';

import Favourites from './tabs/Favourites/Favourites';
import Menu from './tabs/Menu/Menu';
import MyRecipes from './tabs/MyRecipes/MyRecipes';

const YourCrockpotPage = () => {
	const { user } = useProtectedRoute();
	const { selectedRecipe, setSelectedRecipe } = useModal();

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
			{selectedRecipe ? (
				<Modal
					title={
						<div className="flex">
							<div className="lowercase">
								{selectedRecipe.timeInMinutes} mins
							</div>
							{selectedRecipe.categories.map((category, index) => (
								<div key={index} className="ml-2 pl-2 border-l border-white">
									{category.name}
								</div>
							))}
						</div>
					}
					name="RecipeModal"
					onClose={() => setSelectedRecipe(null)}
				>
					<RecipeCardModal recipe={selectedRecipe} />
				</Modal>
			) : null}
		</div>
	);
};

export default YourCrockpotPage;
