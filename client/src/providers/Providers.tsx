'use client';

import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { FC, ReactNode } from 'react';

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
};

const Providers: FC<LayoutProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default Providers;
