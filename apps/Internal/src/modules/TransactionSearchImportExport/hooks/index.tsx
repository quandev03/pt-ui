import { NotificationSuccess } from '@react/commons/Notification';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { TransactionSearchImportExportService } from 'apps/Internal/src/modules/TransactionSearchImportExport/services';
import { IParamsPage } from 'apps/Internal/src/modules/TransactionSearchImportExport/types';

export const useSearchPageByParams = (params: IParamsPage) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.TransactionSearchImportExportList, params],
    queryFn: () => TransactionSearchImportExportService.searchList(params),
  });
};
export const useCancelTransaction = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: TransactionSearchImportExportService.cancelTransaction,
    onSuccess: () => {
      NotificationSuccess('Hủy giao dịch thành công');
      onSuccess && onSuccess();
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.TransactionSearchImportExportList],
      });
    },
  });
};
