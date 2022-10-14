import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addNewRecipe } from '../../queries/recipeRequests';
import { queryKeys } from '../../reactQuery/queryKeys';
import { useUser } from '../auth/useUser';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

// Hook
export function useAddRecipe() {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const navigate = useNavigate()

  const { mutate } = useMutation(
    (formData) => addNewRecipe(user.token, formData),
    {
      onSuccess: async (data) => {
        await queryClient.resetQueries([queryKeys.recipes], {});
        // May need to update user if we return their recipes to User object - see useCreateCampaign in Dungeon Tracker
        navigate('/browse')
        toast.success('Success! New recipe added.');
      },
      onError: (data) => {
        toast.error(data)
      }
    }
  );

  return mutate;
}
