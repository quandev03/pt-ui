import { useMutation } from '@tanstack/react-query';
import { prefixResourceService } from 'apps/Internal/src/constants/app';
import { axiosClient } from 'apps/Internal/src/service';

const fetcher = (params: any) => {
  return axiosClient.get(
    `${prefixResourceService}/sim-registrations/suggest-last-serial-number`,
    {
      params,
    }
  );
};

export const useSuggestLastSerialNumber = () => {
  return useMutation({
    mutationFn: (params: { serialFirst: number; quantity: number }) =>
      fetcher(params),
    onSuccess: (data: any) => data,
  });
};
