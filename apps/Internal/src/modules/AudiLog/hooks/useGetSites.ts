import { prefixEventService } from '@react/url/app';
import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';

export const useGetSitesKey = 'useGetSitesKey';

const fetcher = () => {
  return axiosClient.get<
    string,
    {
      code: string;
      name: string;
    }[]
  >(`${prefixEventService}/sites`);
};

export const useGetSites = () => {
  return useQuery({
    queryFn: fetcher,
    queryKey: [useGetSitesKey],
    enabled: true,
    select: (data) =>
      data.map((item) => ({ label: item.name, value: item.code })),
  });
};
