import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { PackageRequest } from '../types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { prefixCustomerService } from '@react/url/app';
import { CommonError } from '@react/commons/types';

const fetcher = (params: PackageRequest) => {
  return axiosClient.post<PackageRequest, Response>(
    `${prefixCustomerService}/reg-del-pck`,
    params
  );
};

export const usePackageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: fetcher,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_DETAIL_SUBSCRIPTION],
      });
    },
    onError: (error: CommonError) => error,
  });
};
