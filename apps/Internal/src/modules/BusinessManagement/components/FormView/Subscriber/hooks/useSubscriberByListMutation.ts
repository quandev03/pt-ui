import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { SubscriberByListRequest } from '../types';
import { prefixCustomerService } from '@react/url/app';

const fetcher = (params: SubscriberByListRequest) => {
  return axiosClient.post<SubscriberByListRequest, Response>(
    `${prefixCustomerService}/lock-unlock-by-list`,
    params
  );
};

export const useSubscriberByListMutation = () => {
  return useMutation({
    mutationFn: fetcher,
  });
};
