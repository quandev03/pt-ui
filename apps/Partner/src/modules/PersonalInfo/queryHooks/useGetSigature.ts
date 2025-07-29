import { useQuery } from '@tanstack/react-query';
import { prefixAuthServicePublic } from 'apps/Partner/src/constants/app';
import { axiosClient } from 'apps/Partner/src/service';
export const queryKeyGetSignature = 'query-get-signature-personal';

const fetcher = () => {
  return axiosClient.get<undefined, any>(
    `${prefixAuthServicePublic}/api/auth/signature`,
    {
      responseType: 'blob',
    }
  );
};

export const useGetSignature = () => {
  return useQuery({
    queryFn: () => fetcher(),
    queryKey: [queryKeyGetSignature],
    select: (data: any) => {
      const blobFile = new Blob([data], { type: 'image/png' });
      return URL.createObjectURL(blobFile);
    },
  });
};
