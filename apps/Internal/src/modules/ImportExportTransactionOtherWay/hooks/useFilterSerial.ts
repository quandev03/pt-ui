import { useMutation } from '@tanstack/react-query';
import { postFilterSerial } from '../services';
import { ISerialItem } from 'apps/Internal/src/modules/ImportExportTransactionOtherWay/type';

export const useFilterSerial = (onSuccess: (data: ISerialItem[]) => void) => {
  return useMutation({
    mutationFn: postFilterSerial,
    onSuccess: (data) => {
      onSuccess(data);
    },
    onError: (error: any) => {
      throw error;
    },
  });
};
