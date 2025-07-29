import { NotificationSuccess } from '@react/commons/Notification';
import { CommonError, FieldErrorsType } from '@react/commons/types';
import { prefixResourceService } from '@react/url/app';
import { MESSAGE } from '@react/utils/message';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FormInstance } from 'antd';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';
import { useNavigate } from 'react-router-dom';

const fetcher = (form: any) => {
  const formData = new FormData();
  const files = form?.files;
  const attachNotes = [];

  if (files && files.length > 0) {
    files
      .filter((item) => !item.id)
      .forEach((item) => {
        formData.append('attachmentFiles', item.files as Blob);
        attachNotes.push(item.desc);
      });
  }
  // console.log("PRE CHECK TO SEND ", form, "    ", JSON.stringify({
  //   uploadSourceNo: form.uploadSourceNo,
  //   uploadSourceType: form.uploadSourceType,
  //   productId: form.productId,
  //   description: '',
  //   attachmentDescriptions: attachNotes
  // }));

  const request = new Blob(
    [
      JSON.stringify({
        uploadSourceNo: form.uploadSourceNo,
        uploadSourceType: form.uploadSourceType,
        productId: form.productId,
        description: '',
        attachmentDescriptions: attachNotes,
      }),
    ],
    { type: 'application/json' }
  );
  formData.append('request', request);
  formData.append('uploadSerialFile', form.fileProducts as Blob);
  return axiosClient.post(
    `${prefixResourceService}/stock-product-serial-upload`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data ',
      },
    }
  );
};

export const useAddUploadSim = (
  form: FormInstance,
  onSuccess: (data: any) => void
) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fetcher,
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_LIST_UPLOAD_SIM],
      });
      NotificationSuccess(MESSAGE.G01);
      onSuccess(data);
      if (form.getFieldValue('saveForm')) {
        form.resetFields();
      } else {
        navigate(-1);
      }
    },
    onError: (err: CommonError) => {
      if (err?.errors?.length > 0) {
        form.setFields(
          err?.errors?.map((item: FieldErrorsType) => ({
            name:
              item.field === 'deliveryOrderLineId'
                ? 'uploadOrderId'
                : item.field,
            errors: [item.detail],
          }))
        );
      }
    },
  });
};
