import { downloadFile } from '@react/utils/handleFile';
import { axiosClient } from '../service';
import { AxiosResponse } from 'axios';
import { useMutation } from '@tanstack/react-query';

export const useDownloadReportKey = 'useDownloadReportKey';
interface ExportRequest {
  uri: string;
  filename?: string;
  params?: any;
}
const fetcher = async ({ uri, params, filename }: ExportRequest) => {
  const res = await axiosClient.get<ExportRequest, AxiosResponse<Blob>>(uri, {
    params,
    responseType: 'blob',
  });
  downloadFile(res.data, filename);
};
export const useExportReport = () => {
  return useMutation({
    mutationFn: fetcher,
  });
};
