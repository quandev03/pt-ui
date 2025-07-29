import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { CustomerInfoRequest, SubscriptionDetail } from '../types';
import { prefixCustomerService } from '@react/url/app';

const fetcher = (params: CustomerInfoRequest) => {
  return axiosClient.get<string, SubscriptionDetail>(
    `${prefixCustomerService}/search-request/cskh/infor/${params.id}`,
    { params: { idNo: params.idNo } }
  );
};

export const useIdentificationMutation = () => {
  return useMutation({
    mutationFn: fetcher,
  });
};
