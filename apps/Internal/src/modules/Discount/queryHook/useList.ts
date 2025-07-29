import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { Discount } from '../services';
import { IDetail, ParamsDiscountManagement } from '../types';
import { NotificationSuccess } from '@react/commons/Notification';
import { MESSAGE } from '@react/utils/message';
import { IErrorResponse, IFieldErrorsItem } from '@react/commons/types';

export const useListDiscountManagement = (param: ParamsDiscountManagement) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_LIST_DISCOUNT_LIST, param],
    queryFn: () => Discount.getDiscountList(param),
  });
};

export const useListProducts = (categoryId: number | string | undefined) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.PRODUCT_LIST_FILTER_CATID, categoryId],
    queryFn: () =>
      Discount.getProductsList({
        categoryId: categoryId === -1 ? '' : categoryId,
      }),
    select: (data: any) => {
      if (!data) return [];
      const result = data.map((item: any) => ({
        label: item.productName,
        value: item.id,
      }));
      result.unshift({
        label: 'Tất cả',
        value: -1,
      });
      return result;
    },
  });
};

export const useGetDetailDiscount = (id: string | number) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_DETAIL_DISCOUNT, id],
    queryFn: () => Discount.getDiscountDetail(id),
    select: (data: IDetail) => data,
    enabled: !!id,
  });
};

export function useDeleteDiscount(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: Discount.deleteDiscount,
    onSuccess: () => {
      NotificationSuccess(MESSAGE.G03);
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_LIST_DISCOUNT_LIST],
      });
      onSuccess && onSuccess();
    },
  });
}

export const useAddDiscount = (
  onSuccess: () => void,
  onError: (errorField: IFieldErrorsItem[]) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: Discount.postAddDiscount,
    onSuccess: () => {
      NotificationSuccess('Thêm mới thành công');
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.PartnerCreditLimits],
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

export const useUpdateDiscount = (
  onSuccess: () => void,
  onError: (errorField: IFieldErrorsItem[]) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: Discount.putUpdateDiscount,
    onSuccess: () => {
      NotificationSuccess(MESSAGE.G02);
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_LIST_DISCOUNT_LIST],
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
