import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { queryKeyListTrans } from './useListTrans';
import { prefixSaleService } from '@react/url/app';

export const queryKeyConfig = 'query-combine-individual-kits';

export interface RequestAddTrans {
  payload: any;
  isImport?: boolean;
}

const fetcher = ({ payload, isImport }: RequestAddTrans) => {
  return axiosClient.post<Request, Response>(
    `${prefixSaleService}/stock-move${isImport ? '' : '/ticket-out'}`,
    payload
  );
};

export const useAddTrans = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [queryKeyConfig],
    mutationFn: fetcher,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeyListTrans],
      });
    },
  });
};
