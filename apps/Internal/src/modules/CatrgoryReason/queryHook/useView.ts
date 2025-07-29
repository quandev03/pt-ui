import { axiosClient } from 'apps/Internal/src/service';
import { useQuery } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { prefixCatalogService } from 'apps/Internal/src/constants/app';

const fetcher = async (id: string) => {
  return await axiosClient.get<any>(
    `${prefixCatalogService}/reason` + `/${id}`
  );
};

export const useView = (id: string) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_LIST_REASONS, id],
    queryFn: () => fetcher(id),
    select: (data: any) => data,
    enabled: false,
  });
};
