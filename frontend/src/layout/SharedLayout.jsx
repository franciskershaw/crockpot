import { Outlet } from 'react-router-dom';
import Navbar from './navbar/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SharedLayout = () => {
  return (
    <>
      <main>
        <Outlet />
      </main>
      <Navbar />
      <ToastContainer />
    </>
  );
};

export default SharedLayout;
