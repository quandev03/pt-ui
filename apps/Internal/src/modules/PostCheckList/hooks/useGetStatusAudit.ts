import { useQuery } from '@tanstack/react-query';
import { prefixCatalogService } from 'apps/Internal/src/constants/app';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';

const fetcher = async () => {
  const res = await axiosClient.get(
    `${prefixCatalogService}/parameter?table-name=SUB_DOCUMENT&column-name=AUDIT_STATUS`
  );
  return res;
};

export const useGetStatusAudit = () => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_STATUS_AUDIT],
    queryFn: fetcher,
    select: (data) => data,
  });
};
