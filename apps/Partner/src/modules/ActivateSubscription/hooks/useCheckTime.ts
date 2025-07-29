import { AnyElement, CommonError } from '@react/commons/types';
import { prefixCustomerServicePublic } from '@react/url/app';
import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Partner/src/service';
import useActiveSubscriptStore from '../store';

const fetcher = () => {
  return axiosClient.get<AnyElement>(
    `${prefixCustomerServicePublic}/check-time`
  );
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
