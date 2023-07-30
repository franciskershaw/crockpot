'use client';

import useUser from '@/src/hooks/auth/useUser';

const Header = () => {
  const { user } = useUser();
  return <h1>Welcome, {user?.username}</h1>;
};
export default Header;
