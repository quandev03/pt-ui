import { useMutation } from '@tanstack/react-query';
import { NotificationError } from '@react/commons/index';
import { axiosClient } from 'apps/Internal/src/service';
import { prefixResourceService } from '@react/url/app';
import { CommonError, FieldErrorsType, IErrorResponse } from '@react/commons/types';
import { FormInstance } from 'antd';

const getInfoFile = (formData: any) => {
  return axiosClient.post(
    `${prefixResourceService}/stock-product-serial-upload/valid-product-serial-upload/${formData.get(
      'id'
    )}`,
    formData,
    {}
  );
};

export const useGetFile = (form: FormInstance, onSuccess: (data: any) => void) => {
  return useMutation({
    mutationFn: getInfoFile,
    onSuccess: async (data: any) => {
      onSuccess(data);
      return data;
    },
    onError: (err: CommonError) => {
      if (err?.errors?.length > 0) {
        form.resetFields(['fileProducts'])
        form.setFields(
          err?.errors?.map((item: FieldErrorsType) => ({
            name: item.field === 'deliveryOrderLineId' ? 'uploadOrderId' : item.field ,
            errors: [item.detail],
          }))
        );
      }
    },
  });
};
