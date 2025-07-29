import { useQuery } from '@tanstack/react-query';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';
import { IRepDetailItem } from '../type';

const fetcher = (id?: string) => {
  return axiosClient.get<string, IRepDetailItem>(
    `${prefixCustomerService}/authorized-person/detail?id=${id}`
  );
};
export const useGetRepresentativeDetail = (id?: string) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_REPRESENTATIVE_DETAIL, id],
    queryFn: () => fetcher(id),
    enabled: !!id,
  });
};
