import { useMutation } from '@tanstack/react-query';
import { prefixApprovalService } from 'apps/Internal/src/constants/app';
import { axiosClient } from 'apps/Internal/src/service';

const fetcher = (ids: string[]) => {
  return axiosClient.delete(
    `${prefixApprovalService}/approval-delegate/${ids.join(',')}`
  );
};

export const useDeleteApprovalDelegate = () => {
  return useMutation({
    mutationFn: fetcher,
  });
};
