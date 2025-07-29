import { prefixResourceServicePublic } from '@react/url/app';
import { downloadFileFn } from '@react/utils/handleFile';
import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Partner/src/service';

const fetcher = ({ id }: { id: string | undefined; fileName: string }) => {
  return axiosClient.get<string, Blob>(
    `${prefixResourceServicePublic}/sim-registrations/generate-qr/${id}`,
    { responseType: 'blob' }
  );
};

export const useGenQr = () => {
  return useMutation({
    mutationFn: fetcher,
    onSuccess: (data, { fileName }) =>
      downloadFileFn(data, fileName, 'application/octet-stream'),
  });
};
