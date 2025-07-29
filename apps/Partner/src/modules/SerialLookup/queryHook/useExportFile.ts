import { NotificationSuccess } from '@react/commons/index';
import { prefixResourceServicePublic } from '@react/url/app';
import { downloadFileFn } from '@react/utils/handleFile';
import { useMutation } from '@tanstack/react-query';
import useFileNameDownloaded from 'apps/Partner/src/hooks/useFileNameDownloaded';
import { axiosClient } from 'apps/Partner/src/service';
import { ParamsSerialLookup } from '../types';
import { TenMinutes } from '@react/constants/app';

export const fetcher = (params: ParamsSerialLookup) => {
  const customParams = {
    ...params,
    productIds: params.productIds
        ? params.productIds.split(',').map((item) => Number(item))
        : [],
      orgIds: params.orgIds
        ? params.orgIds.split(',').map((item) => Number(item))
        : [],
  }
  return axiosClient.post<string, Blob>(
    `${prefixResourceServicePublic}/stock-product-serial/export`,
    customParams,
    {
      timeout: TenMinutes,
      responseType: 'blob',
    }
  );
};

export const useExportFile = () => {
  return useMutation({
    mutationFn: fetcher,
    onSuccess: (data: Blob) => {
      const fileName = useFileNameDownloaded.getState().name;
      downloadFileFn(data, fileName ? fileName : 'danh_sach_serial', data.type);
      NotificationSuccess('Xuất serial thành công');
    },
  });
};
