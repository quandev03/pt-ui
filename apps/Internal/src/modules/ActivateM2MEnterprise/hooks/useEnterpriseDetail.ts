import { useMutation, useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';

const fetcher = (id: string) => {
  return axiosClient.get<any>(
    `${prefixCustomerService}/enterprise/detail-enterprise/${id}`
  );
};

export const useEnterpriseDetail = (onSuccess: (data: any) => void) => {
  return useMutation({
    mutationFn: fetcher,
    onSuccess: (data: any) => {
      onSuccess(data);
    },
  });
};
