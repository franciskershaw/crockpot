import { useMutation, useQueryClient } from '@tanstack/react-query';
import { editUser } from '../../queries/userRequests';
import { queryKeys } from '../../reactQuery/queryKeys';
import { useUser } from '../auth/useUser';
import { toast } from 'react-toastify';
import { setStoredUser } from '../../reactQuery/userStorage';

// Hook
export function useEditUser() {
  const { user } = useUser();
  const queryClient = useQueryClient();

  const { mutate } = useMutation(
    (body) => editUser(user._id, user.token, body),
    {
      onSuccess: (data, body) => {
        const keys = Object.keys(body);
        keys.forEach((key) => {
          queryClient.setQueryData([queryKeys.user], (prevUserData) => {
            const newUserData = prevUserData;
            newUserData[key] = data[key];
            setStoredUser(newUserData);
            return newUserData;
          });
        });
      },
      onError: (data) => {
        toast.error(data);
      },
    }
  );

  return mutate;
}
