import { prefixAuthServicePrivate } from '@react/url/app';
import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';

export const queryKeyGetSignature = 'query-get-signature-personal';

const fetcher = () => {
  return axiosClient.get<undefined, any>(
    `${prefixAuthServicePrivate}/api/auth/signature`,
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
