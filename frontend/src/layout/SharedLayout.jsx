import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Header from './header/Header';
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
