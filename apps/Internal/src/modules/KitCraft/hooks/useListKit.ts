import { useQuery } from '@tanstack/react-query';
import { prefixResourceService } from 'apps/Internal/src/constants/app';
import { axiosClient } from 'apps/Internal/src/service';
import { KitCraftType } from '../types';

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
    `${prefixResourceService}/sim-registrations`,
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
