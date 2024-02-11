import { toast } from 'react-toastify';

import { useRouter } from 'next/navigation';

import { queryKeys } from '@/providers/Providers';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { User } from '@/types/types';

const useAxios = () => {
	const router = useRouter();
	const queryClient = useQueryClient();

	const api = axios.create({
		baseURL: process.env.NEXT_PUBLIC_API_URL,
		withCredentials: true,
	});

	api.interceptors.response.use(
		(response) => response,
		async (error) => {
			if (
				error.response.status === 401 &&
				(error.response.data.errorCode === 'SESSION_EXPIRED' ||
					error.response.data.errorCode === 'INVALID_TOKEN')
			) {
				try {
					const originalRequest = error.config;
					const response = await api.get('/api/users/refreshToken');
					originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
					queryClient.setQueryData<User>([queryKeys.user], (oldData) => {
						if (!oldData) {
							return oldData;
						}
						return {
							...oldData,
							accessToken: response.data.accessToken,
						};
					});
					return api(originalRequest);
				} catch (error) {
					queryClient.setQueryData([queryKeys.user], null);
					queryClient.removeQueries([queryKeys.favouriteRecipes]);
					queryClient.removeQueries([queryKeys.shoppingList]);
					queryClient.removeQueries([queryKeys.extraItems]);
					queryClient.removeQueries([queryKeys.recipeMenu]);
					router.push('/');
				}
			} else {
				if (error.response.data.errorCode !== 'NO_TOKEN')
					toast.error(error.response.data.message);
			}
		},
	);

	return api;
};

export default useAxios;
