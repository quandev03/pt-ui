import { useQuery } from '@tanstack/react-query';
import { getStockIsdn } from '../services';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/query-key';

export const useGetStockIsdn = () => {
  return useQuery({
    queryFn: getStockIsdn,
    queryKey: [REACT_QUERY_KEYS.GET_HISTORY_ISDN],
    select: (data: any) => {
      return data?.map((item: any) => {
        return {
          value: item.code,
          label: item.value,
        };
      });
    },
  });
};
