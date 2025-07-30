import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  IErrorResponse,
  IFieldErrorsItem,
  NotificationError,
  NotificationSuccess,
} from '@vissoft-react/common';
import { REACT_QUERY_KEYS } from '../../../constants/query-key';
import { userServices } from '../services';
import { IUserItem, IUserParams } from '../types';

export const useGetAllRole = (params: { isPartner: boolean }) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_ALL_ROLES, params],
    queryFn: () => {
      return userServices.getAllRoles(params);
    },
  });
};
export const useListOrgUnit = (params: { status: number }) => {
  return useQuery({
    queryFn: () => userServices.getListOrgUnit(params),
    queryKey: [REACT_QUERY_KEYS.GET_LIST_ORG_UNIT, params],
    staleTime: Infinity,
    select: (data) =>
      data?.map((e) => ({
        value: e.id,
        label: e.orgName,
      })),
  });
};

export const useGetUsers = (params: IUserParams) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_ALL_USERS, params],
    queryFn: () => userServices.getUsers(params),
  });
};

export const useGetDepartments = (status: number[] = [0, 1]) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_ALL_DEPARTMENTS],
    queryFn: () => userServices.getAllDepartment(),
    select: (data) => {
      if (!data) return [];
      return data
        .filter((item: any) => status.includes(item.status))
        .map((item) => ({
          label: item.name,
          value: item.id,
          code: item?.code,
        }));
    },
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

export function useCheckAllowDelete(onSuccess: (is: string) => void) {
  return useMutation({
    mutationFn: userServices.checkDeleteUser,
    onSuccess: (data, payload) => {
      if (data.isDeleteThisUser) {
        onSuccess(payload);
      } else {
        NotificationError(
          'Không thể xóa tài khoản được gán vị trí nhân viên kinh doanh/ AM'
        );
      }
    },
    onError() {
      NotificationError(
        'Không thể xóa tài khoản được gán vị trí nhân viên kinh doanh/ AM'
      );
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
        queryKey: [REACT_QUERY_KEYS.GET_ALL_USERS],
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

export const useGetAllGroupUser = () => {
  return useQuery({
    queryKey: ['useGetAllGroupUser'],
    queryFn: userServices.getAllGroupUsers,
  });
};
