import { toast } from 'react-toastify';

import useAxios from '../axios/useAxios';
import useUser from './useUser';

const useAuth = () => {
	const api = useAxios();
	const { updateUser, clearUser } = useUser();

	const login = async (credentials: { username: string; password: string }) => {
		const response = await api.post('/api/users/login', credentials);
		if (response && response.status === 200) {
			updateUser(response?.data);
			toast.success(`Welcome back ${credentials.username}`);
			return response?.data;
		}
	};

	const register = async (data: { username: string; password: string }) => {
		const response = await api.post('/api/users', data);
		updateUser(response.data);
		toast.success(`Welcome to crockpot, ${data.username}`);
		return response.data;
	};

	const logout = async () => {
		clearUser();
	};

	return { login, register, logout };
};

export default useAuth;
