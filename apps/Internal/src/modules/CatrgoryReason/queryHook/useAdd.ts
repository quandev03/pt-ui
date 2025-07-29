import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import {
  NotificationSuccess,
} from '@react/commons/Notification';
import { axiosClient } from 'apps/Internal/src/service';
import { FormInstance } from 'antd';
import { CommonError, FieldErrorsType } from '@react/commons/types';
import { prefixCatalogService } from 'apps/Internal/src/constants/app';

export interface ItemEdit {
  id?: string;
  saveForm?: boolean;
  reasonTypeId: number;
  reasonCode: string;
  reasonName: string;
  status: number;
}

const addApi = (data: ItemEdit) => {
  return axiosClient.post<any>(`${prefixCatalogService}/reason`, data);
};

export const useAddFn = (form: FormInstance<any>) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: addApi,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_LIST_REASONS],
      });
      NotificationSuccess('Thêm mới thành công!');

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
