import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { OnlineOrders } from '../services';
import { ParamsOnlineOrdersManagement } from '../types';
import {
  NotificationError,
  NotificationSuccess,
} from '@react/commons/Notification';
import { MESSAGE } from '@react/utils/message';
import { IErrorResponse, IFieldErrorsItem } from '@react/commons/types';

const REACT_QUERY_KEYS_ONLINE_ORDER = {
  GET_LIST_CHANNEL_ORDER_ONLINE: 'GET_LIST_CHANNEL_ORDER_ONLINE',
  GET_FEE_BY_ORDER: 'GET_FEE_BY_ORDER',
};

export const useUpdateOnlineOrder = (
  onSuccess: () => void,
  onError: (errorField: IFieldErrorsItem[]) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: OnlineOrders.updateOnlineOrder,
    onSuccess: () => {
      NotificationSuccess(MESSAGE.G02);
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_LIST_ONLINE_ORDER],
      });
      onSuccess();
    },
    onError(error: IErrorResponse & { fieldErrors?: IFieldErrorsItem[] }) {
      if (error?.fieldErrors) {
        onError(error?.fieldErrors);
      } else {
        NotificationError(error.message);
      }
    },
  });
};

export const useListOnlineOrdersManagement = (
  param: ParamsOnlineOrdersManagement
) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_LIST_ONLINE_ORDER, param],
    queryFn: () => OnlineOrders.getOnlineOrdersList(param),
  });
};

export const useGetDetailOnlineOrder = (id: string | number) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_DETAIL_ONLINE_ORDER, id],
    queryFn: () => OnlineOrders.getOnlineOrderDetail(id),
    enabled: !!id,
  });
};

export function useCreateOnlineOrder(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: OnlineOrders.onCreateOnlineOrder,
    onSuccess: () => {
      NotificationSuccess('Tạo đơn hàng thành công!');
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_LIST_ONLINE_ORDER],
      });
      onSuccess && onSuccess();
    },
    onError(error: IErrorResponse & { fieldErrors?: IFieldErrorsItem[] }) {
      NotificationError(error.detail);
    },
  });
}

export const useListChannles = (disabled?: boolean) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS_ONLINE_ORDER.GET_LIST_CHANNEL_ORDER_ONLINE],
    queryFn: OnlineOrders.getListChannel,
    select: (data: any) => {
      if (!data) return [];
      return data.map((item: any) => ({
        label: item.value,
        value: item.code,
      }));
    },
    enabled: !disabled,
  });
};

export const useSelectDVVC = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: OnlineOrders.onSelectDVVC,
    onSuccess: () => {
      NotificationSuccess('Chọn lại ĐVVC thành công!');
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_LIST_ONLINE_ORDER],
      });
      onSuccess && onSuccess();
    },
    onError(error: IErrorResponse & { fieldErrors?: IFieldErrorsItem[] }) {
      NotificationError(error.detail);
    },
  });
};

export const useFeeByOder = (
  id: string,
  partner: string,
  disabled?: boolean
) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS_ONLINE_ORDER.GET_FEE_BY_ORDER, id, partner],
    queryFn: () => OnlineOrders.getFeeByPartner(id, partner),
    enabled: !disabled && !!id && !!partner,
  });
};
