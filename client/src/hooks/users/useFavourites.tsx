import { useQuery, useQueryClient } from '@tanstack/react-query';
import useAxios from '../axios/useAxios';
import useUser from '../auth/useUser';
import { createConfig } from '@/src/helper';

type FavouriteVariables = {
	recipeId: string;
};

const useFavourites = () => {
	const queryClient = useQueryClient();
	const api = useAxios();
	const { user } = useUser();

	// Requests
	const getFavouriteRecipesReq = async () => {
		if (!user) {
			throw new Error('User is not authenticated');
		}
		const config = createConfig(user);
		const response = await api.get('/api/users/favourites', config);
		return response.data;
	};

	const { data: favouriteRecipes = [] } = useQuery(
		[user.favouriteRecipes],
		getFavouriteRecipesReq,
		{
			enabled: !!user,
		},
	);

	return {
		favouriteRecipes,
	};
};

export default useFavourites;
