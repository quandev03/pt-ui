import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';

const fetcher = async () => {
  return await axiosClient.get<any, any>(
    `${prefixCustomerService}/sale-employee/get-all-am-employee`
  );
};

export const useGetAllAmEmployee = () => {
  return useQuery({
    queryKey: ['sale-employee/get-all-am-employee'],
    queryFn: () => fetcher(),
  });
};
