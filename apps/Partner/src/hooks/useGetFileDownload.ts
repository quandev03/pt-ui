import { prefixResourceServicePublic } from '@react/url/app';
import { useMutation } from '@tanstack/react-query';
import useFileNameDownloaded from '../components/layouts/store/useFileNameDownloaded';
import { axiosClient } from '../service';
interface ExportRequest {
  uri: string;
  filename?: string;
  createdDate?: string;
}
const openSaveDialog = (data: Blob, filename?: string) => {
  const url = window.URL.createObjectURL(data);
  const a = document.createElement('a');
  document.body.appendChild(a);
  a.href = url;
  a.download = filename ?? useFileNameDownloaded.getState().name;
  a.click();
  URL.revokeObjectURL(a.href);
  a.remove();
};
export const useDownloadSaleFile = () => {
  return useMutation({
    mutationFn: async (payload: ExportRequest) => {
      return await axiosClient.post<string, Blob>(
        `${prefixResourceServicePublic}/files`,
        {
          fileUrl: payload.uri,
        },
        {
          responseType: 'blob',
        }
      );
    },
    onSuccess(data, payload) {
      openSaveDialog(data, payload.filename);
    },
  });
};
