import { useQuery } from '@tanstack/react-query';
import { getSearchNumber } from '../services';
import { IParameter } from '../type';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/query-key';

export const useSearch = (params: IParameter) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_SEARCH_NUMBER, params],
    queryFn: () => getSearchNumber(params),
    enabled: !!params,
    select: (data: any) => {
      return data;
    },
    staleTime: 0,
  });
};
