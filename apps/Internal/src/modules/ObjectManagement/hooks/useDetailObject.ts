import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { ObjectType } from '../types';
import { prefixAuthServicePrivate } from 'apps/Internal/src/constants/app';

export interface FilterGetOtp {
  isdn: string;
  idEkyc: string;
  otpType: string;
  transactionId: string;
}

export const queryKeyDetailObject = 'query-detail-object';

const fetcher = (id: string | undefined, isPartner: boolean,isMobile:boolean) => {
  return axiosClient.get<string, ObjectType>(
    `${prefixAuthServicePrivate}/api/objects/${id}?isPartner=${isPartner}${
      isMobile ? '&isMobile=true' : ''
    }`
  );
};

export const useDetailObject = (id: string | undefined, isPartner: boolean,isMobile:boolean) => {
  return useQuery({
    queryFn: () => fetcher(id, isPartner,isMobile),
    queryKey: [queryKeyDetailObject, id, isPartner,isMobile],
    select: (data: any) => {
      return {
        ...data,
        name: data?.title,
        url: data.uri,
        ordinal: data.ordinal ?? 1,
        actionIds: data.children?.map((e: any) => e.key),
      };
    },
    enabled: !!id,
  });
};
