import { useQuery } from '@tanstack/react-query';
import { prefixCatalogService } from 'apps/Internal/src/constants/app';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';
import { IPckAuthorization } from '../types';
const fetcher = async () => {
  const res = await axiosClient.get<IPckAuthorization, any>(`${prefixCatalogService}/package-profile/find/by-group-type?group=1&status=1`)
  return res
}
export const useGetPckMain = () => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_PCK_MAIN],
    queryFn: fetcher,
    select: (data) => data.content,
  });
};
