import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FormInstance } from 'antd';
import { Res, DeliveryFeeCategoryService } from '../services';
import { NotificationSuccess } from '@react/commons/Notification';
import { MESSAGE } from '@react/utils/message';
import { CommonError, FieldErrorsType } from '@react/commons/types';
import { ICategoryDeliveryFee } from '../types';



export const DELIVERY_FEE_CATEGORY_QUERY_KEY = {
  LIST: 'query-list-delivery-fee-category',
  DETAIL: 'query-detail-delivery-fee-category'
};

export const useListDeliveryFeeCategory = (body: any) => {
  return useQuery({
    queryFn: () => DeliveryFeeCategoryService.getList(body),
    queryKey: [DELIVERY_FEE_CATEGORY_QUERY_KEY.LIST, body],
    select: (data: Res) => data,
    enabled: true,
  });
};

export const useAddDeliveryFeeCategory = (
  onSuccess: () => void,
  form: FormInstance<any>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: DeliveryFeeCategoryService.add,
    onSuccess: () => {
      NotificationSuccess(MESSAGE.G01);
      queryClient.invalidateQueries({
        queryKey: [DELIVERY_FEE_CATEGORY_QUERY_KEY.LIST],
      });
      onSuccess();
    },
    onError: (err: CommonError) => {
      if (err?.errors?.length > 0) {
        form.setFields(
          err?.errors?.map((item: FieldErrorsType) => ({
            name: item.field,
            errors: [item.detail],
          }))
        );
      }
    },
  });
};

export const useGetDetailDeliveryFeeCategory = (id: string) => {
  return useQuery({
    queryKey: [DELIVERY_FEE_CATEGORY_QUERY_KEY.DETAIL, id],
    queryFn: () => DeliveryFeeCategoryService.detail(id),
    select: (data: ICategoryDeliveryFee) => data,
    enabled: !!id,
  });
};

export function useDeleteDeliveryFeeCategory(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: DeliveryFeeCategoryService.delete,
    onSuccess: () => {
      NotificationSuccess(MESSAGE.G03);
      queryClient.invalidateQueries({
        queryKey: [DELIVERY_FEE_CATEGORY_QUERY_KEY.LIST],
      });
      onSuccess && onSuccess();
    },
  });
}

export function useUpdateDeliveryFeeCategory(
  onSuccess: () => void,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: DeliveryFeeCategoryService.update,
    onSuccess: () => {
      NotificationSuccess(MESSAGE.G02);
      queryClient.invalidateQueries({
        queryKey: [DELIVERY_FEE_CATEGORY_QUERY_KEY.LIST],
      });
      onSuccess();
    },
  });
}