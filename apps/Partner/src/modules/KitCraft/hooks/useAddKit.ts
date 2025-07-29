import { NotificationSuccess } from '@react/commons/index';
import { MESSAGE } from '@react/utils/message';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from 'apps/Partner/src/service';
import { queryKeyListKitCraft } from './useListKit';
import { prefixResourceServicePublic } from '@react/url/app';

export const queryKeyConfig = 'query-combine-individual-kits';

const fetcher = (body: any) => {
  return axiosClient.post<Request, Response>(
    `${prefixResourceServicePublic}/sim-registrations/combine-individual-kits`,
    body
  );
};

export const useAddKit = () => {
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
