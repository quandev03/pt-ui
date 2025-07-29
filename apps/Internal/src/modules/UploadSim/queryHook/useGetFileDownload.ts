import { NotificationError } from '@react/commons/Notification';
import { IErrorResponse } from '@react/commons/types';
import { FILE_TYPE } from '@react/constants/app';
import { prefixResourceService } from '@react/url/app';
import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';

const getFileBlob = (data: Blob, payload: string) => {
  console.log(
    '💩💩💩💩💩🙏🏿🙏🏿🙏🏿🙏🏿🙈🙈🙊🙊💋💋😝😝 ~ getFileBlob ~ payload:',
    payload
  );
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
  const res = await axiosClient.post<string, Blob>(
    `${prefixResourceService}/files`,
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
      a.download = nameArr[nameArr.length-1];
      a.click();
      URL.revokeObjectURL(a.href);
      a.remove();
    },
    onError: (err: IErrorResponse) => {
      if (err?.detail) {
        NotificationError(err?.detail);
      }
    },
  });
};
