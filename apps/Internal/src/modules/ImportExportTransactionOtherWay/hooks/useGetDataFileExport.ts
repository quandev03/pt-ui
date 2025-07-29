import { getInfoFileExport } from '../services';
import { useMutation } from '@tanstack/react-query';
import { NotificationError } from '@react/commons/index';

export const useGetDataFileExport = (onSuccess: (data: any) => void) => {
  return useMutation({
    mutationFn: getInfoFileExport,
    onSuccess: async (data: any) => {
      onSuccess(data);
      return data;
    },
    onError: async (error: any) => {
      if (error instanceof Blob) {
        const errorText = await error.text();
        const parsedError = JSON.parse(errorText);
        NotificationError(parsedError?.detail);
      } else {
        NotificationError(error?.detail);
      }
    },
  });
};
