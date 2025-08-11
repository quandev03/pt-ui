import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IErrorResponse, IFieldErrorsItem } from '@vissoft-react/common';
import { IQrCodeGen } from '../types';
import { esimWarehouseServices } from '../services';
import { REACT_QUERY_KEYS } from '../../../../src/constants/query-key';

export const useGetGenQrCode = (
  onSuccess: (data: Blob) => void,
  onError: (errorField: IFieldErrorsItem[]) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: IQrCodeGen) =>
      esimWarehouseServices.getGenQrCode(payload),
    onSuccess: (data: Blob) => {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_QR_CODE_GEN],
      });
      onSuccess(data);
    },
    onError(error: IErrorResponse & { errors?: IFieldErrorsItem[] }) {
      if (error?.errors) {
        onError(error.errors);
      }
    },
  });
};
