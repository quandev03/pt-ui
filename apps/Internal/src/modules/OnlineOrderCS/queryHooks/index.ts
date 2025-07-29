import {
  NotificationError,
  NotificationSuccess,
} from '@react/commons/Notification';
import { MESSAGE } from '@react/utils/message';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { OrderCsService } from '../services';
import { ParamsOnlineOrdersCSManagement } from '../types';

export const REACT_QUERY_KEYS_ONLINE_ORDER_CS = {
  GET_LIST_CHANNEL_ORDER_CS_ONLINE: 'GET_LIST_CHANNEL_ORDER_CS_ONLINE',
  GET_LIST_USER_REFUND: 'GET_LIST_USER_REFUND',
};

export const useListOnlineOrdersCsManagement = (
  param: ParamsOnlineOrdersCSManagement
) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.SEARCH_ORDER_CS, param],
    queryFn: () => OrderCsService.getOnlineOrdersCS(param),
  });
};

export const useListChannles = (disabled?: boolean) => {
  return useQuery({
    queryKey: [
      REACT_QUERY_KEYS_ONLINE_ORDER_CS.GET_LIST_CHANNEL_ORDER_CS_ONLINE,
    ],
    queryFn: OrderCsService.getListChannel,
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

export const useCancelOrderCs = (onSuccess: () => void) => {
  return useMutation({
    mutationFn: OrderCsService.cancelOnlineOrdersCS,
    onSuccess: () => {
      onSuccess();
      NotificationSuccess('Hủy đơn hàng thành công');
    },
  });
};

export const useUserRefund = () => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS_ONLINE_ORDER_CS.GET_LIST_USER_REFUND],
    queryFn: () => OrderCsService.getListUserRefund(),
    select: (data: any) => {
      if (!data) return [];
      return data.map((item: any) => ({
        label: item.username,
        value: item.email,
      }));
    },
  });
};

export const useRefundOrderCS = (onSuccess: () => void) => {
  return useMutation({
    mutationFn: OrderCsService.refundOnlineOrdersCS,
    onSuccess: () => {
      onSuccess();
      NotificationSuccess('Đã gửi yêu cầu hoàn tiền!');
    },
    onError: (error: any) => {
      NotificationError(error ? error?.message : MESSAGE.G08);
    },
  });
};

export const useCombineKitOrderCs = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: OrderCsService.combineKitOrdersCs,
    onSuccess: () => {
      onSuccess && onSuccess();
      NotificationSuccess('Ghép Kit thành công!');
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.SEARCH_ORDER_CS],
      });
    },
  });
};

export const useSendQReSIMOrderCS = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: OrderCsService.sendQReSIM,
    onSuccess: () => {
      onSuccess && onSuccess();
      NotificationSuccess('Gửi QR eSIM thành công!');
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.SEARCH_ORDER_CS],
      });
    },
  });
};
