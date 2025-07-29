import { useMutation, useQuery } from '@tanstack/react-query';
import { prefixResourceService } from 'apps/Internal/src/constants/app';
import { axiosClient } from 'apps/Internal/src/service';
import { uniq } from 'lodash';

export interface ReqProduct {
  orderId?: number | undefined;
  keySearch?: string;
}

export interface ProductType {
  productId: number;
  productName: string;
  productType: number;
  packageProfileId: number;
  packageProfileCode: string;
  profileType: string | string[];
  bufferPackageId: string;
  bufferPackageCode: string;
  simType: string;
  profileTypeList: string[];
}

export const queryKeyGetProductList = 'query-get-product-list';

export const getProductList = async (searchKey: string) => {
  const res = await axiosClient.get<ReqProduct, ProductType[]>(
    `${prefixResourceService}/sim-registrations/get-product-list`,
    { params: { keySearch: searchKey } }
  );
  return (res ?? []).map((e) => ({
    ...e,
    value: e.productId,
    label: e.productName,
    profileType: e.profileType[0],
    profileTypeList: uniq(e.profileType),
  }));
};

const fetcher = async (params?: ReqProduct, isMutated?: boolean) => {
  const res = await axiosClient.get<ReqProduct, ProductType[]>(
    `${prefixResourceService}/sim-registrations/get-product-list`,
    { params }
  );
  if (!isMutated) return res;
  return (res ?? []).map((e) => ({
    ...e,
    value: e.productId,
    label: e.productName,
    profileType: e.profileType[0],
    profileTypeList: uniq(e.profileType),
  }));
};

export const useGetProductList = (body?: ReqProduct) => {
  return useQuery({
    queryFn: () => fetcher(body),
    queryKey: [queryKeyGetProductList, body],
    select: (data = []) =>
      data.map((e) => ({
        ...e,
        profileType: e.profileType[0],
      })),
    enabled: !!body?.orderId,
  });
};

export const useGetProductListNoEnabled = () => {
  return useQuery({
    queryFn: () => fetcher(),
    queryKey: ['queryKeyGetProductList'],
    select: (data = []) =>
      data.map((e) => ({
        ...e,
        listProfileType: (e.profileType as unknown as string[])?.map((c) => ({
          value: c,
          label: c,
        })),
        profileType: e.profileType[0],
      })),
  });
};

export const useMutateProductList = (isKitBatch = false) => {
  return useMutation({
    mutationFn: (value: any) =>
      fetcher(isKitBatch ? { keySearch: value } : value, true),
  });
};
