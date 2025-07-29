import { NotificationSuccess } from '@react/commons/Notification';
import { IErrorResponse, IFieldErrorsItem } from '@react/commons/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Partner/src/constants/querykeys';
import { userServices } from '../services';
import { IUserItem } from '../types';
import { IUserParams } from 'apps/Partner/src/modules/UserManagement/types';

export const useGetUsers = (params: IUserParams) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_ALL_USERS, params],
    queryFn: () => userServices.getUsers(params),
  });
};

export function useSupportUpdateUser(
  onSuccess: () => void,
  onError: (errorField: IFieldErrorsItem[]) => void
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userServices.updateUser,
    onSuccess: () => {
      NotificationSuccess('Cập nhật thành công');
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_ALL_USERS],
      });
      onSuccess();
    },
    onError(error: IErrorResponse & { fieldErrors?: IFieldErrorsItem[] }) {
      if (error?.errors) {
        onError(error?.errors);
      }
    },
  });
}

export const useSupportGetUser = (onSuccess: (data: IUserItem) => void) => {
  return useMutation({
    mutationFn: userServices.getUser,
    onSuccess: (data) => {
      onSuccess(data);
    },
  });
};
