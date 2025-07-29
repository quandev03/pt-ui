import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';

const fetcher = (body: any) => {
  return axiosClient.put<any, any>(
    `${prefixCustomerService}/change-sim/update`,
    body
  );
};

export const useChangeSimUpdate = () => {
  return useMutation({
    mutationFn: fetcher,
  });
};
