import { OptionsType } from '@react/commons/types';
import { prefixEventService } from '@react/url/app';
import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';

export const useGetEventLogsKey = 'useGetEventLogsKey';

const fetcher = () => {
  return axiosClient.get<string, OptionsType[]>(
    `${prefixEventService}/access-logs/event-types`
  );
};

export const useGetEventLogs = () => {
  return useQuery({
    queryFn: fetcher,
    queryKey: [useGetEventLogsKey],
    enabled: true,
  });
};
