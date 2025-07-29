import { useMutation } from '@tanstack/react-query';
import { prefixCatalogService } from 'apps/Internal/src/constants/app';
import { axiosClient } from 'apps/Internal/src/service';
import { AppPickListResp } from '../types';

const fetcher = async (groupType: string) => {
  const res = await axiosClient.get<any, AppPickListResp[]>(
    `${prefixCatalogService}/package-profile/combobox/pck-type?group-type=${groupType}`
  );
  return res;
};
export const usePckTypeList = () => {
  return useMutation({
    mutationFn: fetcher,
  });
};
