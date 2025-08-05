import { useMutation } from '@tanstack/react-query';
import { packageSaleService } from '../services';
import { IPackage } from '../types';

export const useCheckIsdnAndGetPackage = (
  onSuccess: (data: IPackage[]) => void
) => {
  return useMutation({
    mutationFn: packageSaleService.checkIsdnAndGetPackage,
    onSuccess: (data) => {
      onSuccess(data);
    },
  });
};
