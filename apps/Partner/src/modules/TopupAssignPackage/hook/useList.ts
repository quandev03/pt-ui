import { AnyElement } from '@react/commons/types';
import { formatDate, formatDateEnglishV2 } from '@react/constants/moment';
import { prefixSaleService } from '@react/url/app';
import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Partner/src/service';
import dayjs from 'dayjs';

export const TOPUP_ASSIGN_PACKAGE_QUERY_KEY = 'get-topup-assign-package_list';
export interface IParamsTopupAssignPackage {
  startDate: string;
  endDate: string;
  page: number;
  size: number;
  q?: string;
}
const fetcher = async (params: IParamsTopupAssignPackage) => {
  const customParams = {
    fromDate: params.startDate
      ? dayjs(params.startDate).format(formatDateEnglishV2)
      : dayjs().subtract(29, 'day').format(formatDateEnglishV2),
    toDate: params.endDate
      ? dayjs(params.endDate).format(formatDateEnglishV2)
      : dayjs().format(formatDateEnglishV2),
    page: params.page,
    size: params.size,
    valueSearch: params.q,
  };
  const res = await axiosClient.get<string, AnyElement>(
    `${prefixSaleService}/topup-package-transction`,
    {
      params: customParams,
    }
  );
  return res;
};
const useList = (params: IParamsTopupAssignPackage) => {
  return useQuery({
    queryKey: [TOPUP_ASSIGN_PACKAGE_QUERY_KEY, params],
    queryFn: () => fetcher(params),
  });
};
export default useList;
