import { axiosClient } from 'apps/Internal/src/service';
import { AppPickListResp } from '../types';
import { useQuery } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { prefixCatalogService } from 'apps/Internal/src/constants/app';

const fetcher = async () => {
  const res = await axiosClient.get<any, AppPickListResp[]>(
    `${prefixCatalogService}/parameter?table-name=PACKAGE_PROFILE&column-name=GROUP_TYPE`
  );
  return res;
};
export const usePckGroup = () => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_PACKAGE_GROUP_LIST],
    queryFn: fetcher,
    select: (data) => {
      const result: {
        label: string | null;
        value: string;
        id?: number;
        refId?: number | null;
      }[] = [];
      data.forEach((group) => {
        result.push({
          id: group.id,
          label: group.value,
          value: group.code,
          refId: group.refId,
        });
      });
      return result;
    },
  });
};
