// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { editUser } from '../../queries/userRequests';
// import { queryKeys } from '../../reactQuery/queryKeys';
// import { useUser } from '../auth/useUser';
// import { toast } from 'react-toastify';

// // Hook
// export function useEditUser() {
//   const { user, updateUser } = useUser();
//   const queryClient = useQueryClient();

//   const { mutate } = useMutation(
//     (body) => editUser(user._id, user.token, body),
//     {
//       onSuccess: async (data) => {
//         updateUser(data)        
//         console.log(data)
//       },
//       onError: (data) => {
//         toast.error(data)
//       }
//     }
//   );

//   return mutate;
// }
