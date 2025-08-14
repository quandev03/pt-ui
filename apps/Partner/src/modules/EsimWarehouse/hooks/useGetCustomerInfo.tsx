import { useQuery } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from '../../../constants/query-key';
import { esimWarehouseServices } from '../services';

export const useGetCusomerInfo = (subId?: string) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_CUSTOMER_INFO, subId],
    queryFn: () => esimWarehouseServices.getCustomerInfo(subId),
    enabled: !!subId,
  });
};
