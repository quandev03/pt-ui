import { IOption } from '@react/commons/types';
import { prefixEventService } from '@react/url/app';
import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';

export const useTypeOfImpactKey = 'useTypeOfImpactKey';

const fetcher = () => {
  return axiosClient.get<string, IOption[]>(
    `${prefixEventService}/audit-logs/action-types`
  );
};

export const useTypeOfImpact = () => {
  return useQuery({
    queryFn: fetcher,
    queryKey: [useTypeOfImpactKey],
  });
};
