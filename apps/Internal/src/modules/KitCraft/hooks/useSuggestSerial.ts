import { IPage } from '@react/commons/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { OrderType } from '../types';
import { prefixResourceService } from '@react/url/app';

export interface SerialReq {
  orgId: number;
  serialFirst?: number;
  simType: string;
  amount: number;
}

export interface SerialRes {
  firstSerial: number;
  lastSerial: number;
}

export const queryKeySuggestSerial = 'query-get-suggest-serial';

const fetcher = (params?: SerialReq) => {
  return axiosClient.get<SerialReq, SerialRes>(
    `/${prefixResourceService}/sim-registrations/suggest-serial-number`,
    {
      params,
    }
  );
};

export const useSuggestSerial = () => {
  return useMutation({
    mutationFn: fetcher,
    mutationKey: [queryKeySuggestSerial],
  });
};
