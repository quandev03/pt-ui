import { prefixResourceServicePublic } from '@react/url/app';
import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Partner/src/service';
import { KitCraftType } from '../types';

export interface FilterGetOtp {
  isdn: string;
  idEkyc: string;
  otpType: string;
  transactionId: string;
}

export const queryKeyViewKit = 'query-detail-config-approval';

const fetcher = (id: string | undefined) => {
  return axiosClient.get<string, KitCraftType>(
    `${prefixResourceServicePublic}/sim-registrations/${id}/details`
  );
};

export const useViewKit = (id: string | undefined) => {
  return useQuery({
    queryFn: () => fetcher(id),
    queryKey: [queryKeyViewKit, id],
    select: ({
      orgName,
      stockName,
      serial,
      isdnFileUrl,
      details,
      ...data
    }: any) => ({
      ...data,
      serialSim: serial,
      stockId: stockName,
      orgId: orgName,
      isOrderd: !!data?.orderNo,
      isUsingFile: !!details?.[0]?.fileUrl,
      products: details?.map(({ fileUrl, orgName, stockName, ...e }: any) => ({
        ...e,
        stockId: stockName,
        orgId: orgName,
        file: { name: fileUrl?.split('_').slice(2).join('_') },
      })),
    }),
    enabled: !!id,
  });
};
