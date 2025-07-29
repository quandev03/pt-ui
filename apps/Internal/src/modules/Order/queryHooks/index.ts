import { NotificationSuccess } from '@react/commons/Notification';
import { IParamsRequest } from '@react/commons/types';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { OrderService } from '../services';
import {
  ICalculateDiscountData,
  IDataOrder,
  IOrderParams,
  IProductInOrder,
  IResGetFile,
} from '../types';
import { StatusOrderEnum } from '../constants';

export const useGetOrders = (params: IOrderParams) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.ORDERS, params],
    queryFn: () => OrderService.getOrders(params),
  });
};

export const useArea = (key: string, parentId?: string | number) => {
  return useQuery({
    queryKey: [key, parentId],
    enabled: key === 'provinces' ? true : !!parentId,
    queryFn: () => OrderService.getArea(parentId),
  });
};

export const useGetOrderProduct = (params: IParamsRequest) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.PRODUCT_IN_ORDER, params],
    queryFn: () => OrderService.getProductOrder(params),
  });
};

export const useGetProductType = () => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.PRODUCT_TYPE],
    queryFn: () => OrderService.getProductType(),
  });
};

export const useCreateOrder = (
  onSuccess?: (data: IDataOrder) => void,
  onFail?: () => void
) => {
  return useMutation({
    mutationFn: OrderService.createOrder,
    onSuccess(data) {
      onSuccess && onSuccess(data);
      NotificationSuccess('Tạo mới thành công');
    },
    onError() {
      onFail && onFail();
    },
  });
};

export const useSupportGetCalculateDiscount = (
  onSuccess?: (data: ICalculateDiscountData) => void,
  onFail?: () => void
) => {
  return useMutation({
    mutationFn: OrderService.getCalculateDiscount,
    onSuccess(data) {
      onSuccess && onSuccess(data);
    },
    onError() {
      onFail && onFail();
    },
  });
};

export const useGetOrderDetail = (onSuccess: (data: IDataOrder) => void) => {
  return useMutation({
    mutationFn: OrderService.getOrdersDetail,
    onSuccess(data) {
      onSuccess(data);
    },
  });
};

export const useGetFileOrder = (onSuccess: (data: IResGetFile[]) => void) => {
  return useMutation({
    mutationFn: OrderService.getFileOrder,
    onSuccess(data) {
      onSuccess(data);
    },
  });
};

export const useSupportUpdateStatusAdminOrder = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: OrderService.updateStatusOrderAdmin,
    onSuccess(data, payload) {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.ORDERS],
      });
      onSuccess && onSuccess();
      if (payload.status === StatusOrderEnum.APPROVED) {
        NotificationSuccess('Duyệt đơn hàng thành công');
      } else if (payload.status === StatusOrderEnum.REJECTED) {
        NotificationSuccess('Từ chối đơn thành công');
      } else {
        NotificationSuccess('Cập nhật thành công');
      }
    },
  });
};

export const useInfinityScrollProduct = (params: IParamsRequest) => {
  return useInfiniteQuery({
    queryKey: [REACT_QUERY_KEYS.PRODUCT_IN_ORDER_INFINITY_SCROLL, params],
    initialPageParam: 0,
    queryFn: ({ pageParam = 0 }) => {
      return OrderService.getProductOrder({ ...params, page: pageParam });
    },
    select: (data) => {
      const { pages } = data;
      const result: IProductInOrder[] = [];
      pages.forEach((item) => {
        item.content.forEach((product) => {
          result.push(product);
        });
      });
      return result;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.last) {
        return undefined;
      }
      return lastPage.number + 1;
    },
  });
};
export function useSupportPartnerInfo(params?: { vnskyInfo: boolean }) {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_PARTNER_INFO, params],
    queryFn: () => {
      return OrderService.getPartnerInfor(params);
    },
  });
}
export const useDownloadReport = () => {
  return useMutation({
    mutationFn: OrderService.downloadReport,
  });
};
