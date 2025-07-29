import { prefixSaleServicePrivate } from '@react/url/app';
import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';

export interface IDeliveryPartner {
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  id: number;
  code: string;
  value: string;
  valueType: string;
  refId: number;
  isDefault: number;
}

export const useGetDeliveryPartnerKey = 'useGetDeliveryPartnerKey';

const fetcher = () => {
  return axiosClient.get<string, IDeliveryPartner[]>(
    `${prefixSaleServicePrivate}/delivery-partner`
  );
};
export const useGetDeliveryPartner = () => {
  return useQuery({
    queryKey: [useGetDeliveryPartnerKey],
    queryFn: fetcher,
  });
};
