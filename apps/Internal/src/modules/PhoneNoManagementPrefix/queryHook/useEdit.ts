import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ItemEdit } from './useAdd';
import { useNavigate } from 'react-router-dom';
import { axiosClient } from 'apps/Internal/src/service';
import {
  NotificationError,
  NotificationSuccess,
} from '@react/commons/Notification';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { prefixCatalogService } from 'apps/Internal/src/constants/app';
import { FormInstance } from 'antd';
import { CommonError, FieldErrorsType } from '@react/commons/types';

const editApi = (data: ItemEdit) => {
  return axiosClient.put<any>(
    `${prefixCatalogService}/isdn-prefix` + `/${data.id}`,
    data
  );
};

export const useEditFn = (form: FormInstance) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: editApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_LIST_PHONE_NO_PREFIX],
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
