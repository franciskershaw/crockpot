import { toast } from 'react-toastify';

import useAxios from '../axios/useAxios';
import useUser from './useUser';
import axios from 'axios';

const useAuth = () => {
	const api = useAxios();
	const { updateUser, clearUser } = useUser();

	const login = async (credentials: { username: string; password: string }) => {
		try {
			const response = await api.post('/api/users/login', credentials);
			if (response && response.data) {
				updateUser(response.data);
				toast.success(`Welcome back ${credentials.username}`);
			}
			return response?.data;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				const message = (error.response?.data as { message?: string })?.message;
				toast.error(message || 'Error logging in');
			} else {
				toast.error('An unexpected error occurred');
			}
		}
	};

	const register = async (data: { username: string; password: string }) => {
		try {
			const response = await api.post('/api/users', data);
			updateUser(response.data);
			toast.success(`Welcome to Crockpot, ${data.username}`);
			return response.data;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				const message = (error.response?.data as { message?: string })?.message;
				toast.error(message || 'Error creating an account');
			} else {
				toast.error('An unexpected error occurred');
			}
		}
	};

	const logout = () => {
		clearUser();
	};

	return { login, register, logout };
};

export default useAuth;
