import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Partner/src/service';
import { KitCraftType } from '../types';
import { prefixResourceServicePublic } from '@react/url/app';

export interface Req {
  startDate: string;
  endDate: string;
  page: number;
  size: number;
}

interface Res {
  content: KitCraftType[];
  totalElements: number;
  size: number;
}

export const queryKeyListKitUnCraft = 'query-list-kit-uncraft-of-thucnv';

const fetcher = (params: any) => {
  return axiosClient.get<Req, Res>(
    `${prefixResourceServicePublic}/sim-registrations/search-cancel-sim-registration`,
    { params }
  );
};

export const useListKitCraft = (body: any) => {
  return useQuery({
    queryFn: () => fetcher(body),
    queryKey: [queryKeyListKitUnCraft, body],
    select: (data: any) => data,
    enabled: true,
  });
};
