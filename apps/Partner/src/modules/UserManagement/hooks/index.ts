import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  IFieldErrorsItem,
  NotificationSuccess,
  IErrorResponse,
} from '@vissoft-react/common';
import { REACT_QUERY_KEYS } from '../../../constants/query-key';
import { IUserItem, IUserParams } from '../types';
import { userServices } from '../services';

export const useGetUsers = (params: IUserParams) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_ALL_USERS, params],
    queryFn: () => userServices.getUsers(params),
  });
};
export const useSupportGetUser = (onSuccess: (data: IUserItem) => void) => {
  return useMutation({
    mutationFn: userServices.getUser,
    onSuccess: (data) => {
      onSuccess(data);
    },
  });
};
export const useGetAllRole = () => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_ALL_ROLES],
    queryFn: () => {
      return userServices.getAllRoles();
    },
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
