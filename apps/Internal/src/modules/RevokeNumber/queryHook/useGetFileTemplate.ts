import { downloadFileFn } from '@react/utils/handleFile';
import { useMutation } from '@tanstack/react-query';
import useFileNameDownloaded from 'apps/Internal/src/components/layouts/store/useFileNameDownloaded';
import { axiosClient } from 'apps/Internal/src/service';
interface ExportRequest {
  uri: string;
  filename?: string;
}
const fetcher = ({ uri }: ExportRequest) => {
  return axiosClient.get<ExportRequest, Blob>(uri, {
    responseType: 'blob',
  });
};
export const useGetFileTemplate = () => {
  return useMutation({
    mutationFn: fetcher,
    onSuccess: (res: Blob) => {
      const nameFile = useFileNameDownloaded.getState().name;
      downloadFileFn(
        res,
        nameFile ? nameFile : 'Danh sách thu hồi số',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
    },
  });
};
