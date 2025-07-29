import { useMutation } from '@tanstack/react-query';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import { axiosClient } from 'apps/Internal/src/service';

const cancelApi = (id: number) => {
  return axiosClient.put<any>(
    `${prefixCustomerService}/change-sim-bulk/cancel/${id}`
  );
};
export const useCancel = () => {
  return useMutation({
    mutationFn: cancelApi,
  });
};
