// useFileDownload.ts

import { useMutation } from '@tanstack/react-query';
import {
  FILE_TYPE,
  IErrorResponse,
  NotificationError,
} from '@vissoft-react/common';
import { prefixSaleService } from '../../../../src/constants';
import { safeApiClient } from '../../../../src/services';

const getFileBlob = (data: Blob, fileUrl: string) => {
  const filenameSplit = fileUrl.split('.');
  const fileType = filenameSplit[
    filenameSplit.length - 1
  ] as keyof typeof FILE_TYPE;

  const blob = new Blob([data], {
    type: FILE_TYPE[fileType] || 'application/octet-stream',
  });
  return blob;
};

const fetcher = async (url: string) => {
  const res = await safeApiClient.get<Blob>(
    `${prefixSaleService}/files/download`,
    {
      params: {
        fileUrl: url,
      },
      responseType: 'blob',
    }
  );
  return res;
};

export const useGetFileDownloadFn = () => {
  return useMutation({
    mutationFn: (fileUrl: string) => fetcher(fileUrl),
    onSuccess(data: Blob, fileUrl: string) {
      const nameArr = fileUrl.split('/');
      const blob = getFileBlob(data, fileUrl);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.style.display = 'none'; // Hide the element
      a.href = url;
      a.download = nameArr[nameArr.length - 1];
      a.click();

      window.URL.revokeObjectURL(url);
      a.remove();
    },
    onError: (err: IErrorResponse) => {
      if (err?.detail) {
        NotificationError({ message: err?.detail });
      } else {
        NotificationError({ message: 'Không thể tải file. Vui lòng thử lại.' });
      }
    },
  });
};
