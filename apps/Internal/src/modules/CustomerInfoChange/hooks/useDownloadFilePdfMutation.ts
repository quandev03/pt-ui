import { useMutation } from '@tanstack/react-query';
import { downloadFilePdf } from '@react/utils/handleFile';
import { axiosClient } from 'apps/Internal/src/service';
import { prefixCustomerServicePublic } from 'apps/Internal/src/constants/app';
interface ExportRequest {
  uri: string;
  filename?: string;
}
const fetcher = (data: ExportRequest) => {
  return axiosClient.get<string, Blob>(prefixCustomerServicePublic + data.uri, {
    responseType: 'blob',
  });
};

export const useDownloadFilePdfMutation = () => {
  return useMutation({
    mutationFn: fetcher,
    onSuccess: (data, variables) => downloadFilePdf(data, variables.filename),
  });
};
