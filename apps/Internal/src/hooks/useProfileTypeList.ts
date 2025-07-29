import { axiosClient } from 'apps/Internal/src/service';
import { AppPickListResp } from '../modules/ListOfServicePackage/types';
import { useQuery } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { prefixCatalogService } from '../constants/app';

const fetcher = async () => {
  const res = await axiosClient.get<any, AppPickListResp[]>(
    `/${prefixCatalogService}/package-profile/combobox/profile-type`
  );
  return res;
};
export const useProfileTypeList = () => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_PROFILE_TYPE],
    queryFn: fetcher,
    select: (data) => {
      const pckGroups = data.map((group) => {
        return {
          label: group.value,
          value: group.code,
        };
      });
      return pckGroups;
    },
  });
};
