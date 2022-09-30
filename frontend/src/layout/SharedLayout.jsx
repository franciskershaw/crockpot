import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Header from './header/Header'
import Navbar from './navbar/Navbar'

const SharedLayout = () => {
  return (
    <>
      <main>
        <Outlet />
      </main>
      <Navbar />
    </>
  );
};

export default SharedLayout;
