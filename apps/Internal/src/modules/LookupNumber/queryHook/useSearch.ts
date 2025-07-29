import { useQuery } from '@tanstack/react-query';
import { getSearchNumber } from '../services';
import { QUERY_KEY } from '../constant';
import { IParameter } from '../type';

export const useSearch = (params: IParameter) => {
  return useQuery({
    queryKey: [QUERY_KEY.GET_SEARCH_NUMBER, params],
    queryFn: () => getSearchNumber(params),
    enabled: !!params,
    select: (data: any) => {
      return data;
    },
    staleTime: 0,
  });
};
