import { useQuery } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';
import { ISubDocument } from '../types';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';

const fetcher = async (id: string) => {
  const res = await axiosClient.get<any, ISubDocument>(
    `${prefixCustomerService}/detail-subdocument/${id}`
  );
  return res;
};
export const useViewSubDoc = (id: string) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_SUBDOC_DETAIL, id],
    queryFn: () => fetcher(id),
    enabled: !!id,
  });
};
