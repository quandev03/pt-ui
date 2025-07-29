import {
  NotificationError,
  NotificationSuccess,
} from '@react/commons/Notification';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { OrderAtStoreService } from '../services';
import {
  IParamsUserRefund,
  ParamsOnlineOrderAtStoreManagement,
} from '../types';
import { MESSAGE } from '@react/utils/message';

export const REACT_QUERY_KEYS_ONLINE_ORDER_AT_STORE = {
  GET_LIST_CHANNEL_ORDER_AT_STORE: 'GET_LIST_CHANNEL_ORDER_AT_STORE',
  GET_LIST_USER_REFUND: 'GET_LIST_USER_REFUND',
};

export const useListOnlineOrdersAtStoreManagement = (
  param: ParamsOnlineOrderAtStoreManagement
) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.SEARCH_ORDER_AT_STORE, param],
    queryFn: () => OrderAtStoreService.getOnlineOrdersAtStore(param),
  });
};

export const useListChannles = (disabled?: boolean) => {
  return useQuery({
    queryKey: [
      REACT_QUERY_KEYS_ONLINE_ORDER_AT_STORE.GET_LIST_CHANNEL_ORDER_AT_STORE,
    ],
    queryFn: OrderAtStoreService.getListChannel,
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

export const useCancelOrderAtStore = (onSuccess: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: OrderAtStoreService.cancelOnlineOrdersAtStore,
    onSuccess: () => {
      onSuccess();
      NotificationSuccess('Hủy đơn hàng thành công!');
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.SEARCH_ORDER_AT_STORE],
      });
    },
    onError: (error: any) => {
      NotificationError(error ? error?.message : MESSAGE.G08);
    },
  });
};

export const useRefundOrderAtStore = (onSuccess: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: OrderAtStoreService.refundOnlineOrdersAtStore,
    onSuccess: () => {
      onSuccess();
      NotificationSuccess('Đã gửi yêu cầu hoàn tiền!');
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.SEARCH_ORDER_AT_STORE],
      });
    },
    onError: (error: any) => {
      NotificationError(error ? error?.message : MESSAGE.G08);
    },
  });
};

export const useListUserRefund = () => {
  return useMutation({
    mutationFn: OrderAtStoreService.getListUserRefund,
  });
};

export const useInfinityScrollUser = (params: IParamsUserRefund) => {
  return useInfiniteQuery({
    queryKey: [
      REACT_QUERY_KEYS_ONLINE_ORDER_AT_STORE.GET_LIST_USER_REFUND,
      params,
    ],
    initialPageParam: params.page,
    queryFn: ({ pageParam = 0 }) => {
      return OrderAtStoreService.getListUserRefund({
        ...params,
        page: pageParam,
      });
    },
    select: (data) => {
      const { pages } = data;
      const result: any[] = [];
      pages.forEach((item) => {
        item.content.forEach((user: any) => {
          result.push(user);
        });
      });
      return result;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.number >= lastPage.totalPages - 1) {
        return undefined;
      }
      return lastPage.number + 1;
    },
  });
};

export const useCombineKitOrderAtStore = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: OrderAtStoreService.combineKitOrdersAtStore,
    onSuccess: () => {
      onSuccess && onSuccess();
      NotificationSuccess('Ghép Kit thành công!');
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.SEARCH_ORDER_AT_STORE],
      });
    }
  });
};

export const useConfirmReceiptOrderAtStore = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: OrderAtStoreService.confirmReceipt,
    onSuccess: () => {
      onSuccess && onSuccess();
      NotificationSuccess('Xác nhận giao hàng thành công!');
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.SEARCH_ORDER_AT_STORE],
      });
    },
  });
};

export const useConfirmReceipt = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: OrderAtStoreService.confirmReceipt,
    onSuccess: () => {
      onSuccess && onSuccess();
      NotificationSuccess('Xác nhận giao hàng cho đơn hàng thành công!');
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.SEARCH_ORDER_AT_STORE],
      });
    },
    onError: (error: any) => {
      NotificationError(error ? error?.message : MESSAGE.G08);
    },
  });
};
