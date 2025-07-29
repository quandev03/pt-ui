import { useMutation } from '@tanstack/react-query';
import { getActionSample } from '../services';
import { downloadFile } from '@react/utils/handleFile';
import useFileNameDownloaded from 'apps/Internal/src/components/layouts/store/useFileNameDownloaded';

export const useGetActionSample = () => {
  return useMutation({
    mutationFn: getActionSample,
    onSuccess: (data, { filename }) => {
      const fileStore = useFileNameDownloaded.getState().name;
      downloadFile(data, fileStore);
    },
  });
};
