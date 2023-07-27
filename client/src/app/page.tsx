"use client"

import useSWR from 'swr';

const HomePage = () => {
  const { data: user } = useSWR('/api/users/login');
  console.log('user', user)
  return (
    <div>
      <h1>Crockpot landing page</h1>
      <h2>Hello {user?.data.username}</h2>
    </div>
  );
};

export default HomePage;
