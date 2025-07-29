import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Partner/src/constants/querykeys';
import { OrderService } from '../services';
import {
  ICalculateDiscountData,
  IDataOrder,
  IOrderParams,
  IParamsProduct,
  IProductInOrder,
  IResGetFile,
} from '../types';
import { NotificationSuccess } from '@react/commons/Notification';
import { IParamsRequest } from '@react/commons/types';
import { downloadFileFn } from '@react/utils/handleFile';
import { FILE_TYPE } from 'apps/Partner/src/constants';
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

export const useGetOrderProduct = (payload: IParamsProduct) => {
  const { isCall, ...params } = payload;
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.PRODUCT_IN_ORDER, params],
    enabled: !!isCall,
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
    onSuccess(data, payload) {
      if (payload.saleOrderDTO.isCopy) {
        NotificationSuccess('Sao chép thành công');
      } else {
        NotificationSuccess('Tạo mới thành công');
      }
      onSuccess && onSuccess(data);
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

export const useGetFileDownloadOrder = () => {
  return useMutation({
    mutationFn: OrderService.getFileOrderDownload,
    onSuccess(data, payload) {
      const { fileName } = payload;
      const filenameSplit = fileName.split('.');
      const fileType = filenameSplit[
        filenameSplit.length - 1
      ] as keyof typeof FILE_TYPE;

      const blob = new Blob([data], {
        type: FILE_TYPE[fileType],
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(a.href);
      a.remove();
    },
  });
};

export const useSupportUpdateStatusOrder = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: OrderService.updateStatusOrder,
    onSuccess(_, payload) {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.ORDERS],
      });
      onSuccess && onSuccess();
      if (payload.status === StatusOrderEnum.FINISH) {
        NotificationSuccess('Xác nhận đơn hàng thành công');
      } else if (payload.status === StatusOrderEnum.CANCELLED) {
        NotificationSuccess('Hủy đơn thành công');
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
export const useGetFileESim = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: OrderService.getESimFile,
    onSuccess(data, payload) {
      downloadFileFn(data, payload.fileName, 'application/vnd.ms-excel');
      onSuccess && onSuccess();
    },
  });
};
