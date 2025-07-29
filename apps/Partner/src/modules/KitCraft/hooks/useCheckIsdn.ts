import { prefixResourceServicePublic } from '@react/url/app';
import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Partner/src/service';

export interface IsdnReq {
  orgId?: number;
  stockId: number;
  isdn: number;
}

export interface IsdnRes {
  stockCode: string;
  stockId: number;
  isdn: number;
}

const fetcher = (params?: IsdnReq) => {
  return axiosClient.get<IsdnReq, IsdnRes>(
    `/${prefixResourceServicePublic}/sim-registrations/valid-isdn`,
    {
      params,
    }
  );
};

export const useCheckIsdn = () => {
  return useMutation({
    mutationFn: fetcher,
  });
};
