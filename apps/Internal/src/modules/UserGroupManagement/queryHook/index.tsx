import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { groupUserServices } from '../services';
import { IGroupUserParams, IUserGroup } from '../types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/query-key';
import {
  IErrorResponse,
  IFieldErrorsItem,
  NotificationSuccess,
} from '@vissoft-react/common';

export const useGetGroupUsers = (params: IGroupUserParams) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_LIST_GROUP, params],
    queryFn: () => groupUserServices.getGroupUsers(params),
  });
};

export const useSupportAddGroup = (
  onSuccess: () => void,
  onError: (errorField: IFieldErrorsItem[]) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: groupUserServices.postAddUserGroup,
    onSuccess: () => {
      NotificationSuccess('Thêm mới thành công');
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_LIST_GROUP],
      });
      onSuccess();
    },
    onError(error: IErrorResponse & { fieldErrors?: IFieldErrorsItem[] }) {
      if (error?.errors) {
        onError(error.errors);
      }
    },
  });
};

export function useSupportUpdateGroup(
  onSuccess: () => void,
  onError: (errorField: IFieldErrorsItem[]) => void
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: groupUserServices.putAddUserGroup,
    onSuccess: () => {
      NotificationSuccess('Cập nhật thành công');
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_LIST_GROUP],
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

export function useSupportDeleteGroup(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: groupUserServices.deleteAddUserGroup,
    onSuccess: () => {
      NotificationSuccess('Xóa thành công');
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_LIST_GROUP],
      });
      onSuccess && onSuccess();
    },
  });
}

export const useSupportGetGroupUser = (
  onSuccess: (data: IUserGroup) => void
) => {
  return useMutation({
    mutationFn: groupUserServices.getGroupUser,
    onSuccess: (data) => {
      onSuccess(data);
    },
  });
};
