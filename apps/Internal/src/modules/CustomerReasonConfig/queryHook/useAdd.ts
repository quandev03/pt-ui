import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import {
  NotificationError,
  NotificationSuccess,
} from '@react/commons/Notification';
import { axiosClient } from 'apps/Internal/src/service';
import { FormInstance } from 'antd';
import { prefixCustomerService } from '@react/url/app';
import { CommonError, FieldErrorsType } from '@react/commons/types';

export interface ItemEdit {
  id?: string;
  saveForm?: boolean;
  type: string;
  code: string;
  name: string;
  status: boolean;
  isFreeSim: boolean;
}

const addApi = (data: ItemEdit) => {
  return axiosClient.post<any>(`${prefixCustomerService}/reason`, data);
};

export const useAddFn = (form: FormInstance<any>) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: addApi,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_LIST_REASON_CUSTOMER],
      });
      NotificationSuccess('Thêm mới thành công!');
      form.resetFields();
      if (variables.saveForm) {
        form.resetFields();
      } else {
        navigate(-1);
      }
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
