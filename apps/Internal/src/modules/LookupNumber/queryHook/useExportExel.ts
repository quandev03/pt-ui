import { NotificationSuccess } from '@react/commons/index';
import { useMutation } from '@tanstack/react-query';
import { exportExcel } from '../services';
import { downloadFileFn } from '@react/utils/handleFile';
import useFileNameDownloaded from 'apps/Internal/src/components/layouts/store/useFileNameDownloaded';

export const useExportFile = () => {
  return useMutation({
    mutationFn: exportExcel,
    onSuccess: (data: Blob) => {
      const fileName = useFileNameDownloaded.getState().name;
      downloadFileFn(data, fileName ? fileName : 'danh_sach_so', data.type);
      NotificationSuccess('Xuất số thành công !');
    },
  });
};
