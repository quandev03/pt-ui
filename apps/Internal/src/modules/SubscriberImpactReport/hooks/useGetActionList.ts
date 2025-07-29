import { useQuery } from '@tanstack/react-query';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import { axiosClient } from 'apps/Internal/src/service';

const fetcher = () => {
  return axiosClient.post<any, any>(
    `${prefixCustomerService}/get-application-config?type=SUB_ACTION_ENTERPRISE`
  );
};
export const useGetActionList = () => {
  return useQuery({
    queryKey: ['get-action-list-subscriber-impact-report'],
    queryFn: fetcher,
  });
};
