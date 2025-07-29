import {
  NotificationError,
  NotificationSuccess,
} from '@react/commons/Notification';
import { FieldErrorsType, IErrorResponse } from '@react/commons/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FormInstance } from 'antd';
import { prefixCatalogService } from 'apps/Internal/src/constants/app';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';
import { useNavigate } from 'react-router-dom';
import { PayloadSupplier } from '../types';

const addApi = (data: PayloadSupplier) => {
  return axiosClient.post<any>(`${prefixCatalogService}/supplier`, data);
};
export const useAdd = (form: FormInstance) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: addApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_SUPPLIER_LIST],
      });
      NotificationSuccess('Thêm mới thành công!');
      if (form.getFieldValue('saveForm')) {
        form.resetFields();
        form.setFieldValue('status', true);
      } else {
        navigate(-1);
      }
    },
    onError: (error: IErrorResponse) => {
      if (error.errors.length) {
        form.setFields(
          error.errors.map((e: FieldErrorsType) => ({
            name: e.field,
            errors: [e.detail],
          }))
        );
      } else {
        NotificationError(error.detail);
      }
    },
  });
};
