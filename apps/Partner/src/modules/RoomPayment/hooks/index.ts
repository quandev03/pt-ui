import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  IFieldErrorsItem,
  NotificationSuccess,
  IErrorResponse,
  NotificationError,
} from '@vissoft-react/common';
import { REACT_QUERY_KEYS } from '../../../../src/constants/query-key';
import { IRoomPayment, IRoomPaymentParams, IRoomPaymentUploadParams } from '../types';
import { roomPaymentServices } from '../services';

export const useGetRoomPaymentList = (params: IRoomPaymentParams) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.ROOM_PAYMENT_LIST, params],
    queryFn: () => roomPaymentServices.getRoomPaymentList(params),
  });
};

export const useGetRoomPaymentDetail = (id: string | undefined) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.ROOM_PAYMENT_DETAIL, id],
    queryFn: () => {
      if (!id) throw new Error('ID is required');
      return roomPaymentServices.getRoomPaymentDetail(id);
    },
    enabled: !!id,
  });
};

export const useUploadRoomPaymentFile = (
  onSuccess: (data: IRoomPayment[]) => void,
  onError: (errorField: IFieldErrorsItem[]) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IRoomPaymentUploadParams) =>
      roomPaymentServices.uploadRoomPaymentFile(data),
    onSuccess: (data) => {
      NotificationSuccess('Tạo thanh toán thành công');
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.ROOM_PAYMENT_LIST],
      });
      onSuccess(data);
    },
    onError(error: IErrorResponse & { fieldErrors?: IFieldErrorsItem[] }) {
      if (error?.errors) {
        onError(error?.errors);
      } else {
        NotificationError({
          message: 'Lỗi hệ thống, tạo thanh toán thất bại',
        });
      }
    },
  });
};

