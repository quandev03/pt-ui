import { prefixResourceServicePublic } from '@react/url/app';
import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Partner/src/service';

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
    `/${prefixResourceServicePublic}/sim-registrations/suggest-first-serial-number`,
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
