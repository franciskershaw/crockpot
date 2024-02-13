import { toast } from 'react-toastify';

import { queryKeys } from '@/src/providers/Providers';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { Recipe } from '@/src/types/types';

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
		onSuccess: async (data: Recipe) => {
			await queryClient.invalidateQueries([queryKeys.recipes], {});
			toast.success(`New recipe created: ${data.name}`);
		},
		onError: (error: AxiosError) => {
			const message = (error.response?.data as { message?: string })?.message;
			toast.error(message || 'Error adding recipe');
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
		onSuccess: async (data: Recipe) => {
			await queryClient.invalidateQueries([queryKeys.recipes]);
			toast.success(`Recipe saved: ${data.name}`);
		},
		onError: (error: AxiosError) => {
			const message = (error.response?.data as { message?: string })?.message;
			toast.error(message || 'Error editting recipe');
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
			toast.success('Recipe deleted');
		},
		onError: (error: AxiosError) => {
			const message = (error.response?.data as { message?: string })?.message;
			toast.error(message || 'Error deleting recipe');
		},
	});

	return mutate;
};

export { useAddRecipe, useEditRecipe, useDeleteRecipe };
