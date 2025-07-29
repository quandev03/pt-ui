import { AnyElement, IErrorResponse } from '@react/commons/types';
import { blobToJson } from '@react/helpers/utils';
import { downloadFileFn } from '@react/utils/handleFile';
import { useMutation } from '@tanstack/react-query';
import useFileNameDownloaded from 'apps/Partner/src/hooks/useFileNameDownloaded';
import { axiosClient } from 'apps/Partner/src/service';
import { NotificationError } from '@react/commons/Notification';
import { FILE_TYPE } from '@react/constants/app';
import { prefixSaleService } from '@react/url/app';
import { FormInstance } from 'antd';

interface CheckDataInput {
  file: AnyElement;
  checkSubmit?: boolean;
}

const fetcher = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await axiosClient.post<string, Blob>(
    `${prefixSaleService}/topup-package-transction/check-data`,
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
const useCheckData = (
  form: FormInstance,
  onSuccess?: (data: AnyElement) => void
) => {
  return useMutation({
    mutationFn: async ({ file }: CheckDataInput) => {
      return await fetcher(file);
    },
    onSuccess: async (data) => {
      const dataParser = await blobToJson<IErrorResponse>(data);
      onSuccess && onSuccess(dataParser);
    },
    onError: async (error: AnyElement, variables) => {
      const { checkSubmit } = variables;
      try {
        const dataParser = await blobToJson<IErrorResponse>(error);
        if (dataParser.errors?.length > 0) {
          form.setFields([
            {
              name: 'attachment',
              errors: [dataParser.errors[0].detail],
            },
          ]);
        } else if (checkSubmit && !dataParser.errors) {
          NotificationError(dataParser.detail);
        }
      } catch {
        if (checkSubmit) {
          NotificationError("File tải lên sai thông tin, Vui lòng kiểm tra lại")
          const name = useFileNameDownloaded.getState().name;
          downloadFileFn(
            error,
            name ? name : 'file_nap_tien_gan_goi_loi',
            FILE_TYPE.xlsx
          );
        }
      }
    },
  });
};
export default useCheckData;
