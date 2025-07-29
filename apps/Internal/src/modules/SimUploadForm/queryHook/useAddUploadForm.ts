import {
  NotificationError,
  NotificationSuccess,
} from '@react/commons/Notification';
import { AnyElement, IErrorResponse } from '@react/commons/types';
import { MESSAGE } from '@react/utils/message';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FormInstance } from 'antd';
import { prefixResourceService } from 'apps/Internal/src/constants/app';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';
import { OrderLinePayload } from '../types';

const addUploadForm = ({
  deliveryOrderNo,
  formValue,
  orderLines,
}: {
  deliveryOrderNo: string;
  formValue: AnyElement;
  orderLines: OrderLinePayload[];
}) => {
  const formData = new FormData();
  const { uploadOrderNo, description, attachments } = formValue;
  const isHasFile = attachments && attachments[0].files;
  const request = {
    deliveryOrderNo: deliveryOrderNo,
    uploadOrderNo: uploadOrderNo,
    description: description,
    ...(isHasFile && {
      attachmentDescriptions: attachments.map((file: AnyElement) => file.desc),
    }),
    orderLines: orderLines,
  };
  formData.append(
    'request',
    new Blob([JSON.stringify(request)], { type: 'application/json' })
  );
  if (isHasFile) {
    attachments.forEach((item: any) => {
      item && formData.append('attachmentFiles', item.files as Blob);
    });
  }

  return axiosClient.post<any, any>(
    `${prefixResourceService}/stock-product-upload-order`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
};
export const useAddUploadForm = (form: FormInstance, orderLineForm: FormInstance, onSuccess: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addUploadForm,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_UPLOAD_SIM_FORM_LIST],
      });
      NotificationSuccess(MESSAGE.G01);
      onSuccess();
    },
    onError: (error: IErrorResponse) => {
      if (error.errors.length) {
        form.setFields(
          error.errors.map((err) => ({
            name: err.field,
            errors: [err.detail],
          }))
        );
        orderLineForm.setFields(
          error.errors.map((err) => ({
            name: err.field.includes('orderLines') ? [+err.field.split(",")[1], 'amountNumber'] : err.field,
            errors: [err.detail],
          }))
        )
      } else {
        NotificationError(error.detail);
      }
    },
  });
};
