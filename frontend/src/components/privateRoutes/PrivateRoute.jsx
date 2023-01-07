import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../../hooks/auth/useUser';
import { toast } from 'react-toastify';

const PrivateRoute = () => {
  const { user } = useUser();
	if (!user) toast.error('You must be logged in to view this page')
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
