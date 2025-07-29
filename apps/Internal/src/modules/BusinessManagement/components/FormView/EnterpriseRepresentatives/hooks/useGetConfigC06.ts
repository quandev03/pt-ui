import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import { axiosClient } from 'apps/Internal/src/service';
import { useQuery } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { IConfigItem } from '../type';

const fetcher = (type: number) => {
  return axiosClient.get<string, IConfigItem[]>(
    `${prefixCustomerService}/application-config/get-application-config-by-type?type=${type}`
  );
};
export const useGetConfigC06 = () => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_ACTIVATION_CONFIG_LIST],
    queryFn: () => fetcher(2),
    select(data) {
      return data.find((item) => item.code === 'C06_REQUIRE')?.status;
    },
  });
};
