import { useQuery } from '@tanstack/react-query';
import { AnyElement } from '@vissoft-react/common';
import { prefixAuthService } from 'apps/Internal/src/constants';
import { safeApiClient } from 'apps/Internal/src/services';

export const queryKeyListAction = 'query-users-by-org-id';

const fetcher = () => {
  return safeApiClient.get<AnyElement>(`${prefixAuthService}/api/actions`);
};

export const useListAction = () => {
  return useQuery({
    queryFn: () => fetcher(),
    queryKey: [queryKeyListAction],
    select: (data: AnyElement[]) =>
      data?.map((e: AnyElement) => ({
        value: e.id,
        label: e.name,
        code: e.code,
      })),
    enabled: true,
  });
};
