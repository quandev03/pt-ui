import { IPage } from '@react/commons/types';
import { prefixResourceServicePublic } from '@react/url/app';
import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Partner/src/service';
import { OrderType } from '../types';

export interface SerialReq {
  serialFirst: number;
  quantity: number;
  orgId: number;
  simType: string;
}

export const queryKeyLastSerial = 'query-get-last-serial';

const fetcher = (params?: SerialReq) => {
  return axiosClient.get<SerialReq, IPage<OrderType>>(
    `${prefixResourceServicePublic}/sim-registrations/suggest-last-serial-number`,
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
