import { prefixResourceServicePublic } from '@react/url/app';
import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Partner/src/service';

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
    `/${prefixResourceServicePublic}/sim-registrations/suggest-serial-number`,
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
