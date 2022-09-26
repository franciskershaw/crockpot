import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
const SharedLayout = () => {
  return (
    <>
      <nav>
        This is a navbar <Link to={'login'}>Login</Link>{' '}
        <Link to={'register'}>Register</Link>
      </nav>
      <Outlet />
    </>
  );
};

export default SharedLayout;
