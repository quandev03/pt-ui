import { useQuery } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from '../../../constants/query-key';
import { esimWarehouseServices } from '../services';

export const useGetDetailsEsimWarehouse = (subId?: string) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_DETAIL_ESIM_WAREHOUSE, subId],
    queryFn: () => esimWarehouseServices.getDetailEsimWarehouse({ subId }),
    enabled: !!subId,
  });
};
