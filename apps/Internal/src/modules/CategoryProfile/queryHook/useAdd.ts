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
import useGroupStore from '../store';

export interface ItemEdit {
  id?: string;
  saveForm?: boolean;
  code: string;
  value: string;
  status: number;
  isDefault: number;
}

const addApi = (data: ItemEdit) => {
  return axiosClient.post<any>(`${prefixCatalogService}/profile`, data);
};

export const useAddFn = (form: FormInstance<any>) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {isAutoDefault, setIsAutoDefault} = useGroupStore()
  return useMutation({
    mutationFn: addApi,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_LIST_OF_PROFILES],
      });
      NotificationSuccess('Thêm mới thành công!');

      if (variables.saveForm) {
        form.resetFields();
        if(isAutoDefault) {
          setIsAutoDefault(false);
          form.setFieldValue('isDefault', false)
        }
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
