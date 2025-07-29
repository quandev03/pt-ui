import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { SearchImage } from '../types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { prefixCustomerService } from '@react/url/app';

const fetcher = (id: string) => {
  return axiosClient.get<string, SearchImage>(
    `${prefixCustomerService}/search-request/search-image/${id}`
  );
};

export const useSearchImageQuery = (id: string, enabled: boolean) => {
  return useQuery({
    queryFn: () => fetcher(id),
    queryKey: [REACT_QUERY_KEYS.GET_DETAIL_SEARCH_IMAGE, id],
    enabled: !!id && enabled,
  });
};
