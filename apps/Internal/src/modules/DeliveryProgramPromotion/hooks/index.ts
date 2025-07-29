import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FormInstance } from 'antd';
import { Res, DeliveryProgramPromotionService } from '../services';
import { NotificationSuccess } from '@react/commons/Notification';
import { MESSAGE } from '@react/utils/message';
import { CommonError, FieldErrorsType } from '@react/commons/types';
import { ICategoryShippingPromotion } from '../types';



export const DELIVERY_PROGRAM_PROMOTION_QUERY_KEY = {
  LIST: 'query-list-delivery-program-promotion',
  DETAIL: 'query-detail-delivery-program-promotion'
};



export const useListDeliveryProgramPromotion = (body: any) => {
  return useQuery({
    queryFn: () => DeliveryProgramPromotionService.getList(body),
    queryKey: [DELIVERY_PROGRAM_PROMOTION_QUERY_KEY.LIST, body],
    select: (data: Res) => data,
    enabled: true,
  });
};

export const useAddDeliveryProgramPromotion = (
  onSuccess: () => void,
  form: FormInstance<any>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: DeliveryProgramPromotionService.add,
    onSuccess: () => {
      NotificationSuccess(MESSAGE.G01);
      queryClient.invalidateQueries({
        queryKey: [DELIVERY_PROGRAM_PROMOTION_QUERY_KEY.LIST],
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

export const useGetDetailDeliveryProgramPromotion = (id: string) => {
  return useQuery({
    queryKey: [DELIVERY_PROGRAM_PROMOTION_QUERY_KEY.DETAIL, id],
    queryFn: () => DeliveryProgramPromotionService.detail(id),
    select: (data: ICategoryShippingPromotion) => data,
    enabled: !!id,
  });
};

export function useDeleteDeliveryProgramPromotion(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: DeliveryProgramPromotionService.delete,
    onSuccess: () => {
      NotificationSuccess(MESSAGE.G03);
      queryClient.invalidateQueries({
        queryKey: [DELIVERY_PROGRAM_PROMOTION_QUERY_KEY.LIST],
      });
      onSuccess && onSuccess();
    },
  });

}

export function useUpdateDeliveryProgramPromotion(
  onSuccess: () => void,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: DeliveryProgramPromotionService.update,
    onSuccess: () => {
      NotificationSuccess(MESSAGE.G02);
      queryClient.invalidateQueries({
        queryKey: [DELIVERY_PROGRAM_PROMOTION_QUERY_KEY.LIST],
      });
      onSuccess();
    },
  });
}