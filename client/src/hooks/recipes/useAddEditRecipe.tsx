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
		onSuccess: async () => {
			await queryClient.invalidateQueries([queryKeys.recipes], {});
		},
		onError: (data) => {
			console.log(data);
		},
	});

	return mutate;
};

const useEditRecipe = () => {
	const { user } = useUser();
	const queryClient = useQueryClient();
	const api = useAxios();

	const editRecipe = async ({
		formData,
		_id,
	}: {
		formData: FormData;
		_id: string;
	}) => {
		const config = {
			headers: {
				Authorization: `Bearer ${user.accessToken}`,
				'Content-Type': 'multipart/form-data',
			},
		};

		const response = await api.put(`/api/recipes/${_id}`, formData, config);

		return response.data;
	};

	const { mutate } = useMutation(editRecipe, {
		onSuccess: async () => {
			await queryClient.invalidateQueries([queryKeys.recipes]);
		},
		onError: (error) => {
			console.log(error);
		},
	});

	return mutate;
};

const useDeleteRecipe = () => {
	const { user } = useUser();
	const queryClient = useQueryClient();
	const api = useAxios();

	const deleteRecipe = async (_id: string) => {
		const config = {
			headers: {
				Authorization: `Bearer ${user.accessToken}`,
				'Content-Type': 'multipart/form-data',
			},
		};

		const response = await api.delete(`/api/recipes/${_id}`, config);

		return response.data;
	};

	const { mutate } = useMutation(deleteRecipe, {
		onSuccess: async () => {
			await queryClient.invalidateQueries([queryKeys.recipes]);
		},
		onError: (error) => {
			console.log(error);
		},
	});

	return mutate;
};

export { useAddRecipe, useEditRecipe, useDeleteRecipe };
