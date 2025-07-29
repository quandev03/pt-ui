import { useQuery } from '@tanstack/react-query';
import { prefixSaleService, versionApi } from 'apps/Internal/src/constants/app';
import { axiosClient } from 'apps/Internal/src/service';
import { ILockPeriod } from '../type';
export const queryKey = 'LIST_CYCLE_INVENTORY';
const url = 'sale-service/private/api' + versionApi;
interface Response {
  content: ILockPeriod[];
  totalElements:number
}
const fetcher = async (params: {
  page: number;
    size:number
}) => {
  const res = axiosClient.get<ILockPeriod, Response>(
    `${url}/stock-period/search-cycle-inventory`,
    { params },
  );
  return res;
};
export const useList = (params: { page: number; size: number }) => {
  return useQuery({
    queryKey: [queryKey,params],
    queryFn: () => fetcher(params),
    select: (data) => data,
  });
};

