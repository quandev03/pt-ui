import { useQuery } from '@tanstack/react-query';
import { QUERY_KEY } from './key';
import { IParamsProducts } from '../type';
import { getListProducts } from '../services';

export const useGetListProducts = (params: IParamsProducts) => {
  return useQuery({
    queryFn: () => getListProducts(params),
    queryKey: [QUERY_KEY.GET_LIST_PRODUCTS, params],
    select: (data: any) => {
      return data;
    },
  });
};
