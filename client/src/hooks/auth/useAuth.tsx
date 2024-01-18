import { toast } from 'react-toastify';

import useAxios from '../axios/useAxios';
import useUser from './useUser';

const useAuth = () => {
	const api = useAxios();
	const { updateUser, clearUser } = useUser();

	const login = async (credentials: { username: string; password: string }) => {
		try {
			const response = await api.post('/api/users/login', credentials);
			if (response.status === 200) {
				updateUser(response.data);
			}
			toast.success(`Welcome back ${credentials.username}`);
			return response.data;
		} catch (error) {
			// toast.error(error.message);
			console.log(error);
		}
	};

	const register = async (data: { username: string; password: string }) => {
		try {
			const response = await api.post('/api/users', data);
			updateUser(response.data);
			return response.data;
		} catch (error) {
			console.log(error);
		}
	};

	const logout = async () => {
		clearUser();
	};

	return { login, register, logout };
};

export default useAuth;
