import { NotificationSuccess } from '@react/commons/Notification';
import { FieldErrorsType, IErrorResponse } from '@react/commons/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FormInstance } from 'antd';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';
import { useNavigate } from 'react-router-dom';

const addSimReplacement = (form: any) => {
  const formData = new FormData();
  formData.append('isdnFile', form.isdnFile as Blob);
  formData.append('attachmentFile', form.attachmentFile as Blob);
  const request = JSON.stringify({
    simType: form.simType,
    stockCode: form.stockCode,
    email: form.email,
    description: form.description,
    partnerName: form.partnerName,
    partnerCode: form.supplier
  });
  formData.append(
    'request',
    new Blob([request], {
      type: 'application/json',
    })
  );
  return axiosClient.post<any, any>(
    `${prefixCustomerService}/change-sim-bulk`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data ',
      },
    }
  );
};
export const useAdd = (form: FormInstance) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: addSimReplacement,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_SIM_REPLACEMENT_LIST],
      });
      NotificationSuccess('Hệ thống đang xử lý đổi sim cho thuê bao');
      navigate(-1);
    },
    onError: (error: IErrorResponse) => {
      if (error.errors.length > 0) {
        form.setFields(
          error.errors.map((e: FieldErrorsType) => ({
            name: e.field,
            errors: [e.detail],
          }))
        );
      }
    },
  });
};
