import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  AnyElement,
  IErrorResponse,
  IFieldErrorsItem,
  NotificationSuccess,
} from '@vissoft-react/common';
import { freeEsimBookingServices } from '../services';
import { REACT_QUERY_KEYS } from '../../../../constants/query-key';
// Import the new payload type
import { IBookFreeEsimPayload } from '../types';

export const useBookFreeEsim = (
  onSuccess: () => void,
  onError: (errorField: IFieldErrorsItem[]) => void
) => {
  const queryClient = useQueryClient();
  return useMutation<
    AnyElement,
    IErrorResponse & { fieldErrors?: IFieldErrorsItem[] },
    IBookFreeEsimPayload
  >({
    mutationFn: freeEsimBookingServices.getBookEsimFree,
    onSuccess: () => {
      NotificationSuccess('Hệ thống đang thực hiện đặt hàng eSIM miễn phí!');
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.BOOK_NEW_ESIM],
      });
      onSuccess();
    },
    onError(error) {
      if (error?.errors) {
        onError(error.errors);
      }
    },
  });
};
