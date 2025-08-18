import { useMutation } from '@tanstack/react-query';
import {
  FILE_TYPE,
  IErrorResponse,
  NotificationError,
} from '@vissoft-react/common';
import { prefixSaleService } from 'apps/Partner/src/constants';
import { safeApiClient } from 'apps/Partner/src/services';

const getFileBlob = (data: Blob, payload: string) => {
  const fileUrl = payload;
  const filenameSplit = fileUrl.split('.');
  const fileType = filenameSplit[
    filenameSplit.length - 1
  ] as keyof typeof FILE_TYPE;
  const blob = new Blob([data], {
    type: FILE_TYPE[fileType],
  });
  return blob;
};

const fetcher = async (url: string) => {
  const res = await safeApiClient.post<string, Blob>(
    `${prefixSaleService}/files/download`,
    {
      fileUrl: url,
    },
    {
      responseType: 'blob',
    }
  );
  return res;
};

export const useGetFileDownloadFn = () => {
  return useMutation({
    mutationFn: fetcher,
    onSuccess(data, payload) {
      const fileUrl = payload;
      const nameArr = fileUrl.split('/');
      const blob = getFileBlob(data, payload);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.href = url;
      a.download = nameArr[nameArr.length - 1];
      a.click();
      URL.revokeObjectURL(a.href);
      a.remove();
    },
    onError: (err: IErrorResponse) => {
      if (err?.detail) {
        NotificationError({ message: err?.detail });
      }
    },
  });
};
