import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from 'apps/Partner/src/service';
import { queryKeyListOrg } from './useListOrg';
import { prefixSaleService } from '@react/url/app';

const fetcher = (payload: any) => {
  return axiosClient.post<Request, Response>(
    `${prefixSaleService}/transfer-stock-move`,
    payload
  );
};

export const useAddOrg = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fetcher,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeyListOrg],
      });
    },
  });
};
