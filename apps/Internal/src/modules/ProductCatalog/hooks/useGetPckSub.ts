import { useQuery } from '@tanstack/react-query';
import { prefixCatalogService } from 'apps/Internal/src/constants/app';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';

const fetcher = async () => {
  const res = await axiosClient.get<any, any>(`${prefixCatalogService}/package-profile/find/by-group-type?group=3&status=1`)
  return res
}
export const useGetPckSub = () => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_PCK_SUB],
    queryFn: fetcher,
    select: (data) => data.content,
  });
};
