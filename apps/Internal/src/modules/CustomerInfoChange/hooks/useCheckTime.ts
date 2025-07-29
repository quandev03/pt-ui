import { useMutation } from '@tanstack/react-query';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import { axiosClient } from 'apps/Internal/src/service';
import useActiveSubscriptStore from '../store';
import { CommonError } from '@react/commons/types';

const fetcher = () => {
  return axiosClient.get<any>(`${prefixCustomerService}/check-time`);
};

export const useCheckTime = () => {
  const { setTimeError } = useActiveSubscriptStore();
  return useMutation({
    mutationFn: fetcher,
    onError: (err: CommonError) => {
      if (err?.status === 422) {
        setTimeError(err.detail);
      }
    },
  });
};
