import { useQuery } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/query-key';
import { PartnerCatalogService } from '../services';

export const useGetBanks = () => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_BANKS],
    queryFn: () => PartnerCatalogService.getBanks(),
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });
};




