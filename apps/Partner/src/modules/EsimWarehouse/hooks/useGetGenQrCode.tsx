import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IErrorResponse } from '@vissoft-react/common';
import { IQrCodeGen } from '../types';
import { esimWarehouseServices } from '../services';
import { REACT_QUERY_KEYS } from '../../../../src/constants/query-key';
import { notification } from 'antd/lib';

export const useGetGenQrCode = (onSuccess: (data: Blob) => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: IQrCodeGen) =>
      esimWarehouseServices.getGenQrCode(payload),
    onSuccess: (data: Blob) => {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_QR_CODE_GEN],
      });
      onSuccess(data);
    },
    onError: async (error: IErrorResponse) => {
      console.log('🚀 ~ onError ~ error:', error);
      if (error instanceof Blob && error.type === 'application/problem+json') {
        const text = await error.text();
        const jsonError: IErrorResponse = JSON.parse(text);
        notification.error({
          message: jsonError.detail || 'Lấy mã không thành công',
        });
        return;
      }
      notification.error({
        message: error?.detail || 'Lấy mã không thành công',
      });
    },
  });
};
