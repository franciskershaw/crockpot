import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useItemRequests } from '../queries/useItemRequests';
import { queryKeys } from '../../reactQuery/queryKeys';
import { useUser } from '../auth/useUser';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

// Hook
export function useAddItem() {
  const { user } = useUser();
  const { addNewItem } = useItemRequests();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate } = useMutation(
    (formData) => addNewItem(user.token, formData),
    {
      onSuccess: async (data) => {
        await queryClient.resetQueries([queryKeys.items], {});
        // May need to update user if we return their recipes to User object - see useCreateCampaign in Dungeon Tracker
        navigate('/browse');
        toast.success('Success! New item added.');
      },
      onError: (data) => {
        toast.error(data);
      },
    }
  );

  return mutate;
}
