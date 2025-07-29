import { IPage } from '@react/commons/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { OrderType } from '../types';
import { prefixResourceService } from '@react/url/app';

export interface SerialReq {
  serialFirst: number;
  quantity: number;
  orgId: number;
  simType: string;
}

export const queryKeyLastSerial = 'query-get-last-serial';

const fetcher = (params?: SerialReq) => {
  return axiosClient.get<SerialReq, IPage<OrderType>>(
    `${prefixResourceService}/sim-registrations/suggest-last-serial-number`,
    {
      params,
    }
  );
};

export const useMutateLastSerial = () => {
  return useMutation({
    mutationFn: fetcher,
    mutationKey: [queryKeyLastSerial],
  });
};
