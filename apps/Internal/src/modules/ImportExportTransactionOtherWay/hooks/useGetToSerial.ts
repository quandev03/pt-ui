import { useMutation } from '@tanstack/react-query';
import { getToSerial } from '../services';

export const useGetToSerial = () => {
  return useMutation({
    mutationFn: (params: { serialFirst: number; quantity: number }) =>
      getToSerial(params),
    onSuccess: (data: any) => data,
  });
};
