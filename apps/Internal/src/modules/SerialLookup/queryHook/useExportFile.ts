import { NotificationSuccess } from '@react/commons/index';
import { prefixResourceServicePublic } from '@react/url/app';
import { downloadFileFn } from '@react/utils/handleFile';
import { useMutation } from '@tanstack/react-query';
import { ParamsSerialLookup } from '../types';
import useFileNameDownloaded from 'apps/Internal/src/components/layouts/store/useFileNameDownloaded';
import { axiosClient } from 'apps/Internal/src/service';
import { TenMinutes } from '@react/constants/app';

export const fetcher = (params: ParamsSerialLookup) => {
  const customParams = {
    isDn: params.isDn,
    orgIds: params.orgIds?.split(','),
    productIds: params.productIds?.split(','),
    fromSerial: params.fromSerial,
    toSerial: params.toSerial,
    status: params.status,
    kitStatus: params.kitStatus,
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
