import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { NotificationSuccess } from '@react/commons/Notification';
import { axiosClient } from 'apps/Internal/src/service';
import { FormInstance } from 'antd';
import { prefixCustomerService } from '@react/url/app';
import { CommonError, FieldErrorsType } from '@react/commons/types';
import dayjs from 'dayjs';
import { DateFormat } from '@react/constants/app';

export interface ItemEdit {
  id?: number;
  saveForm?: boolean;
  promotionId: number;
  startProcess: string;
  note: string;
}

const addApi = ({ files, form }: any) => {
  const formData = new FormData();
  Object.keys(files).forEach((key: string) => {
    if (files[key]) {
      formData.append(key, files[key] as Blob);
    }
  });

  const details = JSON.stringify(
    form.startProcess
      ? {
          promotionId: form.promotionId,
          startProcess: dayjs(form.startProcess).format().slice(0, 19),
          note: form.note,
        }
      : {
          promotionId: form.promotionId,
          note: form.note,
        },
    null,
    2
  );
  formData.append('data', details);

  return axiosClient.post<any>(
    `${prefixCustomerService}/promotion/execute/create`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data ',
      },
    }
  );
};

export const useAddFn = (form: FormInstance<any>) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: addApi,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_LIST_PROMOTION_HISTORY],
      });
      NotificationSuccess('Hệ thống lưu thông tin cấu hình chạy CTKM thành công');
      if (form.getFieldValue('saveForm')) {
        form.resetFields();
      } else {
        form.resetFields();
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
