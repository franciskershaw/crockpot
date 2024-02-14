'use client';

import { FC, ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { ModalProvider } from '@/components/Modal2/ModalContext';

interface LayoutProps {
	children: ReactNode;
}

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 300000,
			cacheTime: 900000,
			refetchOnMount: false,
			refetchOnWindowFocus: false,
			retry: 2,
		},
	},
});

export const queryKeys = {
	items: 'items',
	itemCategories: 'itemCategories',
	recipes: 'recipes',
	recipeCategories: 'recipeCategories',
	recipeMenu: 'recipeMenu',
	user: 'user',
	shoppingList: 'shoppingList',
	extraItems: 'extraItems',
	favouriteRecipes: 'favouriteRecipes',
};

const Providers: FC<LayoutProps> = ({ children }) => {
	return (
		<QueryClientProvider client={queryClient}>
			<ModalProvider>
				{children}
				<ReactQueryDevtools initialIsOpen={false} />
				<ToastContainer />
			</ModalProvider>
		</QueryClientProvider>
	);
};

export default Providers;
