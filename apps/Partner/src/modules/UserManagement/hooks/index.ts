import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { NotificationSuccess } from '@vissoft-react/common';
import { REACT_QUERY_KEYS } from '../../../constants/query-key';
import { IUserParams } from '../types';
import { userServices } from '../services';

export const useGetUsers = (params: IUserParams) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_ALL_USERS, params],
    queryFn: () => userServices.getUsers(params),
  });
};

export function useSupportDeleteUser(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userServices.deleteUsers,
    onSuccess: () => {
      NotificationSuccess('Xóa thành công');
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_ALL_USERS],
      });
      onSuccess && onSuccess();
    },
  });
}
