import { useQuery } from '@tanstack/react-query';
import { esimWarehouseServices } from '../services';
import { REACT_QUERY_KEYS } from '../../../constants/query-key';

export const useGetPackageCodes = () => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_PACKAGES],
    queryFn: () => esimWarehouseServices.getPackageCodes(),
  });
};
