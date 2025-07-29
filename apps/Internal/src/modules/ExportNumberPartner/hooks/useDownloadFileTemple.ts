import { prefixResourceService } from '@react/url/app';
import { downloadFile, downloadFileFn } from '@react/utils/handleFile';
import { useMutation } from '@tanstack/react-query';
import useFileNameDownloaded from 'apps/Internal/src/components/layouts/store/useFileNameDownloaded';
import { axiosClient } from 'apps/Internal/src/service';

const fetcher = () => {
  return axiosClient.get<string, Blob>(
    `${prefixResourceService}/export-number-for-partner/samples/xlsx`,
    {
      responseType: 'blob',
    }
  );
};

export const useDownloadFileTemple = () => {
  return useMutation({
    mutationFn: fetcher,
    onSuccess: (data) => {
      const fileStore = useFileNameDownloaded.getState().name;
      downloadFileFn(data, fileStore ? fileStore : '', data.type);
    },
  });
};
