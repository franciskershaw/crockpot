import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../../hooks/auth/useUser';
import { toast } from 'react-toastify';

const PrivateRoute = () => {
  const { user } = useUser();
  if (!user || !user.isAdmin) {
    toast.error('You must be an administrator to view this page');
  }

  return user?.isAdmin ? <Outlet /> : <Navigate to="/browse" />;
};

export default PrivateRoute;
