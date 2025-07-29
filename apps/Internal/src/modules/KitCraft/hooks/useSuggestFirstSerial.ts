import { IPage } from '@react/commons/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { OrderType } from '../types';
import { prefixResourceService } from '@react/url/app';

export interface SerialReq {
  orgId: number;
  fromSerial: number;
  simType: string;
}

export interface SerialRes {
  orgId: number;
  orgCode: string;
  serialNumber: number;
}

export const queryKeySuggestFirstSerial = 'query-get-suggest-first-serial';

const fetcher = (params?: SerialReq) => {
  return axiosClient.get<SerialReq, SerialRes>(
    `/${prefixResourceService}/sim-registrations/suggest-first-serial-number`,
    {
      params,
    }
  );
};

export const useSuggestFirstSerial = () => {
  return useMutation({
    mutationFn: fetcher,
    mutationKey: [queryKeySuggestFirstSerial],
  });
};
