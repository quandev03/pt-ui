import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ItemEdit } from './useAdd';
import { useNavigate } from 'react-router-dom';
import { axiosClient } from 'apps/Internal/src/service';
import {
  NotificationSuccess,
} from '@react/commons/Notification';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { CommonError, FieldErrorsType } from '@react/commons/types';
import { FormInstance } from 'antd';
import { prefixCatalogService } from 'apps/Internal/src/constants/app';

const editApi = (data: ItemEdit) => {
  return axiosClient.put<any>(
    `${prefixCatalogService}/reason` + `/${data.id}`,
    data
  );
};

export const useEditFn = (form: FormInstance<any>) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: editApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_LIST_REASONS],
      });
      NotificationSuccess('Cập nhật thành công');
      navigate(-1);
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
