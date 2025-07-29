import { useMutation } from '@tanstack/react-query';
import useFileNameDownloaded from 'apps/Internal/src/components/layouts/store/useFileNameDownloaded';
import { getUrlDownloadFile } from '../services';
import { downloadFile } from '@react/utils/handleFile';

export const useGetUrlDownloadFile = () => {
  return useMutation({
    mutationFn: getUrlDownloadFile,
    onSuccess: (data) => {
      downloadFile(
        data,
        useFileNameDownloaded.getState().name
          ? useFileNameDownloaded.getState().name
          : 'Danh_sach_phan_phoi-so.xls'
      );
      useFileNameDownloaded.getState().setName('');
    },
  });
};
