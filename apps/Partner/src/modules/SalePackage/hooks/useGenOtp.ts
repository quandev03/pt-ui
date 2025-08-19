import { useMutation } from '@tanstack/react-query';
import { IResGenOtp } from '../types';
import { packageSaleService } from '../services';

export const useGenOtp = (onSuccess: (data: IResGenOtp) => void) => {
  return useMutation({
    mutationFn: packageSaleService.genOtp,
    onSuccess: (data) => {
      onSuccess(data);
    },
  });
};
