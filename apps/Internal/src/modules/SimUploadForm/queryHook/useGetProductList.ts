import { useMutation, useQuery } from '@tanstack/react-query';
import { prefixResourceService } from 'apps/Internal/src/constants/app';
import { axiosClient } from 'apps/Internal/src/service';
import { IProductItem } from '../types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';

const fetcher = (id: number) => {
  return axiosClient.get<any, IProductItem[]>(
    `${prefixResourceService}/stock-product-upload-order/search-remaining-order-line/${id}`
  );
};

// export const useGetProductList = () => {
//   return useMutation({
//     mutationFn: fetcher,
//   });
// };
export const useGetProductList = (id: number) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_PRODUCT_LIST_UPLOAD_SIM, id],
    queryFn: () => fetcher(id),
    enabled: !!id,
  });
};
