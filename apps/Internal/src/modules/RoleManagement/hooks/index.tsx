import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RoleService } from '../services';
import { IRoleParams } from '../types';
import { REACT_QUERY_KEYS } from '../../../constants/query-key';
import {
  IErrorResponse,
  IFieldErrorsItem,
  NotificationSuccess,
} from '@vissoft-react/common';

const useGetRoles = (params: IRoleParams) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_ALL_ROLES, params],
    queryFn: () => RoleService.getRoles(params),
  });
};

const useGetObjectList = (isPartner: boolean) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_LIST_OBJECT_MENU, isPartner],
    queryFn: () => RoleService.getListObject(isPartner),
  });
};

const useGetObjectListMobile = (isPartner: boolean) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_LIST_OBJECT_MENU_MOBILE, isPartner],
    queryFn: () => RoleService.getListObjectMobile(isPartner),
    enabled: isPartner,
  });
};

const useSupportAddRole = (
  onSuccess: () => void,
  onError: (errorField: IFieldErrorsItem[]) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: RoleService.createRole,
    onSuccess: () => {
      NotificationSuccess('Thêm mới thành công');
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_ALL_ROLES],
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

function useSupportDeleteRole(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: RoleService.deleteRoleApi,
    onSuccess: () => {
      NotificationSuccess('Xóa thành công');
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_ALL_ROLES],
      });
      onSuccess && onSuccess();
    },
  });
}

function useSupportUpdateRole(
  onSuccess: () => void,
  onError: (errorField: IFieldErrorsItem[]) => void
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: RoleService.updateRoleById,
    onSuccess: () => {
      NotificationSuccess('Cập nhật thành công');
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_ALL_ROLES],
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

const useSupportGetRoleDetail = (isPartner: boolean, id?: string) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_DETAIL_ROLE_BY_ID, id, isPartner],
    queryFn: () => RoleService.getDetailRoleById({ id, isPartner }),
    enabled: !!id,
  });
};
export {
  useGetRoles,
  useGetObjectList,
  useGetObjectListMobile,
  useSupportAddRole,
  useSupportDeleteRole,
  useSupportUpdateRole,
  useSupportGetRoleDetail,
};
