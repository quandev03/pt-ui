import { prefixCustomerService } from '@react/url/app';
import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import useStoreBusinessManagement from '../store';

const fetcher = () => {
  return axiosClient.get<any, any>(
    `${prefixCustomerService}/enterprise/check-role-emp`
  );
};
export const useGetPositionCode = () => {
  const { setPositionCode } = useStoreBusinessManagement();
  return useMutation({
    mutationFn: fetcher,
    onSuccess: (data: any) => {
      setPositionCode(data.positionCode);
    },
  });
};
