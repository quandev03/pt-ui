import { prefixResourceServicePublic } from '@react/url/app';
import { downloadFileFn } from '@react/utils/handleFile';
import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Partner/src/service';

interface DownloadFileReq {
  fileUrl: string;
}

const fetcher = (body: DownloadFileReq) => {
  return axiosClient.post<DownloadFileReq, Blob>(
    `${prefixResourceServicePublic}/files`,
    body,
    { responseType: 'blob' }
  );
};

export const useDownloadFile = () => {
  return useMutation({
    mutationFn: fetcher,
    onSuccess: (data, { fileUrl }) =>
      downloadFileFn(
        data,
        fileUrl?.split('/').slice(-1)[0],
        'application/octet-stream'
      ),
  });
};
