import { prefixResourceServicePublic } from '@react/url/app';
import { downloadFileFn } from '@react/utils/handleFile';
import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Partner/src/service';

const fetcher = () => {
  return axiosClient.get<undefined, Blob>(
    `${prefixResourceServicePublic}/sim-registrations/download-cancel-sim-registration-sample-file`,
    { responseType: 'blob' }
  );
};

export const useDownloadTemplateFile = () => {
  return useMutation({
    mutationFn: fetcher,
    onSuccess: (data) =>
      downloadFileFn(data, 'Danh_sach_KIT.xlsx', 'application/octet-stream'),
  });
};
