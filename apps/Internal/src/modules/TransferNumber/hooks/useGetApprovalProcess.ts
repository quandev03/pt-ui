import { useMutation } from '@tanstack/react-query';
import { getApprovalProcess } from '../services/service';

export const useGetApprovalProcess = () => {
  return useMutation({
    mutationFn: getApprovalProcess,
    onSuccess: (data: any) => {
      return data;
    },
  });
};
