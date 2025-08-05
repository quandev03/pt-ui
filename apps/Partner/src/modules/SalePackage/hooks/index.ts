import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  IFieldErrorsItem,
  NotificationSuccess,
  IErrorResponse,
} from '@vissoft-react/common';
import { REACT_QUERY_KEYS } from '../../../../src/constants/query-key';
import { IPackageSaleParams } from '../types';
import { packageSaleService } from '../services';

export const useGetPackageSales = (params: IPackageSaleParams) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_ALL_USERS, params],
    queryFn: () => packageSaleService.getPackageSales(params),
  });
};
export const useSupportAddSinglePackageSale = (
  onSuccess?: () => void,
  onError?: (errorField: IFieldErrorsItem[]) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: packageSaleService.createSinglePackageSale,
    onSuccess: () => {
      NotificationSuccess('Thêm mới thành công');
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_ALL_PACKAGE_SALE],
      });
      if (onSuccess) onSuccess();
    },
    onError(error: IErrorResponse & { fieldErrors?: IFieldErrorsItem[] }) {
      if (error?.errors && onError) {
        onError(error?.errors);
      }
    },
  });
};

export const useSupportAddBulkPackageSale = (
  onSuccess: () => void,
  onError: (errorField: IFieldErrorsItem[]) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: packageSaleService.createBulkPackageSale,
    onSuccess: () => {
      NotificationSuccess('Thêm mới thành công');
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_ALL_PACKAGE_SALE],
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
