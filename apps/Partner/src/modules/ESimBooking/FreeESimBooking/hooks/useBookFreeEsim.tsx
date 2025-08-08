import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  IErrorResponse,
  IFieldErrorsItem,
  NotificationSuccess,
} from '@vissoft-react/common';
import { freeEsimBookingServices } from '../services';
import { REACT_QUERY_KEYS } from '../../../../constants/query-key';

export const useBookFreeEsim = (
  onSuccess: () => void,
  onError: (errorField: IFieldErrorsItem[]) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: freeEsimBookingServices.getBookEsimFree,
    onSuccess: () => {
      NotificationSuccess('Book mới thành công!');
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.BOOK_NEW_ESIM],
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
