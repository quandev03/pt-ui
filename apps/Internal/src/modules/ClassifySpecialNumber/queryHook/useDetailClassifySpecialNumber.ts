import { prefixResourceService } from '@react/url/app';
import { useMutation, useQuery } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';
import { INumberTransactionDetail } from 'apps/Internal/src/app/types';

const fetcher = (id: string) => {
  return axiosClient.get<any, INumberTransactionDetail>(
    `${prefixResourceService}/classify-special-number/${id}`
  );
};

export const useDetailClassifySpecialNumber = (
  onSuccess: (data: INumberTransactionDetail) => void
) => {
  return useMutation({
    mutationFn: fetcher,
    onSuccess: (data) => {
      onSuccess(data);
    },
  });
};
