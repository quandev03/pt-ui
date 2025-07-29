import { IPage, IParamsRequest } from '@react/commons/types';
import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { prefixCatalogService } from '@react/url/app';

export interface PackageType {
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  id: number;
  pckCode: string;
  pckName: string;
  groupType: string;
  groupTypeName?: any;
  pckType: string;
  pckTypeName: string;
  regType: string;
  regTypeName: string;
  profileType: string[];
  profileTypeName: string[];
  fromDate: string;
  toDate: string;
  apiCode: string;
  apiPromCode: string;
  smsCode: string;
  smsPromCode: string;
  activationCode: string;
  cycleQuantity?: any;
  cycleUnit?: any;
  displayStatus: boolean;
  mobileDisplayPos?: any;
  pcDisplayPos?: any;
  status: number;
  description?: any;
}

export interface IPramsPackage extends IParamsRequest {
  'search-string'?: string;
}

const fetcher = (params?: IPramsPackage) => {
  return axiosClient.get<string, IPage<PackageType>>(
    `${prefixCatalogService}/package-profile`,
    { params }
  );
};

export const useGetPackageList = (params?: IPramsPackage) => {
  return useQuery({
    queryFn: () => fetcher(params),
    queryKey: ['useGetPackageList', params],
  });
};
export const getPackageList = async (searchKey: string) => {
  const res = await axiosClient.get<string, IPage<PackageType>>(
    `${prefixCatalogService}/package-profile`,
    { params: { 'search-string': searchKey } }
  );
  return res.content.map((item) => ({
    label: item.pckName,
    value: item.id,
  }));
};
