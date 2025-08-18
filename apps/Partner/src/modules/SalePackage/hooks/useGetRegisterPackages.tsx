import { useMutation, useQueryClient } from '@tanstack/react-query';
import { packageSaleService } from '../services';
import { REACT_QUERY_KEYS } from 'apps/Partner/src/constants/query-key';
import { ISinglePackageSalePayload } from '../types';
import {
  IErrorResponse,
  IFieldErrorsItem,
  NotificationError,
} from '@vissoft-react/common';

export const useGetRegisterPackages = (
  onSuccess: () => void,
  onError: (errorField: IFieldErrorsItem[]) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ISinglePackageSalePayload) =>
      packageSaleService.getRegisterPackage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_REGISTER_PACKAGES],
      });
      onSuccess();
    },
    onError(error: IErrorResponse & { fieldErrors?: IFieldErrorsItem[] }) {
      if (error?.errors) {
        const errorMessage =
          error?.detail || 'Có lỗi xảy ra khi book eSIM miễn phí!';

        NotificationError({ message: errorMessage });
        onError(error?.errors);
      }
    },
  });
};
