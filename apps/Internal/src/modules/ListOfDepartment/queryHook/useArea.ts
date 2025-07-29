import { axiosClient } from 'apps/Internal/src/service';
import { useMutation } from '@tanstack/react-query';
import { prefixCatalogService } from 'apps/Internal/src/constants/app';

export type Cadastral = {
  id: number;
  areaCode: string;
  areaName: string;
  providerAreaCode: string;
};

const fetcher = (parentId?: string | number) => {
  if (parentId === undefined) return Promise.resolve([]);
  return axiosClient.get<string | number, Cadastral[]>(
    `${prefixCatalogService}/area?parentId=${parentId}`
  );
};

export const useArea = () => {
  return useMutation({
    mutationFn: fetcher,
  });
};
