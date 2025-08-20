import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  IErrorResponse,
  IFieldErrorsItem,
  NotificationError,
  NotificationSuccess,
} from '@vissoft-react/common';
import { IBookFreeEsimPayload } from '../types';
import { freeEsimBookingServices } from '../services';
import { REACT_QUERY_KEYS } from '../../../../constants/query-key';

export const useBookFreeEsim = (
  onSuccess: () => void,
  onError: (errorField: IFieldErrorsItem[]) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    // Add the type here for clarity and safety
    mutationFn: (data: IBookFreeEsimPayload) =>
      freeEsimBookingServices.getBookEsimFree(data),
    onSuccess: () => {
      NotificationSuccess('Hệ thống đang thực hiện book eSIM miễn phí!');
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.BOOK_NEW_ESIM],
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
