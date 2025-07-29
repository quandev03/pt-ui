import { useQuery } from '@tanstack/react-query';
import { prefixAuthServicePrivate } from 'apps/Internal/src/constants/app';
import { axiosClient } from 'apps/Internal/src/service';

export const queryKeyListAction = 'query-users-by-org-id';

const fetcher = () => {
  return axiosClient.get<undefined, any[]>(`${prefixAuthServicePrivate}/api/actions`);
};

export const useListAction = () => {
  return useQuery({
    queryFn: () => fetcher(),
    queryKey: [queryKeyListAction],
    select: (data) =>
      data?.map((e) => ({
        value: e.id,
        label: e.name,
        code: e.code,
      })),
    enabled: true,
  });
};
