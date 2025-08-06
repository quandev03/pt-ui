import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  AnyElement,
  IErrorResponse,
  IFieldErrorsItem,
  NotificationError,
  NotificationSuccess,
} from '@vissoft-react/common';
import { REACT_QUERY_KEYS } from '../../../constants/query-key';
import { userServices } from '../services';
import { IDepartment, IUserItem, IUserParams } from '../types';

const useGetAllRole = (params: { isPartner: boolean }) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_ALL_ROLES, params],
    queryFn: () => {
      return userServices.getAllRoles(params);
    },
  });
};

const useGetUsers = (params: IUserParams) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_ALL_USERS, params],
    queryFn: () => userServices.getUsers(params),
  });
};

const useGetDepartments = (status: number[] = [1]) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_ALL_DEPARTMENTS],
    queryFn: () => userServices.getAllDepartment(),
    select: (data) => {
      if (!data) return [];
      return data
        .filter((item: IDepartment) => status.includes(item.status))
        .map((item: AnyElement) => ({
          label: item.name,
          value: item.id,
          code: item?.code,
        }));
    },
  });
};

const useSupportAddUser = (
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

function useSupportUpdateUser(
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

function useCheckAllowDelete(onSuccess: (is: string) => void) {
  return useMutation({
    mutationFn: userServices.checkDeleteUser,
    onSuccess: (data, payload) => {
      if (data.isDeleteThisUser) {
        onSuccess(payload);
      } else {
        NotificationError({
          message:
            'Không thể xóa tài khoản được gán vị trí nhân viên kinh doanh/ AM',
        });
      }
    },
    onError() {
      NotificationError({
        message:
          'Không thể xóa tài khoản được gán vị trí nhân viên kinh doanh/ AM',
      });
    },
  });
}

function useSupportDeleteUser(onSuccess?: () => void) {
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

const useSupportGetUser = (onSuccess: (data: IUserItem) => void) => {
  return useMutation({
    mutationFn: userServices.getUser,
    onSuccess: (data) => {
      onSuccess(data);
    },
  });
};

const useGetAllGroupUser = () => {
  return useQuery({
    queryKey: ['useGetAllGroupUser'],
    queryFn: userServices.getAllGroupUsers,
  });
};

export {
  useCheckAllowDelete,
  useGetAllGroupUser,
  useGetAllRole,
  useGetDepartments,
  useGetUsers,
  useSupportAddUser,
  useSupportDeleteUser,
  useSupportGetUser,
  useSupportUpdateUser,
};
