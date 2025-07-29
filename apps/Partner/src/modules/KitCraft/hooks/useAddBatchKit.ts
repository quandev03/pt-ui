import { NotificationSuccess } from '@react/commons/index';
import { MESSAGE } from '@react/utils/message';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from 'apps/Partner/src/service';
import { queryKeyListKitCraft } from './useListKit';
import { prefixResourceServicePublic } from '@react/url/app';
import { UploadFile } from 'antd';

export const queryKeyConfig = 'query-combine-pack-kits';

const fetcher = ({ payload, files }: any) => {
  const formData = new FormData();
  const request = new Blob([JSON.stringify(payload)], {
    type: 'application/json',
  });
  formData.append('request', request);
  files?.map((file: Blob) => {
    formData.append('file', file);
  });
  return axiosClient.post<Request, Response>(
    `${prefixResourceServicePublic}/sim-registrations/combine-pack-kits`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data ',
      },
    }
  );
};

export const useAddBatchKit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [queryKeyConfig],
    mutationFn: fetcher,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeyListKitCraft],
      });
      NotificationSuccess(MESSAGE.G01);
    },
  });
};
