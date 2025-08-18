import { useQuery } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Partner/src/constants/query-key';
import { packageSaleService } from '../services';

export const useGetPackageCodes = () => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_PACKAGES],
    queryFn: () => packageSaleService.getPackageCodes(),
  });
};
