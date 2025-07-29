import { useMutation } from '@tanstack/react-query';
import { axiosClient } from '../service';
import { downloadFile } from '@react/utils/handleFile';

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

export const useExportMutation = () => {
  return useMutation({
    mutationFn: fetcher,
    onSuccess: (data, { filename }) => downloadFile(data, filename),
  });
};
