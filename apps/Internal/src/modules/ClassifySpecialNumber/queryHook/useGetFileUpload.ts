import { useMutation } from '@tanstack/react-query';
import useFileNameDownloaded from 'apps/Internal/src/components/layouts/store/useFileNameDownloaded';
import { axiosClient } from 'apps/Internal/src/service';
import { downloadFile } from '../constant';

interface ExportRequest {
  uri: string;
  filename?: string;
  params?: any;
}

const fetcher = ({ uri, params }: ExportRequest) => {
  return axiosClient.get<ExportRequest, Blob>(uri, {
    params,
    responseType: 'blob',
  });
};

export const useGetFileUpload = () => {
  return useMutation({
    mutationFn: fetcher,
    onSuccess: (data, { filename }) => {
      const name = useFileNameDownloaded.getState().name;
      downloadFile(data, name ? name : filename);
    },
  });
};
