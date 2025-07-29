import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import urlManagePartnerAirtimeAccount from '../services/url';
import {
  IItemPartnerAirtimeAccount,
  IParamsManagePartnerAirtimeAccount,
} from '../type';
import { IPage } from '@react/commons/types';

export const queryKeyList = 'manage-partner-airtime-account';
const fetcher = async (params: IParamsManagePartnerAirtimeAccount) => {
  return await axiosClient.get<
    IItemPartnerAirtimeAccount,
    IPage<IItemPartnerAirtimeAccount>
  >(`${urlManagePartnerAirtimeAccount}`, {
    params: params,
  });
};
export const useList = (params: IParamsManagePartnerAirtimeAccount) => {
  return useQuery({
    queryKey: [queryKeyList, params],
    queryFn: () => fetcher(params),
    select: (data) => data,
  });
};
