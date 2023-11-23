'use client';

import useProtectedRoute from '@/src/hooks/auth/useProtectedRoute';

const AdminPage = () => {
	const { fetchingUser } = useProtectedRoute('/your-crockpot', true);

	if (fetchingUser) {
		return <div>Loading...</div>;
	}

	return <div>Admin page</div>;
};

export default AdminPage;
