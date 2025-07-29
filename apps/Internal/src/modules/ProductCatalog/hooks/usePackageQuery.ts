import { useQuery } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';
import { prefixCatalogService } from 'apps/Internal/src/constants/app';
export interface IServicePackageParams {
  page: number;
  size: number;
  'search-string'?: string;
  'group-type'?: string;
  status?: 0 | 1 | '';
}
export interface ServicePackageItem {
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  id: number;
  pckCode: string;
  pckName: string;
  groupType: string;
  pckType: string;
  regType: string;
  profileType: string[];
  fromDate: string | null;
  toDate: string | null;
  apiCode: string;
  apiPromCode: string;
  smsCode: string;
  smsPromCode: string;
  activationCode: string;
  cycleQuantity: number;
  cycleUnit: string;
  displayStatus: boolean | string;
  mobileDisplayPos: number;
  pcDisplayPos: number;
  status: number;
  imageUrl: string;
  topSale: number;
}
const fetcher = (params?: IServicePackageParams) => {
  return axiosClient.get<IServicePackageParams, { data: ServicePackageItem[] }>(
    `${prefixCatalogService}/package-profile/all`,
    { params }
  );
};

export const usePackageQuery = (params?: IServicePackageParams) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_LIST_OF_SERVICE_PACKAGE, params],
    queryFn: () => fetcher(params),
    select: (data) => data.data,
  });
};
