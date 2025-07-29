import { IPage, IParamsRequest } from '@react/commons/types';
import { prefixResourceServicePublic } from '@react/url/app';
import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Partner/src/service';

export interface IParamsListKit extends IParamsRequest {
  isdn?: string;
  productId?: number;
  fromSerial?: string;
  toSerial?: string;
  packageId?: string;
}

export interface IKitListItem {
  id: number;
  isdn: number;
  serial: number;
  productName: string;
  packageProfileName: string;
  isdnType: string;
  profileType: string;
  simType: string;
  stockIsdnName: string;
  stockSerialName: string;
  processType: number;
  ownerName: any;
  createdBy: string;
  createdDate: string;
  status: number | string;
}

export const queryKeyListKitCraft = 'query-list-kit-craft';

const fetcher = (params: IParamsListKit) => {
  return axiosClient.get<Request, IPage<IKitListItem>>(
    `${prefixResourceServicePublic}/sim-registrations/kit-list`,
    { params }
  );
};

export const useKitList = (body: any) => {
  return useQuery({
    queryFn: () => fetcher(body),
    queryKey: [queryKeyListKitCraft, body],
    enabled: true,
  });
};
