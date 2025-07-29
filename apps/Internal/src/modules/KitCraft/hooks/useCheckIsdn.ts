import { IPage } from '@react/commons/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { OrderType } from '../types';
import { prefixResourceService } from '@react/url/app';

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
    `/${prefixResourceService}/sim-registrations/valid-isdn`,
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
