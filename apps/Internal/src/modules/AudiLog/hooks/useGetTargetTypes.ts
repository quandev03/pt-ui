import { prefixEventService } from '@react/url/app';
import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';

export const useGetTargetTypesKey = 'useGetTargetTypesKey';

const fetcher = (siteCode: string) => {
  return axiosClient.get<
    string,
    {
      code: string;
      name: string;
    }[]
  >(`${prefixEventService}/audit-logs/target-types?siteCode=${siteCode}`);
};

export const useGetTargetTypes = (siteCode: string) => {
  return useQuery({
    queryFn: () => fetcher(siteCode),
    queryKey: [useGetTargetTypesKey, siteCode],
    enabled: !!siteCode,
    select: (data) =>
      data.map((item) => ({ label: item.name, value: item.code })),
  });
};
