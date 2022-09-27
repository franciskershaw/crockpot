import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Navbar from './navbar/Navbar'

const SharedLayout = () => {
  return (
    <>
      <nav>
        This is a navbar <Link to={'login'}>Login</Link>{' '}
        <Link to={'register'}>Register</Link>
      </nav>
      <Outlet />
      <Navbar />
    </>
  );
};

export default SharedLayout;
