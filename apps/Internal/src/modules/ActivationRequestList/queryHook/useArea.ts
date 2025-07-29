import { useMutation } from '@tanstack/react-query';
import { NotificationError } from '@react/commons/Notification';
import { axiosClient } from 'apps/Internal/src/service';
import { prefixCatalogService } from 'apps/Internal/src/constants/app';

export type Cadastral = {
  areaId: number;
  areaCode: string;
  areaName: string;
};

const fetcher = (parentId?: string | number) => {
  return axiosClient.get<any>(
    `${prefixCatalogService}/area?parentId=${parentId}`
  );
};

export const useArea = () => {
  return useMutation({
    mutationFn: fetcher,
    onError: (err) => {
      if (err?.message) {
        NotificationError(err?.message);
      }
    },
  });
};
