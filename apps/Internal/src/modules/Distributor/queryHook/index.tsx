import {
  NotificationError,
  NotificationSuccess,
} from '@react/commons/Notification';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { IErrorResponse, IFieldErrorsItem } from '@react/commons/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { groupUserServices } from '../services';

export const useGetUserObjectList = () => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_LIST_OPTION_USER_ACTIVE],
    queryFn: groupUserServices.getListUserName,
  });
};

export const useGetRoleObjectList = () => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_LIST_OPTION_ROLE_ACTIVE],
    queryFn: groupUserServices.getListRoles,
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
      NotificationSuccess('common.addSuccess');
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_LIST_GROUP],
      });
      onSuccess();
    },
    onError(error: IErrorResponse & { fieldErrors?: IFieldErrorsItem[] }) {
      if (error?.fieldErrors) {
        onError(error?.fieldErrors);
      } else {
        NotificationError(error);
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
      NotificationSuccess('common.updateSuccess');
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_LIST_GROUP],
      });
      onSuccess();
    },
    onError(error: IErrorResponse & { fieldErrors?: IFieldErrorsItem[] }) {
      if (error?.fieldErrors) {
        onError(error?.fieldErrors);
      } else {
        NotificationError(error);
      }
    },
  });
}

export function useSupportDeleteGroup(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: groupUserServices.deleteAddUserGroup,
    onSuccess: () => {
      NotificationSuccess('common.deleteSuccess');
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_LIST_GROUP],
      });
      onSuccess && onSuccess();
    },
    onError(error: IErrorResponse) {
      NotificationError(error);
    },
  });
}
