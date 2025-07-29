import { NotificationSuccess } from '@react/commons/Notification';
import { CommonError, FieldErrorsType } from '@react/commons/types';
import { prefixCustomerService } from '@react/url/app';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FormInstance } from 'antd';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';

const fetcher = async (id: string) => {
  return await axiosClient.put<any>(
    `${prefixCustomerService}/promotion/execute/cancel/${id}`
  );
};

export const useCancel = (
  form: FormInstance<any>,
  onSuccess: (data: any) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fetcher,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_DETAIL_PROMOTION_HISTORY],
      });
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_LIST_PROMOTION_HISTORY],
      });
      NotificationSuccess('Hệ thống đã hủy CTKM');
      onSuccess(data);
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
