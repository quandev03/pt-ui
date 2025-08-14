import { useMutation } from '@tanstack/react-query';
import {
  AnyElement,
  downloadFileFn,
  FILE_TYPE,
  IErrorResponse,
  NotificationError,
} from '@vissoft-react/common';
import { blobToJson } from '../utils';
import useFileNameDownloaded from '../../../../src/hooks/useFileNameDownloaded';
import { packageSaleService } from '../services';

const useCheckData = (onSuccess?: (data: AnyElement) => void) => {
  return useMutation({
    mutationFn: packageSaleService.checkDataFile,
    onSuccess: async (data) => {
      const dataParser = await blobToJson<IErrorResponse>(data);
      onSuccess && onSuccess(dataParser);
    },
    onError: async (error: AnyElement) => {
      console.log(error);
      try {
        const dataParser = await blobToJson<IErrorResponse>(error);
        NotificationError(dataParser);
      } catch {
        NotificationError({
          message: 'File tải lên sai thông tin, Vui lòng kiểm tra lại',
        });
        const name = useFileNameDownloaded.getState().name;
        downloadFileFn(error, name ? name : 'Ban-goi-theo-lo', FILE_TYPE.xlsx);
      }
    },
  });
};
export default useCheckData;
