import {
  AnyElement,
  downloadFileFn,
  FILE_TYPE,
  IErrorResponse,
  NotificationError,
} from '@vissoft-react/common';
import { safeApiClient } from '../../../services/axios';
import { useMutation } from '@tanstack/react-query';
import { blobToJson } from '../utils';
import useFileNameDownloaded from '../../../../src/hooks/useFileNameDownloaded';
import { AxiosRequestHeaders } from 'axios';
import { prefixSaleService } from '../../../../src/constants';

const fetcher = async (file: FormData) => {
  const res = await safeApiClient.post(
    `${prefixSaleService}/sale-package/check-data`,
    file,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      } as AxiosRequestHeaders,
      responseType: 'blob',
    }
  );
  return res;
};
const useCheckData = (onSuccess?: (data: AnyElement) => void) => {
  return useMutation({
    mutationFn: fetcher,
    onSuccess: async (data) => {
      onSuccess && onSuccess(data);
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
