import { useMutation } from '@tanstack/react-query';
import { postApprovalProcessStep } from '../services';
import { IProcessApproved } from 'apps/Internal/src/modules/DistributeNumber/type';

export const useApprovalProcessStep = (
  onSuccess: (data: IProcessApproved[]) => void
) => {
  return useMutation({
    mutationFn: postApprovalProcessStep,
    onSuccess: (data) => {
      onSuccess(data);
    },
  });
};
