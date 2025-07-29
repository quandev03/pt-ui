import { NotificationSuccess } from '@react/commons/Notification';
import { CommonError, FieldErrorsType } from '@react/commons/types';
import { formatDateBe } from '@react/constants/moment';
import { prefixCustomerService } from '@react/url/app';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FormInstance } from 'antd';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

const editApi = ({ files, form }: any) => {
  const formData = new FormData();

  if (files && typeof files === 'object') {
    Object.keys(files).forEach((key: string) => {
      if (files[key]) {
        formData.append(key, files[key] as Blob);
      }
    });
  }

  const details = JSON.stringify(
    {
      promotionId: form.promotionId,
      startProcess: dayjs(form.startProcess).format(formatDateBe),
      note: form.note,
      id: form.id,
    },
    null,
    2
  );
  formData.append('data', details);

  return axiosClient.put<any>(
    `${prefixCustomerService}/promotion/execute/update`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data ',
      },
    }
  );
};

export const useEditFn = (form: FormInstance) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: editApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_LIST_PROMOTION_HISTORY],
      });
      NotificationSuccess(
        'Hệ thống lưu thông tin cấu hình chạy CTKM thành công'
      );
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
