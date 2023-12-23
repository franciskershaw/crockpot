import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/src/providers/Providers';
import useUser from '../auth/useUser';
import useAxios from '../axios/useAxios';

const useAddRecipe = () => {
	const { user } = useUser();
	const queryClient = useQueryClient();
	const api = useAxios();

	const addRecipe = async (recipeData: FormData) => {
		const config = {
			headers: {
				Authorization: `Bearer ${user.accessToken}`,
				'Content-Type': 'multipart/form-data',
			},
		};

		const response = await api.post(`/api/recipes`, recipeData, config);

		return response.data;
	};

	const { mutate } = useMutation((formData: FormData) => addRecipe(formData), {
		onSuccess: async (data) => {
			console.log(data);
			await queryClient.invalidateQueries([queryKeys.recipes], {});
		},
		onError: (data) => {
			console.log(data);
		},
	});

	return mutate;
};

export { useAddRecipe };
