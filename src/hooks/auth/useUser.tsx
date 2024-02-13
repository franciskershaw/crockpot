import { queryKeys } from '@/src/providers/Providers';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { User } from '@/src/types/types';

import useAxios from '../axios/useAxios';

const useUser = () => {
	const api = useAxios();
	const queryClient = useQueryClient();

	const getUser = async () => {
		const response = await api.get('/api/users/refreshToken');
		if (response && response.status === 200) {
			const user = await api.get('/api/users', {
				headers: {
					Authorization: `Bearer ${response.data.accessToken}`,
					'Content-Type': 'application/json',
				},
			});
			return user.data;
		} else return null;
	};

	const { data: user, isFetching: fetchingUser } = useQuery(
		[queryKeys.user],
		() => getUser(),
	);

	function updateUser(newUser: User) {
		queryClient.setQueryData([queryKeys.user], newUser);
	}

	async function clearUser() {
		try {
			const response = await api.post('/api/users/logout');
			queryClient.setQueryData([queryKeys.user], null);
			queryClient.removeQueries([queryKeys.recipeMenu]);
			queryClient.removeQueries([queryKeys.shoppingList]);
			queryClient.removeQueries([queryKeys.extraItems]);
			queryClient.removeQueries([queryKeys.favouriteRecipes]);
			return response.data;
		} catch (error) {
			console.log(error);
		}
	}

	return { user: user ?? null, fetchingUser, updateUser, clearUser };
};

export default useUser;
