import { AnyElement } from '@react/commons/types';
import { prefixCustomerServicePublic } from '@react/url/app';
import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Partner/src/service';

const fetcher = () => {
  return axiosClient.get<AnyElement, number | string>(
    `${prefixCustomerServicePublic}/verification/get-lucky-number`
  );
};
export const useGetLuckyNumber = () => {
  return useQuery({
    queryKey: ['get-lucky-number'],
    queryFn: fetcher,
  });
};
