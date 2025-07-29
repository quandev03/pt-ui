import { prefixResourceService } from '@react/url/app';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';
import { ProductItem } from '../types';
import { GetListResponse } from '../../ListOfDepartment/types';
import { NotificationError } from '@react/commons/Notification';
import { IErrorResponse } from '@react/commons/types';

type Response = {
  data: GetListResponse<ProductItem>;
};

export interface IParamsGetProduct {
  id: number;
  type: number;
  moveCode?: string;
}

const fetcher = async (params: IParamsGetProduct) => {
  if (params.type === 1) {
    return await axiosClient.get<Response>(
      `${prefixResourceService}/stock-product-upload-order/find-order-lines-without-uploaded-sim/${params.id}`
    );
  } else if (params.type === 2) {
    return await axiosClient.get<Response>(
      `${prefixResourceService}/stock-product-serial-upload/stock-move/${params.id}`, {
        params: {
          'stock-move-code': params.moveCode
        }
      }
    );
  }
};

export const useListProducts = (setListProducts: (data: any) => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fetcher,
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_LIST_PRODUCT_SIM],
      });
      setListProducts([]);
      setListProducts(data);
    },
    onError: (err: IErrorResponse) => {
      if (err?.detail) {
        NotificationError(err?.detail);
      }
    },
  });
};
