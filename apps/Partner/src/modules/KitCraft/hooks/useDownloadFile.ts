import { prefixResourceServicePublic } from '@react/url/app';
import { downloadFileFn } from '@react/utils/handleFile';
import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Partner/src/service';

interface DownloadFileReq {
  fileType: 'FILENAME' | 'TEMPLATE' | 'RESULT';
  id?: number;
  fileName: string;
  detailId?: number;
}

export const queryKeyDownloadFile = 'query-get-download-file';

const fetcher = (params: DownloadFileReq) => {
  return axiosClient.get<DownloadFileReq, Blob>(
    `${prefixResourceServicePublic}/sim-registrations/download-file`,
    { params, responseType: 'blob' }
  );
};

export const useDownloadFile = () => {
  return useMutation({
    mutationFn: fetcher,
    mutationKey: [queryKeyDownloadFile],
    onSuccess: (data, { fileName }) =>
      downloadFileFn(data, fileName, 'application/octet-stream'),
  });
};
