import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { LastFiveCallResquest } from '../types';
import { prefixCustomerService } from '@react/url/app';
import { CommonError } from '@react/commons/types';

const fetcher = (params: LastFiveCallResquest) => {
  return axiosClient.post<LastFiveCallResquest, Response>(
    `${prefixCustomerService}/change-sim/check-5-numbers`,
    params
  );
};

export const useLastFiveCallMutation = () => {
  return useMutation({
    mutationFn: fetcher,
    onError: (error: CommonError) => error,
  });
};
