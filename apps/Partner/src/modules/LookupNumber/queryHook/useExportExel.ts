import { NotificationError, NotificationSuccess } from '@react/commons/index';
import { AnyElement, IErrorResponse } from '@react/commons/types';
import { downloadFileFn } from '@react/utils/handleFile';
import { useMutation } from '@tanstack/react-query';
import { exportExcel } from '../services';
import { blobToJson } from '@react/helpers/utils';
import useFileNameDownloaded from 'apps/Partner/src/hooks/useFileNameDownloaded';

export const useExportFile = () => {
  return useMutation({
    mutationFn: exportExcel,
    onSuccess: (data: Blob) => {
      const fileName = useFileNameDownloaded.getState().name;
      downloadFileFn(data, fileName ? fileName : 'danh_sach_so', data.type);
      NotificationSuccess('Xuất số thành công');
    },
    onError: async (error: AnyElement) => {
      console.log(error)
      try {
        const dataParser = await blobToJson<IErrorResponse>(error)
        NotificationError(dataParser.detail)
      } catch  {
        NotificationError('File tải lên sai thông tin, Vui lòng kiểm tra lại');
      }
    },

  });
};
