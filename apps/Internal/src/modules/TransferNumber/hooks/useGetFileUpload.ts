import { useMutation } from '@tanstack/react-query';
import { getFileUpload } from '../services/service';
import { downloadFile } from '../constants/index';
import useFileNameDownloaded from 'apps/Internal/src/components/layouts/store/useFileNameDownloaded';

export const useGetFileUpload = () => {
  return useMutation({
    mutationFn: getFileUpload,
    onSuccess: (data, { filename }) => {
      const nameFile = useFileNameDownloaded.getState().name;
      downloadFile(data, nameFile ? nameFile : filename);
    },
  });
};
