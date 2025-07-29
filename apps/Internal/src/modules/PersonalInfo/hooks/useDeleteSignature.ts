import { prefixAuthServicePrivate } from '@react/url/app';
import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';

const fetcher = () => {
  return axiosClient.delete(`${prefixAuthServicePrivate}/api/auth/signature`);
};

export const useDeleteSignature = () => {
  return useMutation({
    mutationFn: fetcher,
  });
};
