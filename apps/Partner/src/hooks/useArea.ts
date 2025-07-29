import { useMutation } from '@tanstack/react-query';
import { axiosClient } from '../service';
import { prefixCatalogServicePublic } from '@react/url/app';

export type Cadastral = {
  id: number;
  areaCode: string;
  areaName: string;
  providerAreaCode: string;
};

const fetcher = (parentId?: string | number) => {
  if (parentId === undefined) return Promise.resolve([]);
  return axiosClient.get<string | number, Cadastral[]>(
    `${prefixCatalogServicePublic}/area?parentId=${parentId}`
  );
};

export const useArea = () => {
  return useMutation({
    mutationFn: fetcher,
  });
};
