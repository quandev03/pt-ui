import { AnyElement, IErrorResponse } from '@react/commons/types';
import { blobToJson } from '@react/helpers/utils';
import { downloadFileFn } from '@react/utils/handleFile';
import { useMutation } from '@tanstack/react-query';
import useFileNameDownloaded from 'apps/Partner/src/hooks/useFileNameDownloaded';
import { axiosClient } from 'apps/Partner/src/service';
import { urlSellBatchPackage } from '../service/url';
import { NotificationError } from '@react/commons/Notification';
import { FILE_TYPE } from '@react/constants/app';
const fetcher = async (file: File) => {
  const formData = new FormData();
  formData.append('attachment', file);
  const res = await axiosClient.post<string, Blob>(
    `${urlSellBatchPackage}/check-data`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      responseType: 'blob',
    }
  );
  return res;
};
const useCheckData = (onSuccess?: (data: AnyElement) => void) => {
  return useMutation({
    mutationFn: fetcher,
    onSuccess: async (data) => {
      const dataParser = await blobToJson<IErrorResponse>(data);
      onSuccess && onSuccess(dataParser);
    },
    onError: async (error: AnyElement) => {
      console.log(error)
      try {
        const dataParser = await blobToJson<IErrorResponse>(error)
        NotificationError(dataParser.detail)
      } catch  {
        NotificationError('File tải lên sai thông tin, Vui lòng kiểm tra lại');
        const name = useFileNameDownloaded.getState().name;
        downloadFileFn(error, name ? name : "Ban-goi-theo-lo",FILE_TYPE.xlsx)
      }
    },
  });
};
export default useCheckData;
