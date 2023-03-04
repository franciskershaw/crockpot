import { Outlet } from 'react-router-dom';
import Navbar from './navbar/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUser } from '../hooks/auth/useUser';

const SharedLayout = () => {
  const { fetchingUser } = useUser();
  return fetchingUser ? (
    <div>Loading...</div>
  ) : (
    <>
      <main>
        <Outlet />
      </main>
      <Navbar />
      <ToastContainer closeButton={false} autoClose={1500} />
    </>
  );
};

export default SharedLayout;
