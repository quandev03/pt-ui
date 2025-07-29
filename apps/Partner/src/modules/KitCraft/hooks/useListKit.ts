import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Partner/src/service';
import { KitCraftType } from '../types';
import { prefixResourceServicePublic } from '@react/url/app';

export interface Req {
  processType: string;
  orderNo: string;
  fromDate: string;
  toDate: string;
  page: number;
  size: number;
}

interface Res {
  content: KitCraftType[];
  totalElements: number;
  size: number;
}

export const queryKeyListKitCraft = 'query-list-kit-craft-of-thucnv';

const fetcher = (params: any) => {
  return axiosClient.get<Req, Res>(
    `${prefixResourceServicePublic}/sim-registrations`,
    { params }
  );
};

export const useListKitCraft = (body: any) => {
  return useQuery({
    queryFn: () => fetcher(body),
    queryKey: [queryKeyListKitCraft, body],
    select: (data: any) => data,
    enabled: true,
  });
};
