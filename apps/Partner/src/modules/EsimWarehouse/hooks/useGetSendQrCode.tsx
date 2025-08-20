import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  IErrorResponse,
  IFieldErrorsItem,
  NotificationSuccess,
} from '@vissoft-react/common';
import { esimWarehouseServices } from '../services';
import { REACT_QUERY_KEYS } from '../../../constants/query-key';

export const useGetSendQrCode = (
  onSuccess: () => void,
  onError: (errorField: IFieldErrorsItem[]) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: esimWarehouseServices.getSendQrCode,
    onSuccess: () => {
      NotificationSuccess('Gửi thông tin thành công!');
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_QR_CODE_SENT],
      });
      onSuccess();
    },
    onError(error: IErrorResponse & { fieldErrors?: IFieldErrorsItem[] }) {
      if (error?.errors) {
        onError(error?.errors);
      }
    },
  });
};
