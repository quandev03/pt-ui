import { axiosClient } from 'apps/Internal/src/service';
import { AppPickListResp } from '../types';
import { useQuery } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { prefixCatalogService } from 'apps/Internal/src/constants/app';

const fetcher = async () => {
  const res = await axiosClient.get<any, AppPickListResp[]>(
    `${prefixCatalogService}/package-profile/combobox/reg-type`
  );
  return res;
};
export const useConnectorList = () => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_CONNECTOR_LIST],
    queryFn: fetcher,
    select: (data) => {
      const pckGroups = data.map((group) => {
        return {
          label: group.value,
          value: group.code,
          refId: group.refId,
        };
      });

      return pckGroups;
    },
  });
};
