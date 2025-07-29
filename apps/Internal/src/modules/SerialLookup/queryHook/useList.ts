import { useMutation, useQuery } from '@tanstack/react-query';
import { notification } from 'antd';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { Serial } from '../services';
import { ParamsSerialLookup } from '../types';

export const useListSerialLookup = (param: ParamsSerialLookup) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_LIST_SERIAL_LIST, param],
    queryFn: () => Serial.getSerialList(param),
  });
};

export const useGetListOrg = () => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_LIST_ORG],
    queryFn: Serial.getListOrg,
  });
};

export const useGetListProducts = () => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_LIST_PRODUCTS],
    queryFn: Serial.getListProducts,
  });
};

export function useGetQRCodeImage(
  onSuccess: (res: any) => void,
  onErr?: () => void
) {
  return useMutation({
    mutationFn: Serial.getQRCodeImage,
    onSuccess: (res) => {
      onSuccess(res);
    },
    onError: (error: any) => {
      onErr && onErr();
      if (error?.response?.data?.detail) {
        notification.error({
          message: 'Thất bại',
          description: error?.response?.data?.detail,
        });
      } else {
        notification.error({
          message: 'Thất bại',
          description: 'Có lỗi xảy ra!!!',
        });
      }
    },
  });
}
