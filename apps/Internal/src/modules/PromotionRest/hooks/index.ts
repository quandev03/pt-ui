import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FormInstance } from 'antd';
import { Res, PromotionRestService } from '../services';
import { NotificationSuccess } from '@react/commons/Notification';
import { MESSAGE } from '@react/utils/message';
import { CommonError, FieldErrorsType } from '@react/commons/types';
import { IPromotionRest } from '../types';

export const PROMOTION_REST_QUERY_KEY = {
  GET_LIST_PROMOTION_REST: 'query-list-promotion-rest',
  GET_DETAIL_PROMOTION_REST: 'query-detail-promotion-rest',
  DETAIL_EXECUTE_PROMOTION_REST: 'query-detail-execute-promotion-rest',
};

export const useListPromotionRest = (body: any) => {
  return useQuery({
    queryFn: () => PromotionRestService.getList(body),
    queryKey: [PROMOTION_REST_QUERY_KEY.GET_LIST_PROMOTION_REST, body],
    select: (data: Res) => data,
    enabled: true,
  });
};

export const useAddPromotionRest = (
  onSuccess: () => void,
  form: FormInstance<any>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: PromotionRestService.add,
    onSuccess: () => {
      NotificationSuccess(MESSAGE.G01);
      queryClient.invalidateQueries({
        queryKey: [PROMOTION_REST_QUERY_KEY.GET_LIST_PROMOTION_REST],
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

export function useUpdatePromotionRest(onSuccess: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: PromotionRestService.update,
    onSuccess: () => {
      NotificationSuccess(MESSAGE.G02);
      queryClient.invalidateQueries({
        queryKey: [PROMOTION_REST_QUERY_KEY.GET_LIST_PROMOTION_REST],
      });
      onSuccess();
    },
  });
}

export const useGetDetailPromotionRest = (id: string) => {
  return useQuery({
    queryKey: [PROMOTION_REST_QUERY_KEY.GET_DETAIL_PROMOTION_REST, id],
    queryFn: () => PromotionRestService.detail(id),
    select: (data: IPromotionRest) => data,
    enabled: !!id,
  });
};

export function useCheckExistsPromotionRest(
  onSuccess: (data?: any, isSubmitForm?: boolean) => void,
  onError: () => void
) {
  return useMutation({
    mutationFn: PromotionRestService.checkExists,
    onSuccess: (data, params) => {
      onSuccess(data, params.isSubmitForm);
    },
    onError: (err) => {
      onError();
    },
  });
}

export const useDetailExecutePromotionRest = (id: string) => {
  return useQuery({
    queryKey: [PROMOTION_REST_QUERY_KEY.DETAIL_EXECUTE_PROMOTION_REST, id],
    queryFn: () => PromotionRestService.detailExecutePromotion(id),
    enabled: !!id,
  });
};
