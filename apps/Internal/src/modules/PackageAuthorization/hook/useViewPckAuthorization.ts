import { useQuery } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';
import { IPckAuthorization } from '../types';
import { prefixCatalogService } from 'apps/Internal/src/constants/app';
const fetcher = async (id: string) => {
  const res = await axiosClient.get<IPckAuthorization, any>(`${prefixCatalogService}/package-attachment/${id}`)
  return res
}
export const useViewPckAuthorization = (id: string) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_PCK_DETAIL, id],
    queryFn: () => fetcher(id),
    select: (data) => data,
    enabled: !!id,
  });
};
