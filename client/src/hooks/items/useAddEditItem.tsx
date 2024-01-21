import { toast } from 'react-toastify';

import { queryKeys } from '@/src/providers/Providers';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { Item } from '@/src/types/types';

import useUser from '../auth/useUser';
import useAxios from '../axios/useAxios';

type itemData = {
	name: string;
	category: string;
};

const useAddItem = () => {
	const { user } = useUser();
	const queryClient = useQueryClient();
	const api = useAxios();

	const addItem = async (itemData: itemData) => {
		const config = {
			headers: {
				Authorization: `Bearer ${user.accessToken}`,
			},
		};

		const response = await api.post(`/api/items`, itemData, config);

		return response.data;
	};

	const { mutate } = useMutation((itemData: itemData) => addItem(itemData), {
		onSuccess: async (data: Item) => {
			await queryClient.invalidateQueries([queryKeys.items], {});
			toast.success(`New item created: ${data.name}`);
		},
		onError: (error: AxiosError) => {
			const message = (error.response?.data as { message?: string })?.message;
			toast.error(message || 'Error adding item');
		},
	});

	return mutate;
};

const useEditItem = () => {
	const { user } = useUser();
	const queryClient = useQueryClient();
	const api = useAxios();

	const editItem = async ({
		itemData,
		_id,
	}: {
		itemData: itemData;
		_id: string;
	}) => {
		const config = {
			headers: {
				Authorization: `Bearer ${user.accessToken}`,
			},
		};

		const response = await api.put(`/api/items/${_id}`, itemData, config);

		return response.data;
	};

	const { mutate } = useMutation(editItem, {
		onSuccess: async (data: Item) => {
			await queryClient.invalidateQueries([queryKeys.items]);
			toast.success(`Item saved: ${data.name}`);
		},
		onError: (error: AxiosError) => {
			const message = (error.response?.data as { message?: string })?.message;
			toast.error(message || 'Error editting item');
		},
	});

	return mutate;
};

const useDeleteItem = () => {
	const { user } = useUser();
	const queryClient = useQueryClient();
	const api = useAxios();

	const deleteItem = async (_id: string) => {
		const config = {
			headers: {
				Authorization: `Bearer ${user.accessToken}`,
			},
		};

		const response = await api.delete(`/api/items/${_id}`, config);

		return response.data;
	};

	const { mutate } = useMutation(deleteItem, {
		onSuccess: async () => {
			await queryClient.invalidateQueries([queryKeys.items]);
		},
		onError: (error) => {
			console.log(error);
		},
	});

	return mutate;
};

export { useAddItem, useEditItem, useDeleteItem };
