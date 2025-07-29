import { getOrgId } from '../services';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEY } from './key';

export const useGetOrdId = () => {
  return useQuery({
    queryKey: [QUERY_KEY.GET_ORG_ID],
    queryFn: getOrgId,
    staleTime: Infinity,
  });
};
