import useSWR from 'swr';

const useUser = () => {
  const { data, error, isLoading } = useSWR('/api/users');

  return {
    user: data,
    isLoading,
    error,
  };
};

export default useUser;
