import {
  NotificationError,
  NotificationSuccess,
} from '@react/commons/Notification';
import { AnyElement, IErrorResponse } from '@react/commons/types';
import { MESSAGE } from '@react/utils/message';
import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Partner/src/service';
import { IPayloadRegister } from '../type';
import { prefixSaleService } from '@react/url/app';
import { FormInstance } from 'antd';
import { blobToJson } from '@react/helpers/utils';
import useFileNameDownloaded from 'apps/Partner/src/hooks/useFileNameDownloaded';
import { downloadFileFn } from '@react/utils/handleFile';
import { FILE_TYPE } from '@react/constants/app';
const fetcher = async (data: AnyElement) => {
  const formData = new FormData();
  formData.append('file', data.file);
  formData.append(
    'request',
    new Blob([JSON.stringify(data.otpConfirmRequest)], {
      type: 'application/json',
    })
  );
  const res = await axiosClient.post<IPayloadRegister, IPayloadRegister>(
    `${prefixSaleService}/topup-package-transction/confirm-otp`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      responseType: 'blob',
    }
  );
  return res;
};
const useAdd = (onSuccess: () => void, form: FormInstance) => {
  return useMutation({
    mutationFn: fetcher,
    onSuccess: () => {
      NotificationSuccess("Tải file lên thành công. Hệ thống đang xử lý, vui lòng xem kết quả trên danh sách");
      onSuccess && onSuccess();
    },

    onError: async (error: AnyElement) => {
      try {
        const dataParser = await blobToJson<IErrorResponse>(error);
        console.log(dataParser, "dataParser")
        if (dataParser.errors && dataParser.errors?.length > 0) {
          form.setFields([
            {
              name: dataParser.errors[0].field,
              errors: [dataParser.errors[0].detail],
            },
          ]);
        }
        else {
          NotificationError(dataParser.detail);
        }
      } catch {
        NotificationError("File tải lên sai thông tin, Vui lòng kiểm tra lại")
        const name = useFileNameDownloaded.getState().name;
        downloadFileFn(
          error,
          name ? name : 'file_nap_tien_gan_goi_loi',
          FILE_TYPE.xlsx
        );
      }
    },
  });
};
export default useAdd;
