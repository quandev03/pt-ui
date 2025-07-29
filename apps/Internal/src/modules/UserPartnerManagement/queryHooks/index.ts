import { NotificationSuccess } from '@react/commons/Notification';
import { IErrorResponse, IFieldErrorsItem } from '@react/commons/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { userServices } from '../services';
import { IUserItem, IUserParams } from '../types';

export const useSearchAllUsersPartner = (payload: IUserParams) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.useSearchAllUsersPartner, payload],
    queryFn: () => userServices.searchUsers(payload),
    enabled: !!payload.partner,
  });
};

export const useSupportAddUser = (
  onSuccess: () => void,
  onError: (errorField: IFieldErrorsItem[]) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userServices.createUser,
    onSuccess: () => {
      NotificationSuccess('Thêm mới thành công');
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.useSearchAllUsersPartner],
      });
      onSuccess();
    },
    onError(error: IErrorResponse & { fieldErrors?: IFieldErrorsItem[] }) {
      if (error?.errors) {
        onError(error?.errors);
      }
    },
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
        queryKey: [REACT_QUERY_KEYS.useSearchAllUsersPartner],
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

export function useSupportDeleteUser(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userServices.deleteUsers,
    onSuccess: () => {
      NotificationSuccess('Xóa thành công');
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.useSearchAllUsersPartner],
      });
      onSuccess && onSuccess();
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
