import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { agencyListService } from '../services';
import {
  IFieldErrorsItem,
  NotificationSuccess,
  IErrorResponse,
  AnyElement,
  NotificationError,
} from '@vissoft-react/common';
import { REACT_QUERY_KEYS } from '../../../../src/constants/query-key';
import { IAgency, IAgencyParams } from '../types';

export const useGetAgencies = (params: IAgencyParams) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_ALL_AGENCY, params],
    queryFn: () => agencyListService.getAgencies(params),
  });
};
export const useSupportGetAgency = (onSuccess: (data: IAgency) => void) => {
  return useMutation({
    mutationFn: agencyListService.getAgency,
    onSuccess: (data) => {
      onSuccess(data);
    },
  });
};
export const useSupportAddAgency = (
  onSuccess: () => void,
  onError: (errorField: IFieldErrorsItem[]) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: agencyListService.createAgency,
    onSuccess: () => {
      NotificationSuccess('Thêm Đại lý thành công');
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_ALL_AGENCY],
      });
      onSuccess();
    },
    onError(error: IErrorResponse & { fieldErrors?: IFieldErrorsItem[] }) {
      if (error?.errors) {
        onError(error?.errors);
      } else {
        NotificationError({
          message: 'Lỗi hệ thống, thêm mới Đại lý thất bại',
        });
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
    mutationFn: agencyListService.updateAgency,
    onSuccess: () => {
      NotificationSuccess('Cập nhật Đại lý thành công');
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_ALL_AGENCY],
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

export function useSupportDeleteAgency(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: agencyListService.deleteAgencys,
    onSuccess: () => {
      NotificationSuccess('Xóa thành công');
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_ALL_AGENCY],
      });
      onSuccess && onSuccess();
    },
  });
}

export const convertArrToObj = (arr: AnyElement[], parent: AnyElement) => {
  const newArr = arr
    ?.filter(
      (item) =>
        item.parentId === parent ||
        (!arr?.some((val: AnyElement) => val.id === item.parentId) &&
          parent === null)
    )
    ?.reduce((acc, item) => {
      acc.push({ ...item, children: convertArrToObj(arr, item.id) });
      return acc;
    }, []);

  return newArr?.length > 0 ? newArr : undefined;
};
