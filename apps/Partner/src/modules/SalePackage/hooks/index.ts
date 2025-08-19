import { useMutation, useQuery } from '@tanstack/react-query';
import {
  AnyElement,
  NotificationError,
  NotificationSuccess,
} from '@vissoft-react/common';
import { REACT_QUERY_KEYS } from '../../../../src/constants/query-key';
import { packageSaleService } from '../services';
import { IPackageSaleParams } from '../types';

export const useGetPackageSales = (params: IPackageSaleParams) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_ALL_USERS, params],
    queryFn: () => packageSaleService.getPackageSales(params),
  });
};
export const useAddPackageSingle = (onSuccess: () => void) => {
  return useMutation({
    mutationFn: packageSaleService.addPackageSingle,
    onSuccess: () => {
      NotificationSuccess('Bán gói đơn lẻ thành công!');
      onSuccess && onSuccess();
    },
    onError: (error: AnyElement) => {
      if (error.response.data.code === 'SALE00404') {
        NotificationError({ message: 'Mã OTP đã hết hạn. Vui lòng gửi lại' });
      }
    },
  });
};
