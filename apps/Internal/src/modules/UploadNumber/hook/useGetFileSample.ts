import { useMutation } from '@tanstack/react-query';
import { downloadFileFn } from '@vissoft-react/common';
import { safeApiClient } from 'apps/Internal/src/services';
interface ExportRequest {
  uri: string;
  filename?: string;
}

const fetcher = ({ uri }: ExportRequest) => {
  return safeApiClient.get<Blob>(uri, {
    responseType: 'blob',
  });
};
export const useGetFileSample = () => {
  return useMutation({
    mutationFn: fetcher,
    onSuccess: (res: Blob) => {
      downloadFileFn(res, 'Danh sách tài nguyên số', 'text/csv');
    },
  });
};
