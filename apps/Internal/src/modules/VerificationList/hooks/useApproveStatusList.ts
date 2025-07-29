import { useQuery } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';
import { IApprovalStatus } from '../types';
import { prefixCatalogService } from 'apps/Internal/src/constants/app';

const fetcher = async (name: string) => {
  const res = await axiosClient.get<any, IApprovalStatus[]>(
    `${prefixCatalogService}/parameter?table-name=SUB_DOCUMENT&column-name=${name}`
  );
  return res;
};
export const useApproveStatusList = (name: string) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_APPROVAL_STATUS, name],
    queryFn: () => fetcher(name),
    select(data) {
      const results: { label: string; value: number }[] = [];
      data.forEach((stt) => {
        results.push({ label: stt.value, value: +stt.code });
      });
      return results;
    },
  });
};
