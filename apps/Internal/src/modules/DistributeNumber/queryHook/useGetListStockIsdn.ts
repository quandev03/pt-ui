import { useQuery } from '@tanstack/react-query';
import { QUERY_KEY } from './key';
import { getListStockIsdnOrg } from '../services';

export const useGetListStockIsdnOrg = (id: number | string) => {
  return useQuery({
    queryKey: [QUERY_KEY.GET_STOCK_ISDN_ORG, id],
    enabled: !!id,
    queryFn: () => getListStockIsdnOrg(id),
  });
};
