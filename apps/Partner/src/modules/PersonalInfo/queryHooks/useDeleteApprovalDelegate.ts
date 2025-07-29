import { prefixApprovalServicePublic } from '@react/url/app';
import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Partner/src/service';

const fetcher = (ids: string[]) => {
  return axiosClient.delete(
    `${prefixApprovalServicePublic}/approval-delegate/${ids.join(',')}`
  );
};

export const useDeleteApprovalDelegate = () => {
  return useMutation({
    mutationFn: fetcher,
  });
};
